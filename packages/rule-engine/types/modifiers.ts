export interface Modifier<T, R, U> {
  canModify: (value: T) => boolean
  value: (value: U, ...args: unknown[]) => R
}

export interface ModifierMap {
  [key: string]: Modifier<unknown, unknown, unknown>
}
