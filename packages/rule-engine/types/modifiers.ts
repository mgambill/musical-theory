export type ModifierHandler<T = any, R = any, A = unknown> = (value: T, ...args: A[]) => R

export type Modifier<T = any, R = any, A = unknown> = {
  canModify: (source: T) => boolean
  value: ModifierHandler<T, R, A>
}

export type ModifierMap = Map<string, Modifier>
