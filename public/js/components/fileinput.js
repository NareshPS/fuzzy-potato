import { mapMutations } from "vuex"
import { range } from "orb-array"
import { ADDITION, UPDATION } from "../state/mutations"

export const fileinput = {
  props: ['item'],
  emits: ['close'],

  computed: {
    pobjects() {return this.$store.state.pobjects},
    values() {return this.$store.state.values},
    files() {
      const container = this.values[this.item.items[0].id] || []

      // console.info(`files: `, container, range(container.length).map((index) => container.item(index)))
      return range(container.length).map((index) => container.item(index))
    }
  },

  methods: {
    ...mapMutations([ADDITION, UPDATION]),
    selection(el) {
      const [inputitem] = this.item.items // item that invoked the file input
      inputitem.value = el.target.files

      this.UPDATION({type: 'pobjects', key: this.item.id, updates: {items: [inputitem]}})
      this.ADDITION({type: 'values', key: inputitem.id, value: el.target.files})

      this.$emit('close')
    },

    close() {this.$emit('close')},
  },

  template: `
  <section class="fileinput">
    <div class="section-head">
      <h5>Files</h5>
    </div>
    <ul v-if="files.length != 0">
      <li v-for="file in files">{{file.name}}</li>
    </ul>

    <div>
      <h6>Select</h6>
      <input
        type="file"
        title="Select files"
        placeholder="Select files"
        accept="image/x-png"
        @change="selection"
        multiple
      >
      <button @click="close">Close</button>
    </div>
  </section>
  `
}