import {createApp} from 'vue'
import { workshop } from './components/workshop'

const app = createApp({
  data() {
    return {}
  }
})

app.component('workshop', workshop)
app.mount('#app')