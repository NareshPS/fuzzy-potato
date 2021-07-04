import { wtype } from "./wtype"
import { wobject } from "./wobject"
import { wtobject } from "./wtobject"
import { wbench } from "./wbench"
import { drag } from "./drag"
import {string, number, array, object, value} from '../types/basic'

export const workshop = {
  components: {
    wtype,
    wobject,
    wtobject,
    wbench,
    drag
  },
  data() {
    return {
      typeDef: '',
      typeError: false,
      types: {
        [string.name]: string.func,
        [number.name]: number.func,
        [array.name]: array.func,
        [object.name]: object.func,
        [value.name]: value.func,
        'tf.model': tf.model,
      },
      objects: []
    }
  },

  methods: {
    newType() {
      try {
        (this.typeDef == undefined || this.typeDef == '')
        ? this.setError()
        : this.types[this.typeDef] = new Function(`return ${this.typeDef}`)()
      }
      catch (e) {
        console.error(e)
        this.setError()
      }
    },

    setError() {this.typeError = true},
    resetError() {this.typeError = false}
  },

  template: `
  <div class="workshop-header">
    <input
      placeholder="Type Reference"
      v-model.trim="typeDef"
      v-on:keyup.enter="newType"
      @input="resetError"
      class="workshop-form-elems"
      >
    <!--<button
      @click="newType"
      title="New type"
      class="workshop-form-elems"
      >New Type</button>-->
  
    <p v-if="typeError">{{typeDef}} <em>is invalid</em></p>
    <p v-else="!typeError"></p>
    <h5>Types</h5>
    <ul>
      <li v-for="(type, name) in types">
        <drag>
          <wtype :name="name"></wtype>
        </drag>
      </li>
    </ul>
    <h5>Bench</h5>
    <wbench :types="types" :objects="objects"></wbench>
    <h5>Objects</h5>
    <ul>
      <li v-for="ob in objects">
        <drag>
          <wobject></wobject>
        </drag>
      </li>
    </ul>
  </div>
  `
}