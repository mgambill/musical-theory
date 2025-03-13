<script setup lang="ts">
import { useEditorStoreRef } from '../store'
const { form } = useEditorStoreRef()
</script>

<template>
  <div class="bg-white p-4 border border-gray-200 rounded-lg shadow">
    <pre class="p-4 text-sm">{{ form }}</pre>
  </div>
</template>
