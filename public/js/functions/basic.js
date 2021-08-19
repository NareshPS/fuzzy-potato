import { range, reduce } from 'orb-array'
import { self as selffn } from 'orb-functions'
import { read } from './file'
import {pixels as pngpixels} from './png'

const funcs = {
  // type functions
  code: v => new Function(`return ${v}`)(),
  file: (vs = []) => Promise.all(range(vs.length).map((index) => read(vs.item(index)))),
  png: (fs = []) => Promise.all(fs.map((f) => pngpixels(f))),
  call: (fn, ...args) => new Function('args', `return ${fn}(...args)`)(args),
  method: (o, name, ...args) => new Function('o', 'args', `return o.${name}(...args)`,)(o, args),
  property: (o, prop) => new Function('o', 'prop', `return o.${prop}`)(o, prop),
  self: selffn, 

  // container functions
  array: (...v) => v,
  object: _ => {},
  item: (key, value) => ({[key]: value}),

  // transformation functions
  pick: (v, prop) => v[prop],
  slice: (v, props = Object.keys(v)) => reduce.o(props, {value: (p) => v[p]}),
  merge: (source, ...rest) => Object.assign(source, ...rest),
  map: (items, fn) => items.map(fn),
  filter: (items, fn) => items.filter(fn),

  // tensor functions
  'tf.tensor': (v, ...args) => tf.tensor(v, ...args),
  'tf.conv2d': (t, ...args) => tf.conv2d(t, ...args),
}

// type exports
export const code = {name: 'code', func: funcs.code, input: 'text'}
export const file = {name: 'file', func: funcs.file, input: 'file'}
export const png = {name: 'png', func: funcs.png}
export const call = {name: 'call', func: funcs.call}
export const method = {name: 'method', func: funcs.method}
export const property = {name: 'property', func: funcs.property}
export const self = {name: 'self', func: funcs.self}

// container exports
export const array = {name: 'array', func: funcs.array}
export const object = {name: 'object', func: funcs.object}
export const item = {name: 'item', func: funcs.item}

// transformation exports
export const pick = {name: 'pick', func: funcs.pick}
export const slice = {name: 'slice', func: funcs.slice}
export const merge = {name: 'merge', func: funcs.merge}
export const map = {name: 'map', func: funcs.map}
export const filter = {name: 'filter', func: funcs.filter}

// tensor exports
export const tftensor = {name: 'tf.tensor', func: funcs['tf.tensor']}
export const tfconv2d = {name: 'tf.conv2d', func: funcs['tf.conv2d']}