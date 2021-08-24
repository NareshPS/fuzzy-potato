import { reduce } from "orb-array"
import { self } from "orb-functions"
import { nodes } from "./graph"
import { makeId } from "./random"

export const compose = (bo, functions, blocks) => {
  const fi = functions[bo.id] // function item
  const bi = blocks[bo.id] // block item
  const inputfn = (input) => `${input == 'name'? 'name': 'input'}function`
  const transformations = [
    { cond: _ => fi, func: _ => [{...bo, id: makeId(), type: 'function'}] },
    { cond: _ => fi && fi.input, func: _ => [{...bo, id: makeId(), type: inputfn(fi.input), input: fi.input}] },
    { cond: _ => bi, func: _ => bi.items},
  ]
  const tfunc = _ => transformations.reduce(
    (items, {cond, func}) => {
      return cond()? func(items): items
    },
    bo.items
  )

  // console.info(`pobject: bo: %O bi: %O`, bo, blocks, bi, transformations.map((v) => v.cond()))

  return {
    ...(bi || {}),
    id: makeId(),
    type: 'pobject',
    items: tfunc() || [],
  }
}

export const combinationSequence = (seq, pos /**pobjects */) => {

}

export const state = {
  encode: (pobjects, values) => {
    const pos = Object.values(pobjects)
    const unrolledpos = nodes(pos)
    const valuepos = unrolledpos.filter(({type}) => type === 'inputfunction') // pobjects with user defined values
    const povalues = reduce.o(valuepos, {key: ({id}) => id, value: ({id}) => values[id]}) // pobject values

    return {
      pobjects: pos,
      values: povalues
    }
  },
  decode: self
}