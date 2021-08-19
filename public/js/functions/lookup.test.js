import test from "ava";
import {lookup} from "./lookup";


test('lookup-empty-object', t => {
  const output = lookup(undefined, 'hello', '')

  t.is(output, '')
})

test('lookup-unknown-property', t => {
  const output = lookup({name: 'toong'}, 'hello', '')

  t.is(output, '')
})

test('lookup-known-property', t => {
  const output = lookup({name: 'toong'}, 'name', '')

  t.is(output, 'toong')
})

test('lookup-deep-property', t => {
  const output = lookup({defaults: {name: 'toong', location: 'crown plaza'}}, 'defaults.name', '')

  t.is(output, 'toong')
})

test('lookup-deep-unknown-property', t => {
  const output = lookup({defaults: {name: 'toong', location: 'crown plaza'}}, 'defaults.path', '')

  t.is(output, '')
})