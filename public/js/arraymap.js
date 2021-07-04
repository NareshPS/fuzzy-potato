import {reduce} from 'orb-array'
import { reactive } from 'vue'

class ArrayMap {
  constructor(items = [], {key} = {key: orbfns.self}) {
    this.keyFn = key
    this.map = reactive(reduce.o(items, {key}))
    this.items = reactive(items)
  }

  push = (v) => {
    const key = this.keyFn(v)

    this.map[key] = v
    return this.items.push(v)
  }

  pop = _ => {
    const popped = this.items.pop()
    const key = this.keyFn(popped)
    
    delete this.map[key]
    return popped
  }

  remove = (key) => {
    const removed = this.map[key]
    const index = this.items.indexOf(removed)

    this.items.splice(index, 1)
    delete this.map[key]

    return removed
  }

  at = index => this.items[index]
  get = key => this.map[key]
  length = _ => this.items.length
}

export const arraymap = (items, key) => new ArrayMap(items, key)