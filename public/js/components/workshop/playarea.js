import { mapMutations } from "vuex"
import { dragdrop, drop } from "../drag"
import { pobject } from "./pobject"
import {makeId} from '../../functions/random'
import { reduce } from "orb-array"
import { self } from "orb-functions"

export const playarea = {
  components: {dragdrop, drop, pobject},
  emits: ['textinput', 'fileinput'],
  data() {
    return {
      compose: {
        pobject: (bo /**benched object */) => {
          const fi = this.functions[bo.id] // function item
          const transformations = [
            { cond: _ => fi, func: _ => [{...bo, id: makeId(), type: 'function'}] },
            { cond: _ => fi && fi.input, func: _ => [{...bo, id: makeId(), type: 'valuefunction', input: fi.input}] },
            { cond: _ => this.wobjects[bo.id], func: self },
          ]
          const tfunc = _ => transformations.reduce(
            (items, {cond, func}) => {
              return cond()? func(items): items
            },
            bo.items
          )
          console.info(`state: `, this.functions, this.wobjects)

          return {
            id: makeId(),
            name: bo.name,
            type: 'pobject',
            items: tfunc(),
          }
        }
      },
    }
  },
  computed: {
    functions() { return this.$store.state.functions },
    pobjects() { return this.$store.state.pobjects },
    wobjects() { return this.$store.state.wobjects },

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