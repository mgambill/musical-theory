<script setup lang="ts">
import ContextMenu from 'primevue/contextmenu'
import FieldComponent from '../../FieldComponent.vue'
import { type Form, type Field } from '@v3technology/core'

type Props = {
  isEditMode: boolean
}

const form = defineModel<Form>('form', { required: true })
const { isEditMode } = defineProps<Props>()

const menu = useTemplateRef('menu')
const selectedId = ref(null)
const items = ref([
  {
    label: 'Favorite',
    icon: 'pi pi-star',
    shortcut: '⌘+D',
  },
  {
    label: 'Add',
    icon: 'pi pi-shopping-cart',
    shortcut: '⌘+A',
  },
  {
    separator: true,
  },
  {
    label: 'Share',
    icon: 'pi pi-share-alt',
    items: [
      {
        label: 'Whatsapp',
        icon: 'pi pi-whatsapp',
        badge: 2,
      },
      {
        label: 'Instagram',
        icon: 'pi pi-instagram',
        badge: 3,
      },
    ],
  },
])
const onRightClick = (event: Event, id: Field['id']) => {
  selectedId.value = id
  menu.value.show(event)
}
</script>

<template>
  <section class="flex flex-col gap-4" v-if="isEditMode">
    <template v-for="(slot, key) in form.slots" :key="key">
      <div class="grid grid-cols-[auto_1fr]">
        <menu>
          <ul>
            <p class="font-medium">Pages</p>
            <template v-for="(field, index) in slot.fields" :key="field.id">
              <li>
                <p>
                  {{ field.label?.text || `Tab ${index + 1}` }}
                </p>
                <template v-if="field.fields?.[0].control === 'section'">
                  <ul>
                    <template v-for="(f, i) in field.fields" :key="f.id">
                      <li
                        @contextmenu="onRightClick($event, f.id)"
                        class="pl-4 py-1 cursor-pointer hover:bg-zinc-200"
                      >
                        {{ f.label?.text || f.property || `Section ${i + 1}` }}
                      </li>
                    </template>
                  </ul>
                </template>
              </li>
            </template>
          </ul>
          <button class="px-4 py-2 mt-3 border border-dashed rounded w-full">Add Section</button>
        </menu>
        <article class="pl-6">
          <template v-for="(field, index) in slot.fields" :key="field.id">
            <fieldset class="border border-gray-200 p-4 mb-4">
              <legend class="px-4">
                {{ field.label?.text || `Field ${index + 1}` }}
              </legend>
              <FieldComponent :field="field" :index="index" />
            </fieldset>
          </template>
        </article>
      </div>
    </template>
  </section>
  <section class="flex flex-col gap-4" v-else>
    <template v-for="(slot, key) in form.slots" :key="key">

        <article>
          <template v-for="(field, index) in slot.fields" :key="field.id">
            <fieldset class="border border-gray-200 p-4 mb-4">
              <legend class="px-4">
                {{ field.label?.text || `Field ${index + 1}` }}
              </legend>
              <FieldComponent :field="field" :index="index" />
            </fieldset>
          </template>
        </article>

    </template>
  </section>

  <ContextMenu ref="menu" :model="items" @hide="selectedId = null">
    <template #item="{ item, props }">
      <a v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <i v-if="item.items" class="pi pi-angle-right ml-auto"></i>
      </a>
    </template>
  </ContextMenu>
</template>
