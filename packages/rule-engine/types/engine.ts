import type { Condition } from './condition'

export type HandlerArgs = {
  value?: Condition['value'] | null
  property: any
  source?: Condition
}

export type ConditionHandler = (args: HandlerArgs) => boolean

export type TokenDefinition = {
  name: string
  handler: ConditionHandler
}

export type ConditionResultSet<T> = { source: T; result: boolean | null }

export interface Action {
  type: string
  exit: boolean
  [key: string]: any
}
export type Rule = {
  label?: string
  ruleSet?: string
  trigger: RuleTrigger
  condition?: Condition
  actions: Action[]
}

export type RuleTrigger = 'advance' | 'immediate' | 'submission' | 'milestone' | 'always' | 'manual' | 'scheduled'
