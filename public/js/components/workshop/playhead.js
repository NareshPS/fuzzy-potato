import { saveObject } from "../../functions/browser"
import { state } from "../../functions/pobject"

export const playhead = {
  computed: {
    pobjects() {return this.$store.state.pobjects},
    values() {return this.$store.state.values},
  },

  methods: {
    save() {
      const data = state.encode(this.pobjects, this.values)
      saveObject(data)
    }
  },
  template: `
  <div class="playhead section-head">
    <h5>Bench</h5>
    <button
      class="savepobjects float-right"
      title="save"
      @click="save"
    >S
    </button>
  </div>
  `
}