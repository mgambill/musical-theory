<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { computed } from 'vue'
import { type FieldProps } from '../../types'
import { useValue } from '../../composables/useFormState'
import { type ScaleListFieldProps } from '@v3technology/definitions'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps<ScaleListFieldProps>>()

const { value } = useValue(props, {} as Record<string, unknown>)
const min = props.field.props?.min ?? 0
const max = props.field.props?.max ?? 10
const firstLabel = props.field.props?.firstLabel
const lastLabel = props.field.props?.lastLabel
const array = Array.from({ length: max - min + 1 }, (_, i) => i + min)
const hasFieds = computed(() => (props.field.fields ? props.field.fields.length > 0 : false))
</script>

<template>
  <BaseField v-bind="props">
    <table class="border">
      <template v-if="hasFieds">
        <thead>
          <tr class="*:p-2 border-b border-gray-200 text-sm/6 text-gray-700 bg-zinc-50/40">
            <th>&nbsp;</th>
            <template v-for="item in array" :key="item">
              <th>{{ item }}</th>
            </template>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <template v-for="f in field.fields" :key="f.id">
            <tr class="*:p-2">
              <td>{{ f.label?.text }}</td>
              <template v-for="item in array" :key="item">
                <td class="text-center">
                  <ValueComponent v-bind="props">
                    <template #value>
                      <template v-if="value[f.property ?? f.id] === item">
                        <i class="fa fa-fw fa-check text-green-600"></i>
                      </template>
                      <template v-else>
                        <i class="fat fa-fw fa-dash opacity-50"></i>
                      </template>
                    </template>
                    <template #default>
                      <label>
                        <span class="sr-only">{{ `${field.label} ${item}` }}</span>

                        <PrimeVue.RadioButton
                          v-model="value[f.property ?? f.id]"
                          :name="`fld-${f.id}`"
                          :value="item"
                        />
                      </label>
                    </template>
                  </ValueComponent>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </template>
      <template v-else>
        <thead>
          <tr class="*:p-2 border-b border-gray-200 text-sm/6 text-gray-700 bg-zinc-50/40">
            <th>&nbsp;</th>
            <template v-for="item in array" :key="item">
              <th>{{ item }}</th>
            </template>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="*:p-2">
            <td v-if="firstLabel" class="text-right">{{ firstLabel }}</td>
            <template v-for="item in array" :key="item">
              <td class="text-center">
                <ValueComponent v-bind="props">
                  <template #value>
                    <template v-if="typeof value === 'number' && value === item">
                      <i class="fa fa-fw fa-check text-green-600"></i>
                    </template>
                    <template v-else>
                      <i class="fat fa-fw fa-dash opacity-50"></i>
                    </template>
                  </template>
                  <template #default>
                    <PrimeVue.RadioButton v-model="value" :name="`fld-${field.id}`" :value="item" />
                  </template>
                </ValueComponent>
              </td>
            </template>
            <td v-if="lastLabel" class="text-left">{{ lastLabel }}</td>
          </tr>
        </tbody>
      </template>
    </table>
  </BaseField>
</template>
