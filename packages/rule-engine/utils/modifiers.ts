import type { Modifier } from '../types'

export function isDate(value: unknown): value is Date {
  if (value instanceof Date) return !isNaN(value.getTime())

  if (typeof value !== 'string') return false

  const date = new Date(value)
  return !isNaN(date.getTime())
}

export function calculateAge(dateString: string | Date, currentDate?: Date): number {
  currentDate ??= new Date()
  const birthDate = new Date(dateString)
  let age = currentDate.getFullYear() - birthDate.getFullYear()
  const monthDifference = currentDate.getMonth() - birthDate.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

// @ts-ignore
export const modifiers = new Map<string, Modifier>([
  [
    'length',
    {
      canModify: (value) => typeof value === 'string' || Array.isArray(value),
      value: (value) => value.length,
    },
  ],
  [
    'toLowerCase',
    {
      canModify: (value) => typeof value === 'string',
      value: (value) => value.toLowerCase(),
    },
  ],
  [
    'toUpperCase',
    {
      canModify: (value) => typeof value === 'string',
      value: (value) => value.toUpperCase(),
    },
  ],
  [
    'age',
    {
      canModify: (value: string | Date) => {
        if (value === undefined || value === null) return false
        return isDate(value)
      },
      value: (value: string | Date, currentDate: Date) => calculateAge(value, currentDate),
    },
  ] as unknown as Modifier<string | Date, number, [Date?]>,
])
