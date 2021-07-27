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

  mounted() {
    [
      // {id: 'tf.model', name: 'tf.model', func: tf.model,},
      // {id: 'tf.pool', name: 'tf.pool', func: tf.pool,}
    ].forEach((t) => { this.ADDITION({type: 'functions', key: t.id, value: t}) })
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