import { mapMutations } from "vuex"
import { dragdrop, drop } from "orb-vue-dragdrop"
import { pobject } from "./pobject"
import { reduce } from "orb-array"
import { compose } from "../../functions/pobject"
import { playhead } from "./playhead"
import { ADDITION, DELETION, OUTPUT, UPDATION } from "../../state/mutations"

export const playarea = {
  components: {dragdrop, drop, playhead, pobject},
  emits: ['textinput', 'fileinput'],
  data() {
    return {
      compose: {
        pobject: (bo /**benched object */) => {
          return compose(bo, this.functions, this.blocks)
        }
      },
      trashStatus: false
    }
  },
  computed: {
    functions() { return this.$store.state.functions },
    pobjects() { return this.$store.state.pobjects },
    blocks() { return this.$store.state.blocks },
    values() { return this.$store.state.values },

    arrays() {
      return {
        pobjects: Object.entries(this.$store.state.pobjects),
      }
    }
  },
  methods: {
    ...mapMutations([ADDITION, DELETION, UPDATION, OUTPUT]),
    
    elprops(el) {
      const afn = a => el.getAttribute(a)
      return reduce.o(['id', 'name'], {value: afn})
    }, // dropped object props

    benched(source) {
      const so = this.elprops(source) // source object
      const tbo = this.compose.pobject(so) // target bench object

      console.info(`benched: source: %O target: %O`, so, tbo)

      this.ADDITION({type: 'pobjects', key: tbo.id, value: tbo})
    },

    combination(source, to) {
      const props = this.elprops(source) // source element props
      const so = this.pobjects[props.id] // source pobject
      const combine = () => {
        // Remove the dropped object from the bench
        this.DELETION({type: 'pobjects', key: so.id})

        // Combine dragged and dragover objects
        this.UPDATION({
          type: 'pobjects',
          key: to.id,
          updates: {items: (to.items.push(so), to.items)}
        })
      }

      const valuefn = _ => to.items.length == 1 && to.items[0].input
      console.info(`pobject combination request: source: %O target: %O valuefn?: %O`, so, to, valuefn())

      valuefn()
      ? (this.OUTPUT({type: 'bench', data: {message: 'It doesn\'t make sense to drop an object on a value.'}}))
      : combine()
    },

    trashed(source) {
      const so = this.elprops(source) // source object
      this.DELETION({type: 'pobjects', key: so.id})
      
      this.trashStatus = false
    }
  },
  template: `
  <section>
    <playhead></playhead>
    <section class="construction-zone">
      <drop
        select="div:first-child.felement, div:first-child.block"
        @dropped="benched"
      >
        <p v-if="arrays.pobjects.length == 0">Drop types and objects...</p>
        <ul else>
          <li v-for="po in pobjects" :key="po.id">
            <dragdrop select="div:first-child.pobject" @dropped="combination($event, po)">
              <pobject
                :item="po"
                @textinput="$emit('textinput', $event)"
                @fileinput="$emit('fileinput', $event)"
              ></pobject>
            </dragdrop>
          </li>
        </ul>
      </drop>
      <aside :class="['trash-zone', {active: trashStatus}]">
        <drop
          select="div:first-child.pobject"
          @dragenter="trashStatus=true"
          @dragleave="trashStatus=false"
          @dropped="trashed"
        >
        </drop>
      </aside>
    </section>
  </section>
  `
}