import { mapMutations } from "vuex"
import { dragdrop, drop } from "../drag"
import { pobject } from "./pobject"
import { reduce } from "orb-array"
import { compose } from "../../functions/pobject"

export const playarea = {
  components: {dragdrop, drop, pobject},
  emits: ['textinput', 'fileinput'],
  data() {
    return {
      compose: {
        pobject: (bo /**benched object */) => {
          return compose(bo, this.functions, this.wobjects)
        }
      },
    }
  },
  computed: {
    functions() { return this.$store.state.functions },
    pobjects() { return this.$store.state.pobjects },
    wobjects() { return this.$store.state.wobjects },
    values() { return this.$store.state.values },

    arrays() {
      return {
        functions: Object.entries(this.$store.state.functions),
        pobjects: Object.entries(this.$store.state.pobjects),
      }
    }
  },
  methods: {
    ...mapMutations(['ADDITION', 'DELETION', 'UPDATION']),
    
    elprops(el) {
      const afn = a => el.getAttribute(a)
      return reduce.o(['id', 'name'], {value: afn})
    }, // dropped object props

    benched(source) {
      const so = this.elprops(source) // source object
      const tbo = this.compose.pobject(so) // target bench object

      console.info(`benched: `, tbo)

      this.ADDITION({type: 'pobjects', key: tbo.id, value: tbo})
    },

    combination(source, tpo) {
      const props = this.elprops(source) // source element props
      const combine = () => {
        const spo = this.pobjects[props.id] // source pobject

        console.info(`pobject combination: `, tpo, spo, this.values)

        // Remove the dropped object from the bench
        this.DELETION({type: 'pobjects', key: spo.id})

        // Combine dragged and dragover objects
        this.UPDATION({
          type: 'pobjects',
          key: tpo.id,
          updates: {items: (tpo.items.push(spo), tpo.items)}
        })
      }

      combine()
    }
  },
  template: `
  <drop class="playarea"
    select="div:first-child.felement, div:first-child.wobject"
    @dropped="benched"
  >
    <p v-if="arrays.pobjects.length == 0">Drop types and objects...</p>
    <ul else>
      <li v-for="po in pobjects">
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
  `
}