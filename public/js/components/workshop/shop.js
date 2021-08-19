import { block } from "./block"
import { drag, drop } from "orb-vue-dragdrop"
import { object as outputobject } from "./visuals/object"
import { shophead } from "./shophead"
import { mapMutations } from "vuex"
import { ADDITION, DELETION } from "../../state/mutations"
import { reduce } from "orb-array"

export const shop = {
  components: {block, drag, drop, outputobject, shophead},

  computed: {
    pobjects() { return this.$store.state.pobjects },
    blocks() { return this.$store.state.blocks },
    shopOutput() {return this.$store.state.shop.output},
    values() { return this.$store.state.values },

    arrays() {
      console.info(`shop: blocks: `, this.blocks)
      return {
        blocks: Object.entries(this.$store.state.blocks),
      }
    }
  },

  methods: {
    ...mapMutations([ADDITION, DELETION]),
    elprops(el) {
      const afn = a => el.getAttribute(a)
      return reduce.o(['id', 'name'], {value: afn})
    }, // dropped object props

    arrival(source) {
      const props = this.elprops(source) // source object
      const so = this.pobjects[props.id]

      this.ADDITION({type: 'blocks', key: so.id, value: so})
      this.DELETION({type: 'pobjects', key: so.id})
    },
  },

  template: `
  <section>
    <shophead></shophead>
    <drop class="shop-drop-zone" select="div:first-child.pobject" @dropped="arrival">
      <p v-if="arrays.blocks.length == 0">Drop bench objects...</p>
      <ul else>
        <li v-for="bi in blocks" :key="bi.id">
          <drag>
            <block :item="bi"></block>
          </drag>
        </li>
      </ul>
    </drop>
    <outputobject :data="shopOutput">
    </outputobject>
  </section>
  `
}