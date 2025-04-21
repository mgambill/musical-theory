<script setup lang="ts">
import { DISPLAY_MODES, useFormState } from '~/components'

import { useEditorStoreRef } from '../store'
import { FormComponent } from '~/components'

const { form, datasource } = useEditorStoreRef()
useFormState(form, datasource, DISPLAY_MODES.response)
</script>

<template>
  <FormComponent :form :datasource="datasource" key="response-view" />
</template>
