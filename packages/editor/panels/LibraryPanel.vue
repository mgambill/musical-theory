<script setup lang="ts">
import { type Form } from '@v3technology/core'
import { useEditorStoreRef, useEditorStore } from '../store'

const { setCurrentForm } = useEditorStore()
const { library } = useEditorStoreRef()
const onClick = (f: Form) => {
  console.log('library panel clicked')
  setCurrentForm(f)
}
</script>

<template>
  <article class="p-4">
    <h3 class="mb-2 font-medium">Form library</h3>
    <div class="grid grid-cols-[auto_1fr] items-center gap-1">
      <template v-for="asset in library" :key="asset.id">
        <div
          class="grid grid-cols-subgrid col-span-full items-center hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
          @click="onClick(asset)"
        >
          <i class="fal fa-fw fa-file-invoice"></i>
          <div class="self-center">{{ asset.title }}</div>
        </div>
      </template>
    </div>
  </article>
</template>
