export type ComparisonOperators = 'Between' | 'StartsWith' | 'EndsWith' | 'Like' | 'NotLike' | 'In' | 'NotIn' | 'LessThanOrEqualTo' | 'LessThan' | 'GreaterThanOrEqualTo' | 'GreaterThan' | 'EqualTo' | 'NotEqualTo'

export type LogicicalOperators = 'And' | 'Or' | 'Not'

export type QuantifierOperators = 'Any' | 'All'

export type ValueStateOperators = 'IsFalse' | 'IsTrue' | 'IsEmpty' | 'IsNotEmpty' | 'IsNull' | 'IsNotNull' | 'IsUndefined' | 'IsDefined' | 'IsString' | 'IsArray' | 'IsDate' | 'IsNumber' | 'IsBoolean' | 'IsObject'
export type ConditionOperator = ComparisonOperators | LogicicalOperators | QuantifierOperators | ValueStateOperators
import { modifiers } from '../utils/modifiers'

type SingleValue = string | number | boolean | Date

type BaseCondition = {
  key?: string
  schemaId?: string
  when?: Condition
  conditions?: Condition[]
  property?: string
  //modifiers?: (keyof typeof modifiers | string)[]
}

type SingleValueCondition = BaseCondition & {
  operator: Exclude<ComparisonOperators, 'Between' | 'In'> | LogicicalOperators | QuantifierOperators | ValueStateOperators
  value?: SingleValue
}

type InCondition = BaseCondition & {
  operator: 'In' | 'NotIn'
  value?: SingleValue[]
}
type BetweenCondition = BaseCondition & {
  operator: 'Between'
  value?: [SingleValue, SingleValue]
}

export type Condition = SingleValueCondition | BetweenCondition | InCondition

// export type Condition = {
//   key?: string
//   operator: ComparisonOperators | LogicicalOperators | QuantifierOperators | ValueStateOperators
//   schemaId?: string
//   when?: Condition
//   conditions?: Condition[]
//   property?: string
//   modifiers?: (keyof typeof modifiers)[]
//   value?: string | number | boolean | Date |Array<string | number | boolean | Date>
// }
export type OperatorType<T> = {
  [P in keyof T]: T[P] extends string
    ? Extract<ComparisonOperators, 'EqualTo' | 'NotEqualTo' | 'StartsWith' | 'EndsWith' | 'Contains' | 'NotContains' | 'Empty' | 'NotEmpty'>
    : T[P] extends number
      ? Extract<ComparisonOperators, 'EqualTo' | 'NotEqualTo' | 'GreaterThan' | 'LessThan' | 'GreaterThanOrEqualTo' | 'LessThanOrEqualTo'>
      : T[P] extends Date
        ? Extract<ComparisonOperators, 'EqualTo' | 'NotEqualTo' | 'GreaterThan' | 'LessThan' | 'GreaterThanOrEqualTo' | 'LessThanOrEqualTo'>
        : T[P] extends boolean
          ? Extract<ValueStateOperators, 'IsFalse' | 'IsTrue'>
          : T[P] extends Array<any>
            ? QuantifierOperators | 'Count' | Extract<ValueStateOperators, 'IsEmpty' | 'IsNotEmpty'>
            : never
}

export type ConditionType<T, W = never> = (
  | {
      [P in keyof T]: T[P] extends boolean
        ? {
            property: P
            operator: ValueStateOperators
          }
        : T[P] extends Array<infer U>
          ? {
              property: P
              operator: QuantifierOperators
              conditions: ConditionType<U>[]
            }
          : {
              property: P
              operator: OperatorType<T>[P]
              value: T[P] extends Date ? string | number | Date : T[P] extends Array<any> ? never : T[P]
            }
    }[keyof T]
  | {
      operator: LogicicalOperators
      conditions: ConditionType<T>[]
    }
  | {
      property: keyof T
      operator: Extract<ValueStateOperators, 'IsNull' | 'NotNull' | 'IsUndefined' | 'IsDefined'>
    }
) & { key: string; when?: ConditionType<W> }
