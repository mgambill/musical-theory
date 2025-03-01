<script setup lang="ts">
import { MultiView, View } from './components/multiview'
const index = ref(1)
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <MultiView v-model="index" v-slot="{ views }">
    <View label="First" icon="fa-cloud">Firs</View>
    <View label="Second" icon="fa-bolt">Second</View>
    <View label="Third">Third</View>
    <View label="Forth">Forth</View>
    <ul class="flex border-t-2">
      <template v-for="v in views" :key="v.id">
        <li
          :class="[
            'py-2 px-4 -my-[2px] flex gap-2 items-center border-t-2 cursor-pointer hover:text-cyan-700',
            v.active ? 'bg-cyan-50 text-cyan-800 border-t-cyan-800' : '',
          ]"
          @click="() => v.navigate()"
        >
        <i v-if="'icon' in v" :class="['fa fa-fw', v.icon ]"></i>
        <span>
          {{ v.label }}
        </span>
        </li>
      </template>
    </ul>
  </MultiView>
</template>
