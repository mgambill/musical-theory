import {
  computed,
  type MaybeRef,
  type InjectionKey,
  provide,
  ref,
  toValue,
  watchEffect,
  inject,
  type Ref,
} from 'vue'

import {
  type Form,
  type Field,
  type StringDictionary,
  type ControlDefinition,
  processForm,
} from '@v3technology/core'
import { resolveComponentDefinition } from './useResolvers'
import type { Component, DefineComponent } from 'vue'
import type { FieldProps } from '~/types'

export const DISPLAY_MODES = {
  entry: 'entry',
  response: 'response',
  edit: 'edit',
  code: 'code',
  unset: 'unset',
} as const
export type DisplayModes = keyof typeof DISPLAY_MODES

export const injectionKey = Symbol('useFormState') as InjectionKey<ReturnType<typeof useFormState>>

function capitalizeFirstCharacter(str: string | null | undefined) {
  if (!str) return str // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const useFormState = (
  form: MaybeRef<Form | undefined>,
  datasource: MaybeRef<FieldProps['datasource']>,
  mode?: MaybeRef<DisplayModes>,
) => {
  const _datasource = ref<StringDictionary>({})
  const _form = ref<Form>()
  const _initialized = ref(false)
  const _displayMode = ref<DisplayModes>('unset')

  watchEffect(() => {
    _datasource.value = toValue(datasource) ?? {}

    const $form = toValue(form)
    if ($form) processForm($form, (f: Field) => setProps(f))

    _form.value = $form
    _initialized.value = true
    _displayMode.value = toValue(mode) ?? 'entry'
  })

  const result = {
    initialized: _initialized,
    form: _form,
    datasource: _datasource,
    mode: _displayMode,
    useValue,
  }

  provide(injectionKey, result)

  return result

  function setProps<T>(f: Field<T>, d?: ControlDefinition) {
    d ??= resolveComponentDefinition(f.control)
    if (!d) return
    const props = {} as StringDictionary<any>

    if (d.props) {
      for (const prop in d.props) {
        props[prop] = d.props[prop].defaultValue
      }
    }

    return Object.assign(props, f.props)
  }
}

export const getFormStateContext = () => {
  const context = inject(injectionKey)!
  if (context === undefined) {
    console.error('useValue() called without a parent useFormState()')
  }
  return context
}

export const useValue = <T, R>(
  props: Partial<FieldProps<T>> & Pick<FieldProps<T>, 'field' | 'datasource'>,
  initialValue: R,
  local?: Ref<StringDictionary>,
) => {
  const context = inject(injectionKey)!
  if (context === undefined) {
    console.error('useValue() called without a parent useFormState()')
  }
  const f = props.field
  const key = f.property ?? f.id
  const ds = local?.value
    ? local.value
    : props.datasource
      ? ref(props.datasource)
      : context.datasource
        ? context.datasource
        : ref({} as StringDictionary)
  console.log('useValue', ds.value[key])
  ds.value ??= {}

  if (initialValue && ds.value[key] === undefined) ds.value[key] = initialValue

  const value = computed<R>({
    get: () => {
      const v = ds.value[key] ?? initialValue
      // console.log('get ->', key, toValue(v))
      return v
    },
    set: (newValue: unknown) => {
      // console.log('set ->', key, value, newValue, ds.value)
      ds.value[key] = newValue
    },
  })

  const defaultOtherField = {
    id: crypto.randomUUID(),
    control: 'text',
    attrs: { placeholder: 'Other ' + capitalizeFirstCharacter(f.property) },
    property: 'other' + capitalizeFirstCharacter(f.property),
    label: { visibility: 'hidden' },
  } as Field

  return { context, value, key, defaultOtherField }
}
