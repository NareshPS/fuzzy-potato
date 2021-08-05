import { watchEffect } from "vue"
import { mapMutations } from "vuex"
import { value as graphValue } from '../../functions/graph'
import { makeId } from "../../functions/random"
import { BENCHERROR, DELETION, UPDATION } from "../../state/mutations"
import { images } from "./visuals/images"
import { texts } from "./visuals/texts"

export const pobject = {
  components: {images, texts},
  props: ['item'],
  emits: ['textinput', 'fileinput'],
  data() {
    return {
      visuals: {
        images: {id: makeId(), label: 'Images'},
        texts: {id: makeId(), label: 'Texts'}
      },
      visual: '',
      placeholder: '',
    }
  },
  mounted() {
    /**
     * Apply value updates to the placeholder.
     */
    watchEffect(_ => {
      const assignfn = (rv /**raw value */) => {
        rv instanceof Promise
        ? rv.then((v) => this.placeholder = v)
        : (this.placeholder = rv)
      }

      this.item.value && assignfn(this.item.value)
    })

    /**Initial placeholder value */
    this.item.items.length == 1 && (this.placeholder = this.item.items[0].name) 
  },
  computed: {
    visualSelector() { return `${item.id}-visuals`},
    pobjects() {return this.$store.state.pobjects},
    functions() {return this.$store.state.functions},
    values() {return this.$store.state.values},
  },

  methods: {
    ...mapMutations([BENCHERROR, UPDATION, DELETION]),
    named(evt) {
      this.UPDATION({
        type: 'pobjects',
        key: this.item.id,
        updates: {name: evt.currentTarget.value}
      })
    },

    visualChange() {
      console.info(this.visual)
      this.UPDATION({
        type: 'pobjects',
        key: this.item.id,
        updates: {visuals: {type: this.visual}}
      })
    },

    visualActive() {
      // console.info(`visualActive: `, this.visual && this.item.value)
      return this.visual && this.item.value
    },

    inputType() {
      // console.info(`inputType: `, this.item)
      return this.item.items[0].input
    },
    
    userInput() {
      const type = this.inputType()
      // console.info(`userInput: `, this.item, type)

      type? this.$emit(`${type}input`, this.item): ({})
    },

    async evaluation() {
      try {
        // Clear the old value
        this.DELETION({type: 'values', key: this.item.id})

        // Calculate the new value
        const value = graphValue(this.item, this.functions, this.values)
        // console.info(`evaluation: `, this.item, value, this.values)
        this.UPDATION({type: 'pobjects', key: this.item.id, updates: {value}})
      } catch (e) {
        this.BENCHERROR({message: e.stack, source: 'pobject'})

        throw e
      }
    }
  },

  template: `
  <div
    :id="item.id" :name="item.name"
    class="pobject"
    @dblclick.stop.prevent="userInput"
  >
    <input :placeholder="placeholder" :value="item.name" @change="named">
    <ul>
      <li v-for="(v, name) in visuals">
        <input
          name="visualSelector" type="radio" title="Select a visual type" :value="name"
          :id="v.id" v-model="visual"
          @change="visualChange"
        >
        <label for="v.id">{{v.label}}</label>
      </li>
    </ul>
    <component v-if="visualActive()" :is="visual" :value="item.value"></component>
    <button @click="evaluation">Evaluate</button>
  </div>
  `
}