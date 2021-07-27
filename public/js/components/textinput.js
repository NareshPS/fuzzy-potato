import { mapMutations } from "vuex"

export const textinput = {
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
    valued(evt) {
      this.$emit('close')
    },
  },

  template: `
  <div class="textinput">
    <h6>Input Code</h6>
    <textarea v-model="value"></textarea>
    <div>
      <button @click="valued">Set</button>
    </div>
  </div>
  `
}