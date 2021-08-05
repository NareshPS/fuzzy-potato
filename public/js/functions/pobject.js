import { self } from "orb-functions"
import { makeId } from "./random"

export const compose = (bo, functions, wobjects) => {
  const fi = functions[bo.id] // function item
  const transformations = [
    { cond: _ => fi, func: _ => [{...bo, id: makeId(), type: 'function'}] },
    { cond: _ => fi && fi.input, func: _ => [{...bo, id: makeId(), type: 'valuefunction', input: fi.input}] },
    { cond: _ => wobjects[bo.id], func: self },
  ]
  const tfunc = _ => transformations.reduce(
    (items, {cond, func}) => {
      return cond()? func(items): items
    },
    bo.items
  )

  return {
    id: makeId(),
    type: 'pobject',
    items: tfunc() || [],
  }
}

export const combinationSequence = (seq, pos /**pobjects */) => {

}