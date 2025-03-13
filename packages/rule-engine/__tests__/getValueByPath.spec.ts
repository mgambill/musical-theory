import { test, assert, expect } from 'vitest'
import { applyModifiers, getValueByPath } from '../utils'
import type { Modifier } from '../types'

const _modifiers: Modifier[] = [
  {
    key: 'length',
    canModify: (value) => typeof value === 'string' || Array.isArray(value),
    value: (value) => value.length,
  },
  {
    key: 'toLowerCase',
    canModify: (value) => typeof value === 'string',
    value: (value) => value.toLowerCase(),
  },
  {
    key: 'toUpperCase',
    canModify: (value) => typeof value === 'string',
    value: (value) => value.toUpperCase(),
  },
]

test('getValueByPath', () => {
  const obj = {
    a: {
      b: {
        c: 'foo',
      },
    },
  }

  const modifiersMap = new Map()

  const [value, modifiers] = getValueByPath(obj, 'a.b.c', modifiersMap)

  expect(value).toEqual('foo')
  expect(modifiers).to
  assert(modifiers.length == 0)
})

test('getValueByPath with modifiers', () => {
  const obj = {
    a: {
      b: {
        c: ['foo', 'bar'],
      },
    },
  }

  const modifiersMap = new Map(_modifiers.map((m) => [m.key, m]))

  const [value, modifiers] = getValueByPath(obj, 'a.b.c.length', modifiersMap)

  expect(value).toEqual(obj.a.b.c)
  expect(modifiers.length).toEqual(1)
  expect(modifiers[0].key).toEqual('length')
})

test('getValueByPath with modifiers', () => {
  const obj = {
    a: {
      b: {
        c: ['foo', 'bar'],
      },
    },
  }

  const modifiersMap = new Map(_modifiers.map((m) => [m.key, m]))

  const [value, modifiers] = getValueByPath(obj, 'a.b.c.length()', modifiersMap)

  expect(value).toEqual(obj.a.b.c)
  expect(modifiers.length).toEqual(1)
  expect(modifiers[0].key).toEqual('length')
})


