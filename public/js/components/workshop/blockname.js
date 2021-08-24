import { watchEffect } from "vue"
import { ensurePromise } from "../../functions/housekeeping"

export const blockname = {
  props: ['item'],
  emits: ['renaming'],
  data() {
    return {
      placeholder: 'name'
    }
  },
  mounted() {
    /**
     * Apply value updates to the placeholder.
     */
    watchEffect(_ => {
      const assignfn = (rv = this.derivedPlaceholder()) =>
      {
        ensurePromise(rv).then((v) => {
          console.info(`blockname: `, v, v instanceof Object)
          this.placeholder = v instanceof Object? v.toString(): v
        })
      }
      // console.info(`watching value: %O`, this.item, this.itemValue)
      assignfn(this.itemValue)
    })


  },
  computed: {
    itemValue() { return this.$store.state.values[this.item.id] },
  },
  methods: {
    naming(evt) { this.$emit('renaming', evt.currentTarget.value) },
    derivedPlaceholder() {return this.item.items.length == 1? this.item.items[0].name: 'name'}
  },
  template: `
  <input
    class="blockname"
    title="Assign a name"
    :placeholder="placeholder"
    :value="item.name"
    @change="naming"
  >
  `
}