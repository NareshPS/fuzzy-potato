import { wtype } from "./wtype"
import { wobject } from "./wobject"

export const wtobject = {
  components: {wtype, wobject},
  props: ['base'],
  emits: ['externalValue'],

  methods: {
    valueType() {this.base.items.length == 1 && this.base.items[0].name === 'value'},
    externalValue() { this.valueType()? this.$emit('externalValue'): ({}) },
    evaluate() { return this.valueType() ? this.base.value : graphValue(this.base.items) }
  },

  template: `
  <div
    class="wtobject"
    cname="wtobject"
    :id="base.id"
    :value="base.value"
    @dblclick.stop.prevent="externalValue"
  >
    <input placeholder="name" v-model="base.name">
    {{base.value}}


    <!-- Iterate over bench object items -->
    <component v-for="item in base.items" :is="item.cname" :name="item.name"></component>
    <button @click="evaluate">Evaluate</button>
  </div>
  `
}