<script setup lang="ts">
import { type Field } from "@v3technology/core";
import BaseField from "./BaseField.vue";
import Wrapper from "./Wrapper.vue";
const { field } = defineProps<{ field: Field }>();

</script>

<template>
  <template v-if="['row'].includes(field.control)">
    <Wrapper
      :field="field"
      :class="['inline-flex gap-4 flex-row justify-stretch *:w-full']"
    >
      <template v-for="f in field.fields" :key="f.id">
        <FieldComp :field="f" />
      </template>
    </Wrapper>
  </template>
  <template v-else-if="['container', 'section'].includes(field.control)">
    <Wrapper
      :field="field"

    >
      <template v-for="f in field.fields" :key="f.id">
        <FieldComp :field="f" />
      </template>
    </Wrapper>
  </template>
  <template v-else-if="['panel'].includes(field.control)">
    <Wrapper
      :field="field"
      :class="['flex gap-4 flex-col border border-zinc-300 rounded-lg p-2']"
    >
      <h3 class="font-medium text-lg">{{ field.label?.text }}</h3>
      <template v-for="f in field.fields" :key="f.id">
        <FieldComp :field="f" />
      </template>
    </Wrapper>
  </template>
  <template v-else-if="field.control === 'divider'">
    <template v-if="field.label?.text">
      <Wrapper
        :field="field"
        class="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
      >
        <hr class="border border-zinc-400 bg-zinc-600" />
        <div class="text-sm">{{ field.label.text }}</div>
        <hr class="border border-zinc-400 bg-zinc-600" />
      </Wrapper>
    </template>
    <template v-else>
      <Wrapper :field="field" class="grid items-center gap-4">
        <hr class="border border-zinc-400 bg-zinc-600" />
      </Wrapper>
    </template>
  </template>
  <template v-else-if="field.control === 'heading'">
    <BaseField :field="field">
      <h3 v-if="field.label?.text" class="font-medium text-lg">{{ field.label?.text }}</h3>
    </BaseField>
  </template>
  <template v-else-if="field.control === 'label'">
    <BaseField :field="field">
      <p v-if="field.label?.text" class="font-medium">{{ field.label?.text }}</p>
    </BaseField>
  </template>
  <template v-else-if="field.control === 'paragraph'">
    <BaseField :field="field">
      <textarea
        type="field.control"
        class="border border-zinc-300 rounded-sm px-2 py-1"
      />
    </BaseField>
  </template>
  <template v-else-if="field.control === 'yesno'">
    <BaseField :field="field">
      <div class="flex gap-2 items-center">
        <template
          v-for="o in [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ]"
          :key="o.value"
        >
          <div class="flex gap-1 items-center">
            <input type="radio" :value="o.value" :id="`${field.id}`" />
            <label :for="`${field.id}`">{{ o.label }}</label>
          </div>
        </template>
      </div>
    </BaseField>
  </template>
  <template v-else-if="field.control === 'consent'">
    <BaseField :field="field">
      <div class="flex gap-2 items-center">
        <input type="checkbox" :id="`${field.id}`" />
        <label :for="`${field.id}`">{{ field.content }}</label>
      </div>
    </BaseField>
  </template>
  <template v-else-if="['dropdown', 'multiselect'].includes(field.control)">
    <BaseField :field="field" class="w-full">
      <select class="w-full">
        <option :value="null"></option>
        <template v-for="o in field.options" :key="o.value">
          <option :value="o.value">{{ o.label }}</option>
        </template>
      </select>
    </BaseField>
  </template>
  <template v-else-if="field.control === 'radiolist'">
    <BaseField :field="field">
      <div class="flex gap-2 items-center">
        <template v-for="o in field.options" :key="o.value">
          <div class="flex gap-1 items-center">
            <input type="radio" :value="o.value" :id="`${field.id}`" :name="field.id" v-model="datasource[field.property]" />
            <label :for="`${field.id}`">{{ o.label }}</label>
          </div>
        </template>
      </div>
    </BaseField>
  </template>
  <template v-else-if="field.control === 'checkboxlist'">
    <BaseField :field="field">
      <div class="flex gap-2 items-center">
        <template v-for="o in field.options" :key="o.value">
          <div class="flex gap-1 items-center">
            <input type="checkbox" :value="o.value" :id="`${field.id}`" />
            <label :for="`${field.id}`">{{ o.label }}</label>
          </div>
        </template>
      </div>
    </BaseField>
  </template>
  <template
    v-else-if="
      ['number', 'text', 'password', 'date', 'datetime', 'phone', 'time'].includes(
        field.control
      )
    "
  >
    <BaseField :field="field">
      <input class="border px-2 py-1"
        :type="field.control === 'datetime' ? 'datetime-local' : field.control"
      />
    </BaseField>
  </template>
  <template v-else> Not supported: {{ field.control }}</template>
</template>
