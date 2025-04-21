<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useToggle } from '@vueuse/core'
import { type ControlDefinition, type Field, type FieldLabel } from '@v3technology/core'
import * as PrimveVue from 'primevue'
import { useComponentContext, useFormState, FieldComponent } from '~/components'

const { getDefinitions } = useComponentContext()
const definitions = getDefinitions()

const field = defineModel<Field>('field')
const def = ref<ControlDefinition>()
const isQuestion = computed(() => {
  if (!def.value) return false
  return !def.value.controlType.isStructural
})
const label = computed({
  get: () => field.value?.label ?? {},
  set: (value) => {
    if (field.value) {
      field.value.label ??= {
        text: '',
        visibility: 'visible',
        bold: false,
      } as FieldLabel
      field.value.label = { ...field.value.label, ...value }
    }
  },
})

const visibilityOptions = [
  { id: null, label: 'Unset' },
  { id: 'visible', label: 'Visible' },
  { id: 'invisible', label: 'Invisible' },
  { id: 'hidden', label: 'Hidden' },
]

watchEffect(() => {
  if (!field.value) return
  def.value = field.value && definitions.find((d) => d.id === field.value?.control)
  if (def.value && field.value) {
    if (!def.value.props) return
    field.value.props ??= {}
    if (Object.keys(field.value.props).length === 0) {
      Object.entries(def.value.props).forEach(([key, prop]) => {
        field.value!.props![key] = prop.defaultValue
      })
    }
  } else {
    console.warn('No definition found for field', field.value, def.value?.props)
  }
})

const { datasource } = useFormState(undefined, {})
const [isOpen, toggle] = useToggle(false)

const createInitialValueField = (field: Field) => {
  const initialValueField = { ...field }
  initialValueField.id = `${field.id}-initial`
  initialValueField.property = field.property
  initialValueField.label = {
    text: 'Initial Value',
  }
  initialValueField.props ??= {}
  initialValueField.props.value = datasource.value[field.id]
  return initialValueField
}
</script>

<template>
  <PrimveVue.Dialog
    header="Definition"
    v-model:visible="isOpen"
    modal
    class="w-full max-w-screen-lg"
  >
    <pre class="text-sm">{{ def }}</pre>
  </PrimveVue.Dialog>

  <details open class="group transition">
    <summary
      class="flex select-none appearance-none items-center gap-1.5 border-t bg-slate-100 px-4 py-3 text-sm font-semibold leading-6 text-slate-800"
    >
      <i class="fal fa-chevron-down hidden group-open:inline-block" aria-hidden="true"></i
      ><i class="fal fa-chevron-right inline-block group-open:hidden" aria-hidden="true"></i>
      General
    </summary>
    <div class="group-open:p-3" v-if="field">
      <div class="space-y-3">
        <div>
          <label for="name" class="block w-full">Control</label>
          <div class="control border border-dotted bg-zinc-100 px-3 py-2 font-mono text-gray-500">
            {{ def?.label ?? '&nbsp;' }}
          </div>
        </div>
        <div>
          <label for="name" class="block w-full">Id</label>
          <div class="control border border-dotted bg-zinc-100 px-3 py-2 font-mono text-gray-500">
            {{ field.id ?? '&nbsp;' }}
          </div>
        </div>

        <div class="flex-1">
          <div class="flex justify-between">
            <label for="name" class="mb-0.5 block w-full text-sm font-medium">Field Type</label>
            <a class="text-xs opacity-30" @click.stop="() => toggle()" :class="def && 'opacity-100'"
              >definition</a
            >
          </div>
          <PrimveVue.Select
            :options="definitions"
            optionLabel="label"
            optionValue="id"
            fluid
            v-model="field.control"
            pt:option:class="group"
            placeholder="Select a field type"
          >
            <template #value="{ value, placeholder }">
              <div v-if="value" class="group flex items-center">
                <i
                  :class="[
                    'fal fa-fw mr-2 group-aria-selected:font-medium group-aria-selected:text-white',
                    value.icon ?? 'fa-cubes',
                  ]"
                ></i>
                <div>{{ def?.label }}</div>
              </div>
              <span v-else>
                {{ placeholder }}
              </span>
            </template>

            <template #option="{ option }">
              <div class="group flex items-center">
                <i
                  :class="[
                    'fal fa-fw mr-2 group-aria-selected:font-medium group-aria-selected:text-white',
                    option.icon ?? 'fa-cubes',
                  ]"
                ></i>
                <div>{{ option.label }}</div>
              </div>
            </template>
          </PrimveVue.Select>
        </div>

        <div class="flex-1" v-if="false">
          <label for="name" class="block w-full">Description</label
          ><PrimveVue.InputText class="w-full" id="name" type="text" />
        </div>

        <div class="flex gap-2">
          <div class="flex-1">
            <label for="label" class="mb-0.5 block w-full text-sm font-medium">Label</label>
            <PrimveVue.InputText v-model="label.text" fluid />
          </div>
          <div>
            <label for="visibility" class="mb-0.5 block w-36 text-sm font-medium">Visibility</label
            ><PrimveVue.Select
              :options="visibilityOptions"
              v-model="label.visibility"
              optionValue="id"
              optionLabel="label"
              id="visibility"
              fluid
            />
          </div>
        </div>

        <div>
          <label
            for="name"
            :class="!def?.allowContent && 'opacity-20'"
            class="mb-0.5 block w-full text-sm font-medium"
            >Content</label
          >
          <div :class="!def?.allowContent && 'opacity-20'">
            <PrimveVue.Textarea
              v-model="field.content"
              rows="3"
              fluid
              :disabled="!def?.allowContent"
            />
          </div>
        </div>
        <div v-if="isQuestion">
          <FieldComponent :field="createInitialValueField(field)" nowrapper />
        </div>
      </div>
    </div>
  </details>
</template>
