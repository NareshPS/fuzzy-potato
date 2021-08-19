import {default as test} from 'ava'

import { map, reduce } from 'orb-array'
import {nodes, value} from './graph'
import { pngsrc, states } from './graph.test.data'
import { state, state2 } from './state.test.fns'

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
  const {nodes, functions, values} = state2(
    [{name: 'map'}, {value: '[2, 3, 4]'}, {value: '(v) => v*2'}],
    [[0, 1], [0, 2]]
  )
  const [node] = nodes
  const output = await value(node.object, functions, values)

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
  const {nodes, functions, values} = state2(
    [
      {name: 'filter'},
      {value: '[1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4]'},
      {value: '(_, index) => (index+1)%4 != 0'}
    ],
    [[0, 1], [0, 2]]
  )
  const [node] = nodes
  const output = await value(node.object, functions, values)
  t.deepEqual(output, [1, 1, 1, 2, 2, 2, 4, 4, 4])
})
/////////////////////////////// value-transformations [end] ///////////////////////////////

/////////////////////////////// value-tensors [start] ///////////////////////////////
test('value-tf.tensor', async t => {
  const {nodes, functions, values} = state2(
    [
      {name: 'tf.tensor'},
      {value: '[1, 1, 2, 2, 4, 4, 8, 8]'},
      {value: '[2, 2, 2]'},
    ],
    [
      [0, 1],
      [0, 2],
    ]
  )
  const node = nodes[0].object

  const output = await value(node, functions, values)
  t.deepEqual(output.arraySync(), [ [ [ 1, 1 ], [ 2, 2 ] ], [ [ 4, 4 ], [ 8, 8 ] ] ])
})

test('value-tf.conv2d', async t => {
  const {nodes, functions, values} = state2(
    [
      {name: 'tf.conv2d'},
      {name: 'tf.tensor'},
      {value: '[1, 1, 2, 2, 4, 4, 8, 8]'},
      {value: '[2, 2, 2]'},
      {value: '[[[[1], [1]], [[1], [1]]], [[[1], [1]], [[1], [1]]]]'},
      {value: '2'},
      {value: '\'same\''}
    ],
    [
      [1, 2],
      [1, 3],
      [0, 1],
      [0, 4],
      [0, 5],
      [0, 6],
    ]
  )
  const node = nodes[0].object
  const output = await value(node, functions, values)
  t.deepEqual(output.arraySync(), [ [ [ 30 ] ] ])
})

test('value-tf.conv2d-image', async t => {
  const {nodes, functions, values} = states.conv2dimage()
  const node = nodes[12].object
  // console.info(node, values)
  const output = await value(node, functions, values)

  t.deepEqual(output.shape, [14, 14, 1])
})
/////////////////////////////// value-tensors [end] ///////////////////////////////

/////////////////////////////// nodes [start] ///////////////////////////////
test('nodes', t => {
  const {defs, nodes: statenodes} = states.conv2dimage()
  const heads = reduce.o(
    Object.values(statenodes).map(({object}) => object),
    {key: ({id}) => id}
  )
  console.info(`node heads: `, heads)
  const graphnodes = nodes(heads)
  const valuenodes = graphnodes.filter(({type}) => type === 'valuefunction')

  // console.info(`output nodes: `, valuenodes, defs.filter(({value}) => value))
  t.is(graphnodes.length, defs.length * 2)
  t.is(valuenodes.length, defs.filter(({value}) => value != undefined).length)
})
/////////////////////////////// nodes [end] ///////////////////////////////