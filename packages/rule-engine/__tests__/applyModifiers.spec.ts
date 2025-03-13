import { test, expect } from 'vitest'
import { applyModifiers, modifiers as map, toMap } from '../utils'

test('applyModifiers empty', () => {
  const value = applyModifiers(map, 'fool', [])

  expect(value).toEqual('fool')
})

test('applyModifiers empty', () => {
  // @ts-expect-error - should not allow undefined
  const value = applyModifiers(map, 'fool', undefined)

  expect(value).toEqual('fool')
})

test('applyModifiers toUpperCase', () => {
  const value = applyModifiers(map, 'fool', [{ key: 'toUpperCase', args: [] }])

  expect(value).toEqual('FOOL')
})

test('applyModifiers toLowerCase', () => {
  const value = applyModifiers(map, 'fool', [{ key: 'toLowerCase', args: [] }])

  expect(value).toEqual('fool')
})

test('applyModifiers length string', () => {
  const value = applyModifiers(map, 'fool', [{ key: 'length', args: [] }])

  expect(value).toEqual(4)
})

test('applyModifiers length array', () => {
  const value = applyModifiers(map, ['fool', 'bar'], [{ key: 'length', args: [] }])

  expect(value).toEqual(2)
})

test('applyModifiers age Date', () => {
  const currentDate = new Date('2025-03-03')
  const value = applyModifiers(map, new Date('2000-01-01'), [{ key: 'age', args: [currentDate] }])

  expect(value).toEqual(25) // Adjust the expected value based on the current year
})

test('applyModifiers age String', () => {
  const currentDate = new Date('2025-03-03')
  const value = applyModifiers(map, '2000-01-01', [{ key: 'age', args: [currentDate] }])

  expect(value).toEqual(25) // Adjust the expected value based on the current year
})