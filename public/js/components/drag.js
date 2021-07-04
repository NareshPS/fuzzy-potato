
const dataTransfer = {
  dragged: undefined
}

export const drag = {
  emits: [],
  methods: {
    dragging(evt) { dataTransfer.dragged = evt.target }
  },

  template: `
  <div draggable="true" @dragstart="dragging">
    <slot></slot>
  </div>
  `
}

export const drop = {
  emits: ['dropped', 'dragover'],
  methods: {
    source() {return dataTransfer.dragged},
    drop(evt) {
      evt.currentTarget.isSameNode(this.source())
      ? ({})
      : this.$emit('dropped', {target: evt.currentTarget, source: this.source()})
    },
    over(evt) { this.$emit('dragover', evt) }
  },

  template: `
  <div @drop.prevent="drop" @dragover.prevent="over">
    <slot></slot>
  </div>
  `
}

export const dragdrop = {
  emits: [...drag.emits, ...drop.emits],

  methods: {
    ...drag.methods,
    ...drop.methods
  },

  template: `
  <div draggable="true" @dragstart="dragging" @drop.prevent="drop" @dragover.prevent="over">
    <slot></slot>
  </div>
  `
}