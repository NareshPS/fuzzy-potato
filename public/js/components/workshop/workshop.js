import { functions } from './functions'
import { bench } from './bench'
import { mapMutations } from 'vuex'

export const workshop = {
  components: {
    functions,
    bench
  },
  data() {
    return {
    }
  },

  methods: {
    ...mapMutations(['ADDITION', 'DELETION'])
  },

  template: `
  <div class="workshop-header">
    <functions></functions>
    <bench></bench>
  </div>
  `
}