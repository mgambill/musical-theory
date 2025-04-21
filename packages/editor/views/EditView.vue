<script setup lang="ts">
import { useEditorStoreRef } from '../store'
import { DISPLAY_MODES, useFormState } from '~/components'
import { FormComponent } from '~/components'

const { form, datasource } = useEditorStoreRef()
useFormState(form, datasource, DISPLAY_MODES.edit)
</script>

<template>
  <FormComponent v-model:form="form" v-model:datasource="datasource" key="edit-view" />
</template>
