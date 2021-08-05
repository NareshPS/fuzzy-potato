import { mapMutations } from "vuex"
import { errorsection } from "./errorsection"
import { playarea } from "./playarea"
import { textinput } from "../textinput"
import { fileinput } from "../fileinput"
import { compose } from "../../functions/pobject"
import { repeat, zip } from "orb-array"

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

  mounted() {
    // [
    //   {id: 'tf.model', name: 'tf.model', func: tf.model,},
    //   {id: 'tf.reshape', name: 'tf.reshape', func: tf.reshape,},
    //   {id: 'tf.conv2d', name: 'tf.conv2d', func: tf.conv2d,},
    // ].forEach((t) => { this.ADDITION({type: 'functions', key: t.id, value: t}) })

    const bos = ['tf.conv2d', 'tf.tensor', 'pick', 'file', 'code', 'png', 'code', 'code', 'code']
    // const bos = ['pick', 'file', 'code', 'png']
    const setup = (name) => {
      const po = compose(this.functions[name], this.functions, this.wobjects)
      this.ADDITION({type: 'pobjects', key: po.id, value: po})
    }

    bos.forEach(setup)
    // const {node, functions, values} = state(
    //   ['tf.conv2d', 'tf.tensor', 'code', 'code', 'code'],
    //   [
    //     undefined,
    //     undefined,
    //     '[1, 1, 2, 2, 4, 4, 8, 8]',
    //     '{shape: [2, 2, 2]}',
    //     '{filters: [[[[1], [1]], [[1], [1]]], [[[1], [1]], [[1], [1]]]], strides: 2, pad: "same"}',
    //   ],
    //   [[1, 2], [1, 3], [0, 1], [0, 4]]
    // )

    // this.ADDITION({type: 'pobjects', key: node.id, value: node})
  },

  computed: {
    functions() { return this.$store.state.functions },
    pobjects() { return this.$store.state.pobjects },
    wobjects() { return this.$store.state.wobjects },
    values() { return this.$store.state.values },
  },

  methods: {
    ...mapMutations(['ADDITION', 'DELETION']),
  
    switchtoinput(evt, type) {
      this.userinput.type = type
      this.userinput.item = evt

      console.info(`switchtoinput: `, evt, type)
    },
    state(names /**type names */, typevalues, sequence) {
      const tos = names
      .map((name) => this.functions[name])
      .map((t) => compose(t, this.functions, []))
      const node = tos[0]
    
      zip(typevalues, tos)
      .forEach(([tv, to]) => this.ADDITION({type: 'values', key: to.items[0].id, value: tv}))

      sequence.forEach(([to, from] /**sequence item */) => { tos[to].items.push(tos[from]) })
      this.ADDITION({type: 'values', key: node.id, value: node})
    
      return node
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