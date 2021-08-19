import { mapMutations } from "vuex"
import { UPDATION } from "../../state/mutations"
import { blockname } from "./blockname"
import { images } from "./visuals/images"
import { texts } from "./visuals/texts"

/**
 * Invariants:
 * The block object get a new top-level id on the bench.
 * The shop retains the original block after being dropped to the bench.
 */
export const block = {
  components: {images, blockname, texts},
  props: ['item'],
  computed: {
    itemValue() {return this.values[this.item.id]},
    values() {return this.$store.state.values},
    visual() {return (this.item.visuals || {}).type || 'texts'}
  },
  methods: {
    ...mapMutations([UPDATION]),
    renaming(name) {
      console.info(`block: current name: %O new name: %O`, this.item.name, name)
      this.UPDATION({type: 'blocks', key: this.item.id, updates: {name}})
      console.info(`block: updated block: %O`, this.item)
    },
    visualActive() { return this.visual && this.itemValue },
  },

  template: `
  <div class="block" :id="item.id">
    <blockname :item="item" @renaming="renaming"></blockname>
    <component v-if="visualActive()" :is="visual" section="shop" :value="itemValue"></component>
  </div>
  `
}