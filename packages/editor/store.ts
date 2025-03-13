import { ref, computed, type MaybeRefOrGetter, toValue, readonly, type MaybeRef } from 'vue'
import { defineStore, acceptHMRUpdate, storeToRefs } from 'pinia'
import { useStyleTag } from '@vueuse/core'

import type {
  ControlDefinition,
  Field,
  FieldCollection,
  Form,
  Option,
  StringDictionary,
} from '@v3technology/core'
import { processFields } from '@v3technology/core'
import { type DisplayModes } from '~/composables/useFormState'
import { useComponentLookup } from '~/composables/useResolvers'

//export type DisplayModes = 'edit' | 'code' | FormDisplayMode

export const useEditorStore = defineStore('aetherkit.editor', () => {
  const { findDefinitionById, definitions } = useComponentLookup()
  const mode = ref<DisplayModes>('unset')
  const _currentForm = ref({} as Form)
  const _library = ref([] as Form[])
  const _initialized = ref(false)
  const _isEditor = ref(false)
  const _currentField = ref<Field>({} as Field)
  const _hoveredField = ref<Field | null>(null)
  const _currentDefinition = ref<ControlDefinition>()
  const _datasource = ref({} as StringDictionary)

  const initialize = (
    form?: MaybeRefOrGetter<Form>,
    library?: MaybeRefOrGetter<Form[]>,
    datasource?: MaybeRefOrGetter<StringDictionary>,
  ) => {
    _initialized.value = true
    const _form = toValue<Form>(form ?? ({} as Form))
    const defaultFormSettings: Partial<Form> = {
      id: crypto.randomUUID(),
      name: _form.name ?? _form.title ?? 'New Form',
      template: 'page',
      title: _form.title ?? 'New Form',
    }
    _currentForm.value = Object.assign(defaultFormSettings, _form)
    _library.value = toValue(library ?? []) as Form[]
    _isEditor.value = true
    _datasource.value = toValue(datasource ?? {}) as StringDictionary

    _initialize(_currentForm.value.slots.default?.fields ?? [])
  }

  watch(mode, (v) => {
    document.body.setAttribute('data-editor-mode', v)
  })

  const _initialize = (fields: FieldCollection) => {
    const { css } = useStyleTag('')

    const groups: StringDictionary = { entry: [] }
    processFields(fields, (field) => {
      const id = field.id.substring(28)
      const css = `[data-target-id='${id}'] [data-field-id='${id}'], [data-selected-id='${id}'] [data-field-id='${id}']`
      const c = field.control
      if (['panel', 'row'].includes(c)) {
        groups[c] ??= []
        groups[c].push(css)
      } else {
        groups['entry'].push(css)
      }
    })
    var arr = []
    for (const [key, value] of Object.entries(groups)) {
      if (key === 'entry') {
        arr.push(
          `${value.join(',')} {
          background-color: var(--color-${key}-background);
          outline-width: 1px;
          outline-style: solid;
          outline-color:var(--color-${key}-outline);
        }`,
        )
      } else if (key === 'panel') {
        arr.push(
          `${value.join(',')} {
          & .p-panel {
            background-color: var(--color-${key}-background);
            outline-width: 1px;
            outline-style: solid;
            outline-color:var(--color-${key}-outline);
          }
        }`,
        )
      } else if (key === 'row') {
        arr.push(
          `${value.join(',')} {
          background-color: var(--color-${key}-background);
          outline-width: 1px;
          outline-style: solid;
          outline-color:var(--color-${key}-outline);
        }`,
        )
      }
    }

    css.value = `${arr.join('\n')}`
  }

  const updateField = (field: Field, fields: MaybeRef<Field[]>) => {
    const index = toValue(fields).findIndex((f: Field) => f.id === field.id)
    toValue(fields).splice(index, 1, field)
  }
  const removeOption = (field: Partial<Field>, option: Option | string) => {
    const id = typeof option === 'string' ? option : option.value
    const index = toValue(field).options?.findIndex((o) => 'value' in o && o.value === id)
    if (index !== undefined) toValue(field).options?.splice(index, 1)
  }
  const addOption = (field: Partial<Field>, option: Option | string) => {
    const key = crypto.randomUUID()
    const temp: Option =
      typeof option === 'string' ? { key, value: key, label: '' + option } : option
    toValue(field).options?.push(temp)
  }

  const clearCurrentField = () => {
    _currentField.value = {} as Field
    _currentDefinition.value = undefined
  }

  const useBinding = (field?: MaybeRef<Field>, attrs?: any) => {
    return computed(() => {
      const f = toValue(field)
      if (f === undefined) return {}

      const key = f.id.substring(28)

      // if (f.id === _currentField.value?.id) {
      //   classes.push('selected')
      // }

      return {
        onmouseover: (e: Event) => {
          e.stopPropagation()
          document.body.setAttribute('data-target-id', key)
        },
        onmouseout: () => {
          document.body.setAttribute('data-target-id', '')
        },
        onclick: (e: Event) => {
          e.stopPropagation()
          document.body.setAttribute('data-selected-id', key)
          _currentField.value = f
        },
        class: attrs?.class,
        'data-field-id': key,
      }
    })
  }

  return {
    initialize,
    isEditMode: computed(() => mode.value === 'edit'),
    mode: readonly(mode),
    form: _currentForm,
    library: _library,
    initialized: _initialized,
    isEditor: _isEditor,
    datasource: _datasource,
    definitions: computed(() => definitions as ControlDefinition[]),
    currentField: _currentField,
    currentDefinition: readonly(_currentDefinition),
    isCurrentField: (field: Field) => _currentField.value.id === field.id,

    setCurrentField(field: MaybeRef<Field>) {
      const f = toValue(field)
      _currentField.value = toValue(f)
      _currentDefinition.value = findDefinitionById(f.control)
    },
    clearCurrentField,

    setCurrentForm(form: MaybeRef<Form>) {
      clearCurrentField()
      _currentForm.value = toValue(form)
    },
    setMode(value: MaybeRef<DisplayModes> | DisplayModes) {
      console.log('setMode', value)
      mode.value = toValue(value)
    },
    useBinding,
    removeOption,
    addOption,
    updateField,
    hoveredField: _hoveredField,
  }
})

export const useEditorStoreRef = () => storeToRefs(useEditorStore())

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore, import.meta.hot))
}
