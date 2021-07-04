import { Subject } from "rxjs"
import { map } from "rxjs/operators"

class AsyncArray {
  constructor(items = []) {
    const mapper = (value) => (items.push(value), {container: items, value})
    
    this.items = items
    this.subject = new Subject()
    .pipe(map(mapper))
  }

  push = v => (this.subject.next(v), this)
  get = _ => this.items
  subscribe = fn => this.subject.subscribe(fn)
}

export default function(items) { return new AsyncArray(items)}