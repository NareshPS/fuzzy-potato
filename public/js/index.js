import 'regenerator-runtime/runtime'
import 'core-js/features/promise'
import * as types from './functions/basic'
import * as visuals from './functions/visuals'

import createPersistedState from 'vuex-persistedstate'

import {createApp} from 'vue'
import { createStore, mapMutations } from 'vuex'
import { functions } from './components/workshop/functions'
import { bench } from './components/workshop/bench'
import { shop } from './components/workshop/shop'
import { ADDITION, ADDITIONS, DELETION, UPDATION, OUTPUT } from './state/mutations'
import { reduce } from 'orb-array'
import { self } from 'orb-functions'
import { errorInfo } from './functions/housekeeping'

const store = createStore({
  plugins: [createPersistedState({paths: ['blocks', 'values']})],
  state () {
    return {
      functions: reduce.o(
        Object.values(types),
        { key: ({name}) => name, value: v => ({id: v.name, ...v}) }
      ),
      visuals: reduce.o(
        Object.values(visuals),
        { key: ({name}) => name, value: v => ({id: v.name, ...v}) }
      ),
      blocks: {}, // block objects
      pobjects: {}, // play objects
      values: {},
      bench: { output: {} },
      shop: { output: {} }
    }
  },

  mutations: {
    [ADDITION] (state, {type, key, value}) {
      state[type][key] = value
    },

    [ADDITIONS] (state, {type, items, key = self, value = self}) {
      const assign = (item) => state[type][key(item)] = value(item)

      items.forEach((item) => assign(item))
    },

    [DELETION] (state, {type, key}) {
      delete state[type][key]
    },

    [UPDATION] (state, {type, key, updates}) {
      state[type][key] = Object.assign(state[type][key] || {}, updates)
    },

    [OUTPUT] (state, {type, data = {}}) {
      state[type].output = data
    },
  }
})

const app = createApp({
  components: {functions, bench, shop},
  data() {
    return {}
  },
  methods: {
    ...mapMutations([OUTPUT]),
    benchwork(fn) { this.safecall(fn, 'bench') },
    shopwork(fn) {this.safecall(fn, 'shop')},
    safecall(fn, section) {
      try { fn() }
      catch (e) {
        console.error(`section: ${section}`, e)
        this.OUTPUT({type: section, data: errorInfo(e)})
      }
    }
  }
})

app.use(store)
app.mount('#app')