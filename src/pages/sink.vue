<script setup lang="ts">
import form from '../forms/controls'
import { useFormState } from '~/components/composables/useFormState'
import { FieldComponent } from '~/components/fields'

const { datasource } = useFormState(form, {}, 'entry')
</script>

<template>
  <div class="bg-zinc-100">
    <main class="p-8 w-full max-w-screen-xl mx-auto">
      <div class="bg-white p-4">
        <h3 class="pb-4 text-2xl font-light">{{ form.title }}</h3>
        <template v-for="f in form.slots.default.fields" :key="f.id">
          <div>
            <FieldComponent :field="f" :datasource />
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
