<script setup lang="ts">
import { ref } from 'vue'
import * as PrimeVue from 'primevue'
import { getFormStateContext } from '../../composables/useFormState'
import InlineContent from '../InlineContent.vue'
import FieldComponent from '../FieldComponent.vue'

import { type Form } from '@v3technology/core'
import { WizardLayout } from '../layouts'

const form = defineModel<Form>('form', { required: true })
const { isEditMode } = getFormStateContext()
//import FieldComponent from '../../FieldComponent.vue';
const templates = [
  {
    name: 'Default',
    value: 'simple',
  },
  {
    name: 'Tabs',
    value: 'tabs',
  },
  {
    name: 'Wizard',
    value: 'wizard',
  },
]
const currentKey = ref('')
watchEffect(() => {
  console.log('WE form', form.value)
})
</script>

<template>
  <div :class="$attrs.class ?? 'bg-white p-4 border border-gray-200 rounded-lg shadow'" v-if="form">
    <template v-if="isEditMode">
      <div class="float-right">
        <PrimeVue.Select
          class=""
          v-model="form.template"
          size="small"
          :options="templates"
          optionLabel="name"
          optionValue="value"
          placeholder="Select a Layout"
        >
        </PrimeVue.Select>
      </div>
      <InlineContent v-model="form.title" class="text-2xl font-light" />
      <hr class="my-4" />
    </template>
    <template v-else-if="form.title">
      <div>
        <h3 class="text-2xl font-light">{{ form.title }}</h3>
        <hr class="my-4" />
      </div>
    </template>

    <section class="flex flex-col gap-4">
      <template v-if="form.template === 'tabs'">
        <PrimeVue.Tabs
          :value="currentKey"
          class="!grid !grid-rows-[auto_1fr] w-full h-full border-r"
          @update:value="(key) => (currentKey = key as string)"
        >
          <PrimeVue.TabList>
            <template v-for="(slot, key) in form.slots" :key="key">
              <template v-for="(panel, index) in slot.fields" :key="panel.id">
                <PrimeVue.Tab :value="panel.id" :class="{ '!bg-primary/5': currentKey === key }">
                  {{ panel.label?.text || `Tab ${index + 1}` }}
                </PrimeVue.Tab>
              </template>
            </template>
          </PrimeVue.TabList>
          <PrimeVue.TabPanels class="relative bg-black">
            <template v-for="(slot, key) in form.slots" :key="key">
              <template v-for="panel in slot.fields" :key="panel.id">
                <PrimeVue.TabPanel :value="panel.id">
                  <template v-for="(field, index) in panel?.fields" :key="index">
                    <FieldComponent :field :index="index" />
                  </template>
                </PrimeVue.TabPanel>
              </template>
            </template>
          </PrimeVue.TabPanels>
        </PrimeVue.Tabs>
      </template>

      <template v-else-if="form.template === 'wizard'">
        <WizardLayout v-model:form="form" :isEditMode />
      </template>

      <template v-else>
        <template v-for="(slot, key) in form.slots" :key="key">
          <template v-for="(field, index) in slot.fields" :key="field.id">
            <FieldComponent :field :index="index" />
          </template>
        </template>
      </template>
    </section>

    <slot name="footer" />
  </div>
</template>
