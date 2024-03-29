import { watchEffect } from "vue"
import { mapMutations } from "vuex"
import { pixels } from "../../../functions/image"
import { OUTPUT } from "../../../state/mutations"
import { canvasitem } from "./canvasitem"

export const images = {
  components: {canvasitem},
  props: ['section', 'value'],

  data() {
    return {
      artifacts: []
    }
  },

  mounted() {
    watchEffect(_ => {
      console.info(`image.value: `, this.value)
      this.value
      ? this.value
      .then(vs => Promise.all(vs.map((v) => pixels(v))))
      .then(vs => this.artifacts = vs)
      .catch(err => this.OUTPUT({type: this.section, data: err}))
      : []
    })
  },

  methods: {
    ...mapMutations([OUTPUT]),
  },

  template:`
  <figure class="visual-images">
    <canvasitem v-for="artifact in artifacts" :value="artifact"></canvasitem>
  </figure>
  `
}