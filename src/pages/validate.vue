<script setup lang="ts">
import form from '../forms/validation'
import { useFormState } from '~/components/composables/useFormState'
import { FieldComponent } from '~/components/fields'
import { processForm, type Field } from '@v3technology/core'

const { datasource } = useFormState(form, {}, 'entry')

/**
 * A contrived validation rule that ensures the input’s value is monday or mon.
 */
const monday = function (node) {
  return node.value === 'monday' || node.value === 'mon'
}

// override default rule behaviors for your custom rule
monday.blocking = false
monday.skipEmpty = false
monday.debounce = 20 // milliseconds
monday.force = true

type ValidationSummary = {
  id: string
  validation: Field['validation']
  validationLabel?: string
}

console.log(typeof monday, monday.blocking)
const validation = ref<ValidationSummary[]>([])
processForm(form, (f) => {
  if (f.validation) {
    validation.value.push({
      id: f.id,
      validation: f.validation,
      validationLabel: f.validationLabel,
    })
  }
})
</script>

<template>
  <div class="h-screen grid grid-cols-2">
    <main class="p-8 w-full max-w-xl">
      <template v-for="f in form.slots.default.fields" :key="f.id">
        <div>
          <FieldComponent :field="f" :datasource />
        </div>
      </template>
    </main>

    <article>
      <pre class="p-2 text-xs">{{ { validation, form } }}</pre>
    </article>
  </div>
</template>
