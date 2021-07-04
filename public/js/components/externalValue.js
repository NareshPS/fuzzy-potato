
export const externalValue = {
  props: ['item', 'show'],
  emits: ['update:show'],
  methods: {
    valued() {
      this.$emit('update:show', false)
    },
  },

  template: `
  <div class="value">
    <textarea v-model="item.value"></textarea>
    <div>
      <button>Cancel</button>
      <button @click="valued">Set</button>
    </div>
  </div>
  `
}