import { watchEffect } from "vue"

export const image = {
  props: ['value'],
  mounted() {
    watchEffect(_ => { this.paint() })
  },

  methods: {
    paint() {
      const ctx = this.$el.getContext("2d")
      const imgContext = ctx.createImageData(this.value.width, this.value.height)
      
      this.value.blob.forEach((rpv, index) => { imgContext.data[index] = rpv })
      ctx.putImageData(imgContext, 0, 0)
    }
  },

  template: `
  <canvas :width="value.width" :height="value.height"></canvas>
  `
}