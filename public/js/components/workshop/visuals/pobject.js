import { toRaw } from 'vue'
import { mapMutations } from 'vuex'
import { layout } from '../../../functions/graph'
import { OUTPUT } from '../../../state/mutations'
import {networkitem} from './networkitem'
import {reduce} from 'orb-array'

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
            this.OUTPUT({ type: this.section, data: { count: nids.length, nodes: nids } })
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
    }
  },
  computed: {
    title() {return `${this.value.id}`},
    layout() { return layout(this.value, {}, {}) },

    networkLayout() {
      const colors = {
        value: {
          background: '#fae8d1',
          border: '#e9772b',
          highlight: {border: '#e9772b', background: '#fcf4e8'},
          hover: {border: '#e9772b', background: '#fcf4e8'}
        },
        default: undefined
      }

      const fns = {
        id: ({id}) => id,
        label: ({name}) => name? name: '', // network node label function
        shape: ({type}) => type == 'pobject'? 'circle': 'box',
        color: ({type}) => type == 'valuefunction'? colors.value: colors.default
      }
      const nodefn = (n) => reduce.o(Object.keys(fns), { value: (prop) => fns[prop](n)} )
      const edgefn = ([from, to]) => ({from, to})

      return { nodes: this.layout.nodes.map(nodefn), edges: this.layout.edges.map(edgefn) }
    }
  },
  methods: {
    ...mapMutations([OUTPUT]),
    creation(nw) {
      Object.assign(this.network, nw)

      this.network.nodes.add(this.networkLayout.nodes)
      this.network.edges.add(this.networkLayout.edges)
      this.network.instance.on('stabilized', _ => {
        this.network.instance.fit({animation: {easingFunction: 'linear'}})
      })
    },
    highlight(evt) {
      const filterfn = (term) => ({id, name = '', type = ''}) => {
        return name.startsWith(term) || id.startsWith(term) || type.startsWith(term)
      }
      const term = evt.target.value

      this.network.select.nodes(filterfn(term))
    }
  },
  template: `
  <figure class="vis-pobject">
    <div>
      <figcaption>{{title}}</figcaption>
      <input title="Lookup node" type="search" placeholder="Search node" @change="highlight">
    </div>
    <networkitem @created="creation" :options="network.options"></networkitem>
  </figure>
  `
}