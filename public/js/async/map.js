import { Subject } from "rxjs"
import { map } from "rxjs/operators"

class Map {
  constructor() {
    const box = { map: {}, items: [], indexMap: {} }
    const mapper = ({action, key, value}) => {
      const ops = {
        update: _ => {
          const index = box.indexMap[key]

          box.items[index] = value// items update
          box.map[key] = value // map update
        },

        add: _ => {
          const index = box.items.length

          box.indexMap[key] = index
          box.map[key] = value 
          box.items.push(value)
        },

        remove: _ => {
          const index = box.indexMap[key]

          box.items.splice(index, 1)
          delete box.indexMap[index]
          delete box.map[key]
        }
      }

      switch(action) {
        case 'update':
          {
            const cv = box.map[key] // current value
            cv? ops.update(): ops.add()
          }
          break
        case 'remove':
          {
            const cv = box.map[key] // current value
            cv? ops.remove(): undefined
          }
          break
        default:
          console.error(`invalid action: ${action}`)
      }

      return {container: box.map, action, key, value}
    }

    this.box = box
    this.subject = new Subject().pipe(map(mapper))
  }

  update = (key, value) => (this.subject.next({action: 'update', key, value}), this)
  remove = (key) => (this.subject.next({action: 'remove', key}), this)
  get = (key) => this.box.map[key]
  subscribe = fn => this.subject.subscribe(fn)
}

export default function() { return new Map()}