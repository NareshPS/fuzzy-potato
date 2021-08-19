import { watchEffect } from 'vue'
import { mapMutations } from 'vuex'
import { OUTPUT } from '../../../state/mutations'
import {networkitem} from './networkitem'

export const network = {
  components: {networkitem},
  props: ['section', 'value'],
  data() {
    return {
      title: '',
      items: []
    }
  },
  mounted() {
    watchEffect(_ => {
      console.info(`visuals.network: value: `, this.value)
      this.value
      ? this.value
      .then(({title, items} = {title: '', items: []}) => {
        this.title = title
        this.items = items
      })
      .catch(err => this.OUTPUT({type: this.section, data: err}))
      : {}
    })
  },
  methods: {
    ...mapMutations([OUTPUT]),
  },
  template: `
  <figure class="vis-network">
    <figcaption>{{title}}</figcaption>
    <networkitem v-for="item in items" :value="item"></networkitem>
  </figure>
  `
}