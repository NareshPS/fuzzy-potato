import { toRaw } from 'vue'
import { layout } from '../../../functions/graph'
import {networkitem} from './networkitem'
import {reduce} from 'orb-array'
import { ensurePromise } from '../../../functions/housekeeping'

export const pobject = {
  components: {networkitem},
  props: ['section', 'value'],
  data() {
    return {
      network: {
        select: {
          nodes: (ffn /*filter function */)  => {
            const nids = this.layout.nodes.filter(ffn).map(({id}) => id)
            // console.info(`pobject: select.nodes: %O selection: %O`, this.layout.nodes, nids)

            toRaw(this.network.instance).selectNodes(nids)
            this.output = { count: nids.length, nodes: nids }
          }
        },
        options: {
          // configure: {filter: 'layout,nodes,physics'},
          nodes: {font: {size: 9} },
          layout: {
            hierarchical: {direction: 'DU', sortMethod: 'directed', shakeTowards: 'leaves', }
          },
          // physics: {enabled: false}
        }
      },
      output: {}
    }
  },
  computed: {
    values() {return this.$store.state.values},

    title() {return `${this.value.id}`},
    layout() { return layout(this.value, {}, {}) },

    networkLayout() {
      /**
       * Color Triadic: [#2B7CE9, #E92B7C, #7CE92B]
       * At 90%: [#d1e3fa, #fad1e3, #e3fad1]
       * 
       * Border is the original color
       * Fill is picked at 90% on the Light/Dark scale
       * 
       * Light/Dark scale: https://www.w3schools.com/colors/colors_picker.asp
       * Color Wheel: https://www.canva.com/colors/color-wheel/
       */
      const colors = {
        value: {
          background: '#fad1e3',
          border: '#E92B7C',
          highlight: {border: '#7CE92B', background: '#e3fad1'},
          hover: {border: '#E92B7C', background: '#fad1e3'}
        },
        default: {
          highlight: {border: '#7CE92B', background: '#e3fad1'},
        },
        edge: {color: '#2B7CE9', highlight: '#7CE92B'}
      }

      const npropfns = {
        id: ({id}) => id,
        label: ({name}) => name? name: '', // network node label function
        shape: ({type}) => type == 'pobject'? 'circle': 'box',
        color: ({type}) => type == 'inputfunction'? colors.value: colors.default
      } // functions to compute node property value

      const epropfns = {
        from: ([from, _]) => from,
        to: ([_, to]) => to,
        color: ({}) => colors.edge
      } // functions to compute edge property value

      const nodefn = (n) => reduce.o(Object.keys(npropfns), {value: (prop) => npropfns[prop](n)})
      const edgefn = (e) => reduce.o(Object.keys(epropfns), {value: (prop) => epropfns[prop](e)})

      return { nodes: this.layout.nodes.map(nodefn), edges: this.layout.edges.map(edgefn) }
    }
  },
  methods: {
    // Filters
    nodeValue(id) {return this.values[id]},

    creation(nw) {
      Object.assign(this.network, nw)

      this.network.nodes.add(this.networkLayout.nodes)
      this.network.edges.add(this.networkLayout.edges)

      const fit = _ => this.network.instance.fit({animation: {easingFunction: 'linear'}})
      // this.network.instance.on('stabilized', fit)
      this.network.instance.on('resize', fit)

      this.network.instance.on('selectNode', ({nodes: [node]}) => this.showValue(node))
    },
    showValue(id /**node id */) {
      const pv = ensurePromise(this.nodeValue(id)) // Promise Value

      pv ? pv.then(value => this.output = {id, value}) : (this.output = {id})
    },

    highlight(evt) {
      const value = (id) => {
        const v = this.nodeValue(id)
        return (v instanceof Promise? '': v) || ''
      }

      const filterfn = (term) => ({id, name = '', type = ''}) => {
        return name.startsWith(term)
        || id.startsWith(term)
        || type.startsWith(term)
        || value(id).indexOf(term) >= 0 // substring match
      }
      const term = evt.target.value

      this.network.select.nodes(filterfn(term))
    }
  },
  template: `
  <div class="vis-pobject">
    <section>
      <figure>
        <div>
          <figcaption>{{title}}</figcaption>
          <input title="Lookup node" type="search" placeholder="Search node" @change="highlight">
        </div>
        <networkitem @created="creation" :options="network.options"></networkitem>
      </figure>
    </section>
    <section>
      <p>{{output}}</p>
    </section>
  </div>
  `
}