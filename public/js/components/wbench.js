import {drag, drop, dragdrop} from './drag'
import { externalValue } from './externalValue'
import { wtobject } from './wtobject'
import { wtype } from './wtype'
import { wobject } from './wobject'
import { arraymap } from '../arraymap'
import { makeId } from '../random'

export const wbench = {
  components: {drag, drop, dragdrop, externalValue, wtype, wobject, wtobject},
  props: ['types', 'objects'],
  data() {
    return {
      wobjects: {},
      benchObjects: arraymap([], {key: ({id}) => id}),
      externalValue: {
        showUi: false,
        source: {}
      },
    }
  },
  
  computed: {
    watchableBos() {return this.benchObjects.items},
  },

  methods: {
    elid(el) {return el.getAttribute('id') },
    elname(el) { return el.getAttribute('name') },
    elcname(el) { return el.getAttribute('cname') },
    elprops(el) {
      return {
        id: this.elid(el),
        name: this.elname(el),
        cname: this.elcname(el)
      }
    }, // dropped object props

    chprops(el) {
      const [chel] = el.getElementsByTagName('div') // child element

      return this.elprops(chel)
    }, // child element props

    benched({source: el /**dropped element */}) {
      // const withIn = (bo) => bo.isSameNode(bo)
      // const withInIndex = this.benchObjects.findIndex(withIn)

      // withInIndex != -1? this.benchObjects.splice(withInIndex, 1): ({});
      const bo = this.chprops(el) // bench object
      const dropElements = ['wtype', 'wobject']

      dropElements.some((type) => type === bo.cname)
      ? this.benchObjects.push({
        id: makeId(),
        name: "",
        items: [bo]
      })
      : ({})
    },

    combination({target, source /**dropped element */}) {
      const cop = this.chprops(source) // combination candidate props
      const ctp = this.chprops(target) // combination target props
      const dropElements = ['wtobject']
      const combine = () => {
        const co = this.benchObjects.get(cop.id)
        const ct = this.benchObjects.get(ctp.id)

        // Remove the dragged object from the bench
        this.benchObjects.remove(cop.id)

        // Combine dragged and dragover objects
        ct.items.push(...co.items)
      }

      dropElements.some((type) => type === cop.cname)
      ? combine()
      : ({})
    },

    dragover(evt /** dragover event object*/) {
      evt.dataTransfer.action = "move"
    }
  },
  template: `
  <externalValue
    v-if="this.externalValue.showUi"
    v-model:show="this.externalValue.showUi"
    :item="this.externalValue.source"
  >
  </externalValue>
  <drop v-else class="wbench" @dropped="benched" @dragover="dragover">
    <p v-if="benchObjects.length() == 0">Drop types and objects...</p>
    <ul>
      <li v-for="bo in benchObjects.items">
        <dragdrop @dropped="combination" @dragover="dragover">
          <wtobject
            :base="bo"
            @externalValue="(this.externalValue.source = bo, this.externalValue.showUi = true)"
          >
          </wtobject>
          {{bo}}
        </dragdrop>
      </li>
    </ul>
  </drop>
  `
}