<script setup lang="ts">
//import Primevue from 'primevue';
type Props = { defaultText?: string }
const { defaultText = 'Click to edit ...' } = defineProps<Props>()
// const emits = defineEmits<{ click:[] }>()
const value = defineModel<string | null>()
</script>

<template>
  <span class="$attr.class">{{ value || defaultText }}</span>
  <!-- <Primevue.Inplace>
    <template #display>
      <span class="$attr.class">{{ value || defaultText }}</span>
    </template>
    <template #content="{ closeCallback }">
      <span class="inline-flex items-center gap-2">
        <InputText v-model="value" autofocus />
        <Button icon="fa fa-fw fa-check" text severity="success" @click="closeCallback" />
      </span>
    </template>
  </Primevue.Inplace> -->
</template>
