<script setup lang="ts">
import { Field } from "../shared";
import Wrapper from "./Wrapper.vue";
type Props = { field: Field };
const { field } = defineProps<Props>();
// const emits = defineEmits<{ click:[] }>()
</script>

<template>
  <Wrapper :field="field">
    <div class="flex flex-col gap-0.5">
      <label class="block">{{ field.label?.text }}</label>
      <slot />
    </div>
  </Wrapper>
</template>
