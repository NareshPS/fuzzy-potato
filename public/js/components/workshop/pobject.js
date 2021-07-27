import { mapMutations } from "vuex"
import { value as graphValue } from '../../functions/graph'
import { makeId } from "../../functions/random"
import { images } from "./visuals/images"
import { text as texttype } from "./visuals/text"

export const pobject = {
  components: {images, texttype},
  props: ['item'],
  emits: ['textinput', 'fileinput'],
  data() {
    return {
      visuals: {
        images: {id: makeId(), label: 'Images'},
        text: {id: makeId(), label: 'Text'}
      },
      visual: ''
    }
  },
  computed: {
    pobjects() {return this.$store.state.pobjects},
    functions() {return this.$store.state.functions},
  },

  methods: {
    ...mapMutations(['BENCHERROR', 'UPDATION']),
    named(evt) {
      this.UPDATION({
        type: 'pobjects',
        key: this.item.id,
        updates: {name: evt.currentTarget.value}
      })
    },

    visualChange() {
      console.info(this.visualType)
      this.UPDATION({
        type: 'pobjects',
        key: this.item.id,
        updates: {visuals: {type: this.visual}}
      })
    },

    visualActive() {
      console.info(`visualActive: `, this.visual && this.item.value)
      return this.visual && this.item.value
    },

    inputType() {
      console.info(`inputType: `, this.item)
      return this.item.items[0].input
    },
    
    userInput() {
      const type = this.inputType()
      console.info(`userInput: `, this.item, type)

      type? this.$emit(`${type}input`, this.item): ({})
    },

    async evaluation() {
      try {
        const value = graphValue(this.item, this.functions)
        console.info(`evaluation: `, this.item, value)
        this.UPDATION({type: 'pobjects', key: this.item.id, updates: {value}})
      } catch (e) {
        console.info(`evaluation: `, e.stack)
        this.BENCHERROR({message: e.stack, source: 'pobject'})
      }
    }
  },

  template: `
  <div
    :id="item.id" :name="item.name"
    class="pobject"
    @dblclick.stop.prevent="userInput"
  >
    <input placeholder="name" :value="item.name" @change="named">
    <ul>
      <li v-for="(v, name) in visuals">
        <input
          name="visuals" type="radio" title="Select a visual type" :value="name"
          :id="v.id" v-model="visual"
          @change="visualChange"
        >
        <label for="v.id">{{v.label}}</label>
      </li>
    </ul>
    <component v-if="visualActive()" :is="visual" :value="item.value"></component>
    <h6 v-for="poi in item.items">{{poi.id}}</h6>
    <button @click="evaluation">Evaluate</button>
  </div>
  `
}