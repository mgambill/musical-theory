import type { Modifier } from '../types/modifiers'
export * from './modifiers'

// Function to apply extracted modifiers to a value
export function applyModifiers(
  modifiersMap: Map<string, Modifier>,
  value: any,
  modifiers: { key: string; args: any[] }[],
) {
  if (!modifiers || modifiers.length === 0) return value

  for (const { key, args } of modifiers ?? []) {
    const modifier = modifiersMap.get(key)
    if (modifier && modifier.canModify(value)) {
      value = modifier.value(value, ...args)
    } else {
      console.warn(`Modifier "${key}" not found or cannot modify value`, {
        value,
        modifier,
        args,
        can: modifier ? modifier.canModify(value) : false,
      })
    }
  }

  return value
}

// Extracts the value from an object and parses modifiers
export function getValueByPath<T>(
  obj: T,
  path: string,
  modifiersMap: Map<string, Modifier>,
): [any, { key: string; args: any[] }[]] {
  const modifierPattern = /\.\s*([a-zA-Z_$][\w$]*)\s*\((.*?)\)/g

  let value: unknown = obj
  const modifiers: { key: string; args: unknown[] }[] = []

  // Extract property path without modifiers
  const basePath = path.replace(modifierPattern, '')
  const properties = basePath.split('.')

  for (const part of properties) {
    if (value === undefined || value === null) break
    if (part === 'length') {
      const modifierKey = 'length'
      if (modifiersMap.has(modifierKey)) {
        modifiers.push({ key: modifierKey, args: [] })
      }

      break
    }
    value = value[part]
  }

  // Extract modifiers
  let match
  while ((match = modifierPattern.exec(path)) !== null) {
    const modifierKey = match[1] // e.g., "toUpperCase"
    const args = match[2] // e.g., "0,1"
      ? match[2].split(',').map((arg) => (isNaN(Number(arg)) ? arg.trim() : Number(arg.trim())))
      : []

    if (modifiersMap.has(modifierKey)) {
      modifiers.push({ key: modifierKey, args })
    }
  }

  return [value, modifiers]
}

export function toMap<T>(input?: Map<string, T> | Record<string, T>): Map<string, T> {
  if (input instanceof Map) {
    return input
  }

  const map = new Map<string, T>()
  if (input && typeof input === 'object') {
    Object.entries(input).forEach(([key, value]) => {
      map.set(key, value)
    })
  }
  return map
}
