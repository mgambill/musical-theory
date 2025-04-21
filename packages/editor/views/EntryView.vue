<script setup lang="ts">
import { DISPLAY_MODES, useFormState } from '~/components'
import { useEditorStoreRef } from '../store'
import { FormComponent } from '~/components'
//import FormComponent from '../../form/FormComponent.vue'
//import FieldComponent  from '../../FieldComponent.vue'

const { form, datasource } = useEditorStoreRef()
useFormState(form, datasource, DISPLAY_MODES.entry)
</script>

<template>
  <FormComponent :form :datasource="datasource" key="live-view" />
</template>
