import { canvas } from "./visuals/canvas"
import { network } from "./visuals/network"
import { pobject } from "./visuals/pobject"

export const visuals = {
  props: ['item'],
  components: {
    'vis-canvas': canvas,
    'vis-network': network,
    'vis-pobject': pobject
  },
  computed: {
    // Global Objects
    values() {return this.$store.state.values},
    visuals() {return this.$store.state.visuals},

    // Item Data
    itemValue() {return this.values[this.item.id]},
    itemVisual() {return this.item.visual || 'none'},

    // Visual Definition
    def() {return this.visuals[this.itemVisual]},
    active() {return this.def.cond({item: this.item, value: this.itemValue})},
    value() {return this.def.func({item: this.item, value: this.itemValue})},
    name() {return `vis-${this.itemVisual}`},
  },
  template: `
  <component section="bench" v-if="active" :is="name" :value="value"></component>
  `
}