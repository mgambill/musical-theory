import { test, assert, expect } from 'vitest'
import { applyModifiers, getValueByPath } from '../utils'
import type { ModifierMap } from '../types'

const _modifiers: ModifierMap = {
  toLowerCase: {
    canModify: (value: unknown) => typeof value === 'string',
    value: (value: string) => value.toLowerCase(),
  },
  length: {
    canModify: (value: unknown) => typeof value === 'string' || Array.isArray(value),
    value: (value: string | unknown[]) => value.length,
  },
  toUpperCase: {
    canModify: (value: unknown) => typeof value === 'string',
    value: (value: string) => value.toUpperCase(),
  },
}

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

  const modifiersMap = new Map(_modifiers)

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

  const modifiersMap = new Map(_modifiers)

  const [value, modifiers] = getValueByPath(obj, 'a.b.c.length()', modifiersMap)

  expect(value).toEqual(obj.a.b.c)
  expect(modifiers.length).toEqual(1)
  expect(modifiers[0].key).toEqual('length')
})
