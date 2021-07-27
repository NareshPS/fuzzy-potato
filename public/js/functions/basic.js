import {self} from 'orb-functions'
import { range } from 'orb-array'
import { read } from './file'

const funcs = {
  number: (v) => Number(v),
  array: (...v) => v,
  object: _ => {},
  code: v => new Function(`return ${v}`)(),
  file: async (vs) => await Promise.all(range(vs.length).map((index) => read(vs.item(index)))),
  image: self // TODO
}

export const string = {name: 'string', func: self}
export const number = {name: 'number', func: funcs.number}
export const array = {name: 'array', func: funcs.array}
export const object = {name: 'object', func: funcs.object}
export const code = {name: 'code', func: funcs.code, input: 'text'}
export const image = {name: 'image', func: funcs.image}
export const file = {name: 'file', func: funcs.file, input: 'file'}