import { mapMutations } from "vuex"

export const fileinput = {
  props: ['item'],
  emits: ['close'],
  data() {
    return {
      value: ""
    }
  },

  computed: {
    pobjects() {return this.$store.state.pobjects}
  },

  methods: {
    ...mapMutations(['UPDATION']),
    selection(el) {
      const [inputitem] = this.item.items // item that invoked the file input
      inputitem.value = el.target.files
      this.UPDATION({type: 'pobjects', key: this.item.id, updates: {items: [inputitem]}})
    },
    done(evt) { this.$emit('close') },
  },

  template: `
  <div class="fileinput">
    <h6>Upload Files</h6>
    <input
      type="file"
      title="Select images"
      placeholder="Select images"
      accept="image/x-png"
      @change="selection"
      multiple
    >
    <div>
      <button @click="done">Done</button>
    </div>
  </div>
  `
}