import { type ToastMessageOptions } from 'primevue/toast'
import type { Action } from '~/rule-engine'
export type { FieldProps, ComponentDefinition } from '~/components/types'

export interface AlertAction extends Action, ToastMessageOptions {
  type: 'alert'
  message: string
}
export const isAlertAction = (action: Action): action is AlertAction => action.type === 'alert'


export interface ExitMessageAction extends Action, ToastMessageOptions {
  type: 'exit'
  message: string
}
export const isExitMessageAction = (action: Action): action is ExitMessageAction => action.type === 'alert'


export interface RedirectAction extends Action {
  type: 'redirect'
  to: string
}
export const isRedirectAction = (action: Action): action is RedirectAction =>
  action.type === 'redirect'


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
