import { mapMutations } from "vuex"
import { errorsection } from "./errorsection"
import { playarea } from "./playarea"
import { textinput } from "../textinput"
import { fileinput } from "../fileinput"

export const bench = {
  components: {errorsection, fileinput, playarea, textinput},
  data() {
    return {
      userinput: {
        type: "",
        item: {}
      }
    }
  },

  methods: {
    ...mapMutations(['ADDITION', 'DELETION']),
  
    switchtoinput(evt, type) {
      this.userinput.type = type
      this.userinput.item = evt

      console.info(`switchtoinput: `, evt, type)
    }
  },

  template: `
  <div class="bench">
    <h5>Bench</h5>
    <textinput
      v-if="userinput.type==='textinput'"
      @close="userinput.type=''"
      :item="userinput.item"
    >
    </textinput>
    <fileinput
      v-else-if="userinput.type==='fileinput'"
      @close="userinput.type=''"
      :item="userinput.item"
    >
    </fileinput>
    <playarea
      v-else
      class="playarea"
      @textinput="switchtoinput($event, 'textinput')"
      @fileinput="switchtoinput($event, 'fileinput')"
    >
    </playarea>
    <errorsection>
    </errorsection>
  </div>
  `
}