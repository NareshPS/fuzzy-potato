import { mapMutations, mapState } from "vuex"
import { drag } from "../drag"
import { felement } from "./felement"

export const functions = {
  components: {felement, drag},
  data() {
    return {
      error: false,
      errmsg: '',
      reference: ''
    }
  },

  methods: {
    ...mapMutations(['ADDITON', 'DELETION']),
    newfn() {
      try {
        const fnv = _ => ({
          id: this.reference,
          name: this.reference,
          func: new Function(`return ${this.reference}`)()
        })// function element value
        const update = _ => {
          const entry = fnv()
          
          entry.func ? this.ADDITON({type: 'functions', key: entry.id, value: entry}) : this.setError()
        }

        this.reference !== ''? update(): ({})
      }
      catch (e) {
        console.error(e)
        this.setError(e)
      }
    },

    setError(e) {
      this.error = true
      this.errmsg = e
    },
    resetError() {
      this.error = false
      this.errmsg = ''
    }
  },

  template: `
  <div class="functions">
    <input
        placeholder="Type Reference"
        v-model.trim="reference"
        v-on:keyup.enter="newfn"
        @input="resetError"
        class="workshop-form-elems"
    >
    
    <p v-if="error">{{reference}} <em>is invalid</em></p>
    <p v-if="error">{{errmsg}}</p>
    <p v-else="!error"></p>
    <h5>Functions</h5>
    <ul>
      <li v-for="fn in $store.state.functions">
        <drag>
          <felement :id="fn.id" :name="fn.name"></felement>
        </drag>
      </li>
    </ul>
  </div>
  `
}