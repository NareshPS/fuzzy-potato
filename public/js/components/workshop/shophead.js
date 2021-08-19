import { range } from "orb-array"
import { mapMutations } from "vuex"
import { saveObject } from "../../functions/browser"
import { read } from "../../functions/file"
import { state } from "../../functions/pobject"
import { ADDITIONS, OUTPUT } from "../../state/mutations"

export const shophead = {
  computed: {
    blocks() {return this.$store.state.blocks},
    values() {return this.$store.state.values},
  },
  methods: {
    ...mapMutations([ADDITIONS, OUTPUT]),
    selection(el) {
      const files = el.target.files
      const readfn = (fo) => read(fo, 'text')
      .then(json => {
        // console.info(`shophead: file contents: `, json)

        const {pobjects, values} = state.decode(JSON.parse(json))
        const flatvalues = Object.entries(values).map(([id, value]) => ({id, value}))

        this.ADDITIONS({type: 'blocks', items: pobjects, key: ({id}) => id})
        this.ADDITIONS({type: 'values', items: flatvalues, key: ({id}) => id, value: ({value}) => value})
      })
      .catch(err => this.OUTPUT({type: 'shop', data: err}))

      range(files.length).map((index) => files.item(index)).forEach((file) => readfn(file))
    },
    save() {
      const data = state.encode(this.blocks, this.values)
      saveObject(data)
    }
  },

  template: `
  <div class="shophead section-head">
    <h5>Shop</h5>
    <input
      type="file"
      title="Import blocks"
      placeholder="Select a block file"
      accept="application/json"
      class="float-right"
      @change="selection"
    >
    <button
      class="saveblocks float-right"
      title="save"
      @click="save"
    >S
    </button>
  </div>
  `
}