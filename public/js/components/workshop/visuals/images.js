import { watchEffect } from "vue"
import { mapMutations } from "vuex"
import { pixels } from "../../../functions/image"
import {image as imagetype} from './image'
import { BENCHERROR } from "../../../state/mutations"

export const images = {
  components: {imagetype},
  props: ['value'],

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
      .catch(err => this.BENCHERROR({message: err}))
      : []
    })
  },

  methods: {
    ...mapMutations([BENCHERROR]),
  },

  template:`
  <figure class="visual-images">
    <imagetype v-for="artifact in artifacts" :value="artifact"></imagetype>
  </figure>
  `
}