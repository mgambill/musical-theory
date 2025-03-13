<script setup lang="ts">
import { classifications } from '@v3technology/definitions'
import { getDefinitions } from '@v3technology/components'

const definitions = getDefinitions()
</script>

<template>
  <ul class="flex flex-col gap-2 p-4 mb-8">
    <template v-for="(c, key) in classifications" :key="c.label">
      <li>
        <h3 class="font-medium col-span-full mb-1">{{ c.label }}</h3>
        <ul class="grid grid-cols-[2rem_1fr] border-l px-2">
          <template
            v-for="def in definitions.filter((d) => d.controlType.classification === key)"
            :key="def.id"
          >
            <li
              class="grid grid-cols-subgrid col-span-full items-center py-1 ml-0.5"
              :class="def.component ? '' : 'opacity-50'"
            >
              <i :class="['fal fa-fw text-zinc-400', def.icon]"></i>
              <span>{{ def.label }}</span>
            </li>
          </template>
        </ul>
      </li>
    </template>
  </ul>
</template>
