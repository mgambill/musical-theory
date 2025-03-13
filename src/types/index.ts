import type { Action } from '@v3technology/rule-engine'
import { type ToastMessageOptions } from 'primevue/toast'
export type { FieldProps, ComponentDefinition } from '~/types'

export interface AlertAction extends Action, ToastMessageOptions {
  type: 'alert'
}

export const isAlertAction = (action: Action): action is AlertAction => action.type === 'alert'

export interface RedirectAction extends Action {
  type: 'redirect'
  url: string
}
export interface StateAction extends Action {
  type: 'state'
  value: 'enabled' | 'disabled'
  ids: string[]
}

export const isStateAction = (action: Action): action is StateAction => action.type === 'state'

export interface VisibilityAction extends Action {
  type: 'visibility'
  visible: boolean
  ids: string[]
}

export const isVisibilityAction = (action: Action): action is VisibilityAction =>
  action.type === 'visibility'
