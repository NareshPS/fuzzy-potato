import { mapMutations } from "vuex"

export const textinput = {
  props: ['item'],
  emits: ['close'],
  data() { return { value: "" } },
  mounted() {this.value = this.text},

  computed: {
    pobjects() {return this.$store.state.pobjects},
    values() {return this.$store.state.values},
    text() {return this.values[this.item.items[0].id]}
  },

  methods: {
    ...mapMutations(['ADDITION']),
    valued() {
      const [vi] = this.item.items // value item
      this.ADDITION({type: 'values', key: vi.id, value: this.value})
      this.$emit('close')
    },
  },

  template: `
  <div class="textinput">
    <h6>Code</h6>
    <textarea v-model="value"></textarea>
    <div>
      <button @click="valued">Set</button>
    </div>
  </div>
  `
}