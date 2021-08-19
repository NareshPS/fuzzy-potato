import { Network } from "vis-network"
import { DataSet } from "vis-data"
import {range} from 'orb-array'

export const networkitem = {
  props: ['options'],
  emits: ['created'],
  mounted() {
    this.$root.benchwork(_ => {
      const [nodes, edges] = range(2).map(_ => new DataSet())
      const instance = new Network(this.$el, { nodes, edges}, this.options)
      this.$emit('created', {instance, nodes, edges})
    })
  },
  template: `
  <div class="vis-networkitem"></div>`
}