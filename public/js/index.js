import 'regenerator-runtime/runtime'
import 'core-js/features/promise'
import * as types from './functions/basic'

import {createApp} from 'vue'
import { createStore } from 'vuex'
import { workshop } from './components/workshop/workshop'
import { ADDITION, DELETION, UPDATION, BENCHERROR } from './state/mutations'
import { reduce } from 'orb-array'

const store = createStore({
  state () {
    return {
      functions: reduce.o(
        Object.values(types),
        { key: ({name}) => name, value: v => ({id: v.name, ...v}) }
      ),
      wobjects: {}, // workshop objects
      pobjects: {}, // play objects
      values: {},
      bench: {
        error: {
          message: '',
          source: ''
        }
      }
    }
  },

  mutations: {
    [ADDITION] (state, {type, key, value}) {
      state[type][key] = value
    },

    [DELETION] (state, {type, key}) {
      delete state[type][key]
    },

    [UPDATION] (state, {type, key, updates}) {
      state[type][key] = Object.assign(state[type][key] || {}, updates)
    },

    [BENCHERROR] (state, {message, source} = {message: '', source: ''}) {
      state.bench.error = {message, source}
    }
  }
})

const app = createApp({
  components: {workshop},
  data() {
    return {}
  }
})

app.use(store)
app.mount('#app')