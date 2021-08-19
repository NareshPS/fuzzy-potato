import * as types from './basic'

import { reduce, zip } from 'orb-array'
import { compose } from "./pobject"

export const state = (names, typevalues, sequence) => {
  const functions = reduce.o(
    Object.values(types),
    { key: ({name}) => name, value: v => ({id: v.name, ...v}) }
  )

  // console.info(`functions: `, functions)

  const tos = names
  .map((name) => functions[name])
  .map((t) => compose(t, functions, []))
  const [node, values] = [tos[0], {}]

  zip(typevalues, tos).forEach(([tv, to]) => values[to.items[0].id] = tv)
  sequence.forEach(([to, from] /**sequence item */) => { tos[to].items.push(tos[from]) })

  return {node, functions, values}
}

export const state2 = (defs, sequence) => {
  const functions = reduce.o(
    Object.values(types),
    { key: ({name}) => name, value: v => ({id: v.name, ...v}) }
  )
  console.info(defs, sequence)

  const namefn = (v) => v.name || 'code'
  const nodes = reduce.a(defs, {value: (v) => ({...v, object: compose(functions[namefn(v)], functions, {})})})
  const values = reduce.o(nodes, {key: (v) => v.object.items[0].id, value: (v) => v.value})
  sequence.forEach(([to, from]) => {nodes[to].object.items.push(nodes[from].object)})
  
  return {nodes, functions, values}
}