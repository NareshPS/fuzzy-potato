import {self} from 'orb-functions'


const funcs = {
  number: v => Number(v),
  array: _ => [],
  object: _ => {},
  value: v => new Function(`return (${v})`)()
}

export const string = {name: 'string', func: self}
export const number = {name: 'number', func: funcs.number}
export const array = {name: 'array', func: funcs.array}
export const object = {name: 'object', func: funcs.object}
export const value = {name: 'value', func: funcs.value}