import { watchEffect } from "vue"
import { mapMutations } from "vuex"
import { OUTPUT } from "../../../state/mutations"
import {canvasitem} from './canvasitem'

export const canvas = {
  components: {canvasitem},
  props: ['section', 'value'],

  data() {
    return {
      artifacts: []
    }
  },

  mounted() {
    watchEffect(_ => {
      console.info(`canvas: value: `, this.value)
      this.value
      ? this.value
      .then(vs => this.artifacts = vs)
      .catch(err => this.OUTPUT({type: this.section, data: err}))
      : []
    })
  },

  methods: {
    ...mapMutations([OUTPUT]),
  },

  template:`
  <figure class="vis-canvas">
    <canvasitem v-for="artifact in artifacts" :value="artifact"></canvasitem>
  </figure>
  `
}