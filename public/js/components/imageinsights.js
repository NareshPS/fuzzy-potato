import { imagecanvas } from "./workshop/visualtypes/image"
import { drag, drop } from "./drag"
import { range, reduce } from "orb-array"
import { makeId } from "../random"
import { filePixels } from "../functions/image"

export const imageinsights = {
  components: {drag, drop, imagecanvas},
  props: ['blobs'],
  data() {
    return {
      playImages: {},
    }
  },

  methods: {
    selection(el) {
      Object.keys(this.blobs)
      .forEach((k) => delete this.blobs[k])
      
      const files = el.target.files

      range(files.length)
      .forEach((index) => {
        const file = files[index]

        filePixels(file)
        .then(po => this.blobs[file.name] = { ...po, id: po.name})
      })

      this.$emit('update:blobs', this.blobs)
    },

    attributes(el) {
      const fn = (v) => el.getAttribute(v)

      return reduce.o(
        ['id'], // attribute names
        { value: fn } // CHECK
      )
    },

    dropped({source}) {
      const sid = this.attributes(source).id // source id
      const tid = makeId()// target id

      this.playImages[tid] = {...(this.blobs[sid] || this.playImages[sid]), id: tid}
    }
  },

  template: `
  <div>
    <input
      type="file"
      title="Select images"
      placeholder="Select images"
      accept="image/x-png"
      @change="selection"
      multiple
    >
    <figure>
      <figcaption>Inputs</figcaption>
      <drag v-for="blob in blobs">
        <imagecanvas :id="blob.id" :value="blob"></imagecanvas>
      </drag>
    </figure>

    <drop @dropped="dropped" select="div.imagecanvas">
      <figure>
        <figcaption>Playground</figcaption>
        <drag v-for="blob in playImages">
          <imagecanvas :id="blob.id" :value="blob"></imagecanvas>
        </drag>
      </figure>
    </drop>
  </div>
  `
}