<script setup lang="ts">
import * as PrimeVue from 'primevue'
import Label from '../label/Label.vue'
import { type FieldProps } from '~/types'
import { useValue } from '~/composables/useFormState'
import { type AddressFieldProps } from '@v3technology/definitions'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
import { states } from './states'

type AddressFieldResult = {
  lineOne: string
  lineTwo: string
  city: string
  region: string
  postalCode: string
}

const props = defineProps<FieldProps<AddressFieldProps>>()

const { value } = useValue(props, {
  lineOne: '',
  lineTwo: '',
  city: '',
  region: '',
  postalCode: '',
} as AddressFieldResult)
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props">
      <template #value>
        <address>
          <p>{{ value.lineOne }}</p>
          <p v-if="value.lineTwo">{{ value.lineTwo }}</p>
          <p class="flex gap-1">
            <span>{{ value.city }},</span>
            <span>{{ value.region }}</span>
            <span>{{ value.postalCode }}</span>
          </p>
        </address>
      </template>
      <template #default>
        <section class="grid grid-cols-3 gap-4">
          <div class="col-span-full">
            <Label for="address">Street</Label>
            <div class="mt-1">
              <PrimeVue.InputText
                input-id="street-address"
                v-model="value.lineOne"
                autocomplete="street-address"
                class="w-full"
              />
            </div>
            <div class="mt-2">
              <PrimeVue.InputText
                input-id="street-address"
                v-model="value.lineTwo"
                autocomplete="street-address"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-span-full sm:col-span-1">
            <Label for="city">City</Label>
            <div class="mt-1">
              <PrimeVue.InputText
                input-id="city"
                v-model="value.city"
                autocomplete="address-level2"
                class="w-full"
              />
            </div>
          </div>

          <div class="col-span-full sm:col-span-1">
            <Label for="region">State / Province</Label>
            <div class="mt-1">
              <PrimeVue.Select
                :options="states"
                v-model="value.region"
                optionLabel="name"
                optionValue="abbreviation"
                class="w-full"
              />
              <!-- <PrimeVue.InputText input-id="region" v-model="value.region" autocomplete="address-level1" class="w-full" /> -->
            </div>
          </div>

          <div class="col-span-full sm:col-span-1">
            <Label for="postal-code">Postal code</Label>
            <div class="mt-1">
              <PrimeVue.InputText
                input-id="postal-code"
                v-model="value.postalCode"
                autocomplete="postal-code"
                class="w-full"
              />
            </div>
          </div>
        </section>
      </template>
    </ValueComponent>
  </BaseField>
</template>
