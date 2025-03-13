<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '~/editor'

import loanForm from '../forms/loan'
import assessmentForm from '../forms/assessment'
import legalForm from '../forms/legal'
import controlsForm from '../forms/controls'
import n400Form from '../forms/sample'
import testForm from '../forms/test'

import type { Form, StringDictionary } from '@v3technology/core'

const library = [loanForm, assessmentForm, legalForm, controlsForm, n400Form, testForm] as Form[]

const handler = (e: unknown) => {
  console.log('HANDLER', e)
}
const datasource = ref({} as StringDictionary)
</script>

<template>
  <!--
  <pre>{{ { c: classifications, b: builder.definition, d: Object.entries(definitions), prop } }}</pre>
  -->

  <div class="h-screen relative bg-slate-50 flex" v-if="library">
    <details class="fixed right-4 z-30 top-4 p-4 bg-yellow-50 text-sm opacity-30 hover:opacity-100">
      <summary class="w-96">DataSource</summary>
      <pre>{{ datasource }}</pre>
    </details>
    <Editor
      initialMode="edit"
      v-model:form="library[3]"
      v-model:library="library"
      @on="handler"
      v-model:datasource="datasource"
    />
  </div>
</template>
