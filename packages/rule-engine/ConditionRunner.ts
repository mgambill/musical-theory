import type { Condition, ConditionType, Modifier, ConditionHandler, HandlerArgs, TokenDefinition, ConditionResultSet, ModifierMap, Rule } from './types'

import * as tokens from './tokens'

import { getValueByPath, applyModifiers, toMap } from './utils'
import { modifiers } from './utils/modifiers'

//export const condition = <const T, const W = never>(opt: ConditionType<T, W>) => opt as ConditionType<T>
export const condition = <const T, const W = never>(o: Partial<Condition> | ConditionType<T, W>) => o as Condition
export const rule = (options: Partial<Rule>) => Object.assign({ trigger: 'advance', condition: null, actions: [] }, options) as Rule

// The 'and' function: accepts an array of values (or nested logical expressions)
export function and(...args: Condition[]): Condition {
  return {
    operator: 'And',
    conditions: args,
  }
}

// The 'or' function: accepts an array of values (or nested logical expressions)
export function or(...args: Condition[]): Condition {
  return {
    operator: 'Or',
    conditions: args,
  }
}

// The 'or' function: accepts an array of values (or nested logical expressions)
export function not(...args: Condition[]): Condition {
  return {
    operator: 'Not',
    conditions: args,
  }
}

export function isRule(object: any): object is Rule {
  return 'trigger' in object && 'actions' in object
}

export function isCondition(object: any): object is Condition {
  return 'operator' in object
}

export class ConditionRunner {
  handlers: Map<string, ConditionHandler>
  modifiers: Map<string, Modifier>

  constructor(definition: ConditionRunnerDefinition) {
    if (!definition) console.warn('No definition provided for ConditionRunner. This will result in an empty runner.')
    this.handlers = definition?.handlers ?? new Map()
    this.modifiers = definition?.modifiers ?? new Map()
  }

  getValueByPath<T>(obj: T, path: string): [any, { key: string; args: any[] }[]] {
    return getValueByPath(obj, path, this.modifiers)
  }

  public filter<T, C extends Rule | Condition>(source: T[], ...condition: C[]): T[] {
    return source.filter((item) => condition.every((c) => this.test(item, c)))
  }

  public evaluate<T, C extends Rule | Condition>(source: T, ...condition: C[]): ConditionResultSet<C>[] {
    return condition.map((item) => ({ source: item, result: this.test(source, item) }))
  }

  isOption(value: any): boolean {
    return value && value.hasOwnProperty('value') && value.hasOwnProperty('label')
  }

  public test<T>(item: T, conditionOrRule: Condition | Rule | undefined | null, strict: boolean = false): boolean | null {
    if (conditionOrRule === undefined || conditionOrRule === null) throw new Error('unable filter on undefined condition or rule')

    if (isRule(conditionOrRule)) {
      if (conditionOrRule.condition === undefined || conditionOrRule.condition === null) return null
      return this.internalTest(item, conditionOrRule.condition as Condition, strict)
    }

    if (isCondition(conditionOrRule)) return this.internalTest(item, conditionOrRule, strict)

    console.assert(false, 'unable filter on invalid condition or rule')

    return null
  }

  internalTest<T>(item: T, condition: Condition, strict: boolean = false): boolean | null {
    // debugger
    const { operator } = condition
    // For property-based conditions, we need to evaluate the condition against each item.
    if (operator === 'And' || operator === 'Or' || operator === 'Not') {
      return operator === 'And' ? condition.conditions!.every((c) => this.test(item, c)) : operator === 'Or' ? condition.conditions!.some((c) => this.test(item, c)) : !this.test(item, condition)
    }

    const handler = this.handlers.get(operator)

    if (!handler) {
      throw new Error(`No handler for operator "${operator}"`)
    }

    if ('when' in condition && condition.when) {
      if (this.test(item, condition.when, strict) === false) {
        console.debug('When condition not met')
        return null
      }
    }

    if ('property' in condition && condition.property !== undefined) {

      // eslint-disable-next-line
      let [value, modifiers] = this.getValueByPath(item, condition.property)

      value = applyModifiers(this.modifiers, value, modifiers)

      // if the value is not an option assume we are comparing value of the option
      if (this.isOption(value) && this.isOption(condition.value) === false) {
        value = value.value
      }

      if (value === undefined) {
        if (operator === 'IsUndefined') return true
        if (operator === 'IsDefined') return false
        if (operator === 'IsNotNull') return true
        return null
        //  return strict === false
      }

      console.log('handler', handler, item, value, condition)

      return handler({
        value: 'value' in condition ? condition.value : null,
        property: value,
      } as HandlerArgs)
    }

    throw new Error('Invalid condition structure.')
  }
}

export class ConditionRunnerDefinition {
  handlers: Map<string, ConditionHandler>
  modifiers: Map<string, Modifier>
  debug: boolean

  constructor(_handlers?: TokenDefinition[], modifiers?: Map<string, Modifier> | Record<string, Modifier>, debug: boolean = false) {
    this.handlers = new Map()
    _handlers?.forEach(this.registerHandler.bind(this))

    this.modifiers = toMap(modifiers)

    this.debug = debug
  }

  // Allow users to add runtime modifiers
  public registerModifier(name: string, mod: Modifier): void {
    this.modifiers.set(name, mod)
  }

  public registerHandler({ name, handler }: TokenDefinition): void {
    const wrapper = (options: HandlerArgs): boolean => {
      const result = handler(options)
      if (this.debug) console.log(`${options.value} %c${name}`, 'color:limegreen', options.property, result)
      return result
    }
    this.handlers.set(name, wrapper)
  }
}

const def = new ConditionRunnerDefinition(Object.values(tokens), modifiers)

export const conditionRunnerDefinitions = def
