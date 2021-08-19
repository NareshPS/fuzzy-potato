import {default as test} from 'ava'
import { slice } from './basic'

test('slice-no-props', t => {
  const o = {name: 'object', type: 'car', value: 'red'}
  const output = slice.func(o)

  t.is(slice.name, 'slice')
  t.deepEqual(output, o)
})

test('slice-with-props', t => {
  const o = {name: 'object', type: 'car', value: 'red'}
  const props = ['name', 'type']
  const output = slice.func(o, props)

  t.is(slice.name, 'slice')
  t.deepEqual(output, {name: 'object', type: 'car'})
})