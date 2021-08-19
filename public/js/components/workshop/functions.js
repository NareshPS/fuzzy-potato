import { mapMutations } from "vuex"
import { drag } from "orb-vue-dragdrop"
import { felement } from "./felement"
import { velement } from "./velement"

export const functions = {
  components: {felement, drag, velement},
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
  <section>
    <div class="section-head">
      <h5>Functions</h5>
    </div>
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
    <ul>
      <li v-for="fn in $store.state.functions">
        <drag>
          <felement :id="fn.id" :name="fn.name"></felement>
        </drag>
      </li>
    </ul>
    <ul>
      <li v-for="vs in $store.state.visuals">
        <drag>
          <velement :id="vs.id" :name="vs.name"></velement>
        </drag>
      </li>
    </ul>
  </section>
  `
}