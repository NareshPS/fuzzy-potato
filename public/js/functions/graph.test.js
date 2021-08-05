import {default as test} from 'ava'
import * as types from './basic'

import { map, range, reduce, zip } from 'orb-array'
import {value} from './graph'
import { compose } from './pobject'
import { pngsrc } from './graph.testdata'

/////////////////////////////// value-types [start] ///////////////////////////////
test('value-code', async t => {
  const {node, functions, values} = state(
    ['code'],
    ['{name: \"naresh\"}'],
    []
  )

  const output = await value(node, functions, values)
  t.deepEqual(output, {name: "naresh"})
})

test('value-call', async t => {
  const {node, functions, values} = state(
    ['call', 'code', 'code'],
    [undefined, '\"Uint8Array.from\"', '[1, 2, 3]'],
    [[0, 1], [0, 2]]
  )

  const output = await value(node, functions, values)

  t.deepEqual(output, Uint8Array.from([1, 2, 3]))
})

test('value-method-no-args', async t => {
  const {nodes, functions, values} = state2(
    [{name: 'method'}, {value: '[1, 2, 3, 4]'}, {value: '\"reverse\"'}],
    [[0, 1], [0, 2]]
  )

  const node = nodes[0]
  // console.info(`nodes and selected node: `, nodes, node)
  const output = await value(node.object, functions, values)

  t.deepEqual(output, [4, 3, 2, 1])
})

test('value-method-with-args', async t => {
  const {nodes, functions, values} = state2(
    [
      {name: 'method'},
      {value: '[1, 2, 3, 4]'},
      {value: '\"slice\"'},
      {value: '2'}
    ],
    [[0, 1], [0, 2], [0, 3]]
  )

  const node = nodes[0]
  // console.info(`nodes and selected node: `, nodes, node)
  const output = await value(node.object, functions, values)

  t.deepEqual(output, [3, 4])
})

test('value-png', async t => {
  const {node, functions, values} = state(
    ['pick', 'code', 'png', 'code'],
    [undefined, 0, undefined, `[\"${pngsrc}\"]`],
    [[2, 3], [0, 2], [0, 1]]
  )

  const {blob, width, height} = await value(node, functions, values)

  t.is(width, 28)
  t.is(height, 28)
  t.is(blob.length, 3136)
})
/////////////////////////////// value-types [end] ///////////////////////////////

/////////////////////////////// value-transformations [start] ///////////////////////////////
test('value-map', async t => {
  const {node, functions, values} = state(
    ['map', 'code', 'code'],
    [undefined, '[2, 3, 4]', '(v) => v*2'],
    [[0, 1], [0, 2]]
  )

  const output = await value(node, functions, values)

  t.deepEqual(output, map.scale([2, 3, 4], 2))
})

test('value-pick-object', async t => {
  const {node, functions, values} = state(
    ['pick', 'code', 'code'],
    [undefined, '{name: \"naresh\"}', '\"name\"'],
    [[0, 1], [0, 2]]
  )
  
  const output = await value(node, functions, values)
  t.is(output, 'naresh')
})

test('value-pick-array', async t => {
  const {node, functions, values} = state(
    ['pick', 'code', 'code'],
    [undefined, '["hello", "goodbye", "welcome"]', 1],
    [[0, 1], [0, 2]]
  )

  const output = await value(node, functions, values)
  t.is(output, "goodbye")
})

test('value-filter', async t => {
  const {node, functions, values} = state(
    ['filter', 'code', 'code'],
    [undefined, '[1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4]', '(_, index) => (index+1)%4 != 0'],
    [[0, 1], [0, 2]]
  )

  const output = await value(node, functions, values)
  t.deepEqual(output, [1, 1, 1, 2, 2, 2, 4, 4, 4])
})
/////////////////////////////// value-transformations [end] ///////////////////////////////

/////////////////////////////// value-tensors [start] ///////////////////////////////
test('value-tf.tensor', async t => {
  const {node, functions, values} = state(
    ['tf.tensor', 'code', 'code'],
    [undefined, '[1, 1, 2, 2, 4, 4, 8, 8]', '{shape: [2, 2, 2]}'],
    [[0, 1], [0, 2]]
  )

  const output = await value(node, functions, values)
  t.deepEqual(output.arraySync(), [ [ [ 1, 1 ], [ 2, 2 ] ], [ [ 4, 4 ], [ 8, 8 ] ] ])
})

test('value-tf.conv2d', async t => {
  const {node, functions, values} = state(
    ['tf.conv2d', 'tf.tensor', 'code', 'code', 'code'],
    [
      undefined,
      undefined,
      '[1, 1, 2, 2, 4, 4, 8, 8]',
      '{shape: [2, 2, 2]}',
      '{filters: [[[[1], [1]], [[1], [1]]], [[[1], [1]], [[1], [1]]]], strides: 2, pad: "same"}',
    ],
    [[1, 2], [1, 3], [0, 1], [0, 4]]
  )
  const output = await value(node, functions, values)
  t.deepEqual(output.arraySync(), [ [ [ 30 ] ] ])
})

test('value-tf.conv2d-image', async t => {
  const {nodes, functions, values} = state2(
    [
      {name: 'tf.tensor'},
      {name: 'pick'},
      {name: 'pick'},
      {name: 'png'},
      {value: `[\"${pngsrc}\"]`},
      {value: 0},
      {value: '\"blob\"'},
      {value: '{shape: [28,28,3], dtype: \'float32\'}'},
      {name: 'call'},
      {value: '\"Uint8Array.from\"'},
      {name: 'filter'},
      {value: '(v, index) => (index+1)%4!=0'},
      {name: 'tf.conv2d'}, //12
      {value: '{filters: [[[[1], [1], [1]], [[1], [1], [1]]], [[[1], [1], [1]], [[1], [1], [1]]]], strides: 2, pad: "same"}'}
    ],
    [
      [3, 4],
      [2, 3],
      [2, 5],
      [1, 2],
      [1, 6], //gets the blob
      [10, 1],
      [10, 11], // removes the alpha channel
      [8, 9],
      [8, 10], // converts to Uint8Array
      [0, 8],
      [0, 7], // converts to a tensor
      [12, 0],
      [12, 13]
    ]
  )
  const node = nodes[12].object
  // console.info(node, values)
  const output = await value(node, functions, values)

  t.deepEqual(output.shape, [14, 14, 1])
})
/////////////////////////////// value-tensors [end] ///////////////////////////////

/////////////////////////////// Utility Methods [start] ///////////////////////////////
const state = (names, typevalues, sequence) => {
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

const state2 = (defs, sequence) => {
  const functions = reduce.o(
    Object.values(types),
    { key: ({name}) => name, value: v => ({id: v.name, ...v}) }
  )
  const namefn = (v) => v.name || 'code'
  const nodes = reduce.a(defs, {value: (v) => ({...v, object: compose(functions[namefn(v)], functions, [])})})
  const values = reduce.o(nodes, {key: (v) => v.object.items[0].id, value: (v) => v.value})
  sequence.forEach(([to, from]) => {nodes[to].object.items.push(nodes[from].object)})
  
  return {nodes, functions, values}
}
/////////////////////////////// Utility Methods [end] ///////////////////////////////