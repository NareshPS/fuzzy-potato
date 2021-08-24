import { last, reduce } from "orb-array"
import { mapMutations } from "vuex"
import {drop} from 'orb-vue-dragdrop'
import { value as graphValue } from '../../functions/graph'
import { ADDITION, OUTPUT, DELETION, UPDATION } from "../../state/mutations"
import { blockname } from "./blockname"
import { lookup } from "../../functions/lookup"
import { visuals } from "./visuals"

/**
 * Invariants:
 * The pobjects combination adds dragged pobjects as a last child to the dropped object.
 * The function drop creates a new pobjects with the function as a child.
 * The pobject is resolved from right to left. The pobject values are cached until a function is encountered.
 * The function uses the values evaluated so far as argument.
 * The function creates a new value that will become an argument for the upstream function.
 */
export const pobject = {
  components: { blockname, drop, visuals},
  props: ['item'],
  emits: ['textinput', 'fileinput'],
  computed: {
    pobjects() {return this.$store.state.pobjects},
    functions() {return this.$store.state.functions},
    values() {return this.$store.state.values},

    input() { return this.item.items[0].input },
    editable() {return this.item.items.length == 1 && this.input},
  },

  methods: {
    ...mapMutations([OUTPUT, ADDITION, UPDATION, DELETION]),
    renaming(name) {
      this.UPDATION({
        type: 'pobjects',
        key: this.item.id,
        updates: {name}
      })
    },

    decomposition() {
      const recent = last(this.item.items) || {}
      const bench = (po) => {
        this.ADDITION({type: 'pobjects', key: po.id, value: po})
        this.DELETION({type: 'values', key: this.item.id})
      }

      recent.type === 'pobject'? bench(this.item.items.pop()): ({})
    },

    edit() {
      console.info(`pobject.edit: item: %O input: %O`, this.item, this.input)

      this.editable? this.$emit(`${this.input}input`, this.item): this.decomposition()
    },
        
    elprops(el) {
      const afn = a => el.getAttribute(a)
      return reduce.o(['name'], {value: afn})
    }, // dropped object props

    visualization(el /*visual element*/) {
      const props = this.elprops(el)
      const visual = lookup(props, 'name', '')

      this.UPDATION({
        type: 'pobjects',
        key: this.item.id,
        updates: {visual}
      })

      console.info('pobject: new value: %O visual: %O', visual, this.visual)
    },

    async evaluation() {
      // Clear the old value
      this.DELETION({type: 'values', key: this.item.id})

      // Calculate the new value
      const value = graphValue(this.item, this.functions, this.values)
      // console.info(`evaluation: `, this.item, value, this.values)
      this.UPDATION({type: 'values', key: this.item.id, value})

      value
      .then((pv) => this.OUTPUT({type: 'bench', data: {id: this.item.id, value: pv}}))
      .catch(err => this.OUTPUT({type: 'bench', data: err}))
    }
  },

  template: `
  <drop
    :id="item.id" :name="item.name"
    class="pobject"
    select="div:first-child.velement"
    @dblclick.stop.prevent="edit"
    @dropped="visualization"
  >
    <blockname :item="item" @renaming="renaming"></blockname>
    <visuals :item="item"></visuals>
    <button @click="evaluation">Evaluate</button>
  </drop>
  `
}