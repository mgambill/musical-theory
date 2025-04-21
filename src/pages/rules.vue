<script setup lang="ts">
import legalForm from '../forms/legal'
import { processForm, type Field, type Form } from '@v3technology/core'
import { useFormState, DISPLAY_MODES } from '~/components/composables/useFormState'
import { View, MultiView } from '@/components/multiview'
import { FieldComponent } from '~/components/fields'

import { ConditionRunner, conditionRunnerDefinitions, type Action, type Rule } from '~/rule-engine'
import { isAlertAction, isStateAction, isRedirectAction } from '@/types'
import { useToast } from 'primevue/usetoast'
import { useEditorStore } from '~/editor'
import { useWizard } from '@/useWizard'

const toast = useToast()
const form = ref(legalForm as unknown as Form & { rules: Rule[] })
const enableValidation = ref(false)
const editorStore = useEditorStore()
editorStore.setMode('entry')

const { datasource, mode } = useFormState(form, {}, 'entry')
const runner = new ConditionRunner(conditionRunnerDefinitions)
const handleAction = (a: Action, options?: { invert: boolean }) => {
  options = Object.assign({ invert: false }, options)
  if (isAlertAction(a)) {
    toast.add({
      severity: a.severity ?? 'error',
      summary: a.summary,
      detail: a.message,
      life: a.life,
    })
  }
  if (isStateAction(a)) {
    processForm(form.value, (f) => {
      if (a.ids.includes(f.id) || (f.property && a.ids.includes(f.property))) {
        const field = f as Field
        if (options.invert) {
          field.disabled = a.value !== 'disabled'
        } else {
          field.disabled = a.value === 'disabled'
        }
      }
    })
  }
  if (isRedirectAction(a)) {
  }
}
const result = ref()

const {
  currentChapter,
  chapterIndex,

  pageIndex,
  hasNextChapter,
  hasPreviousChapter,
  hasNextPage,
  hasPreviousPage,
  goBack,
  goNext,
  onNavigate,
} = useWizard(form)

watch(
  () => datasource,
  (v) => {
    if (!enableValidation.value) return
    const { rules } = form.value
    const temp = runner.evaluate(toValue(v), ...rules)

    temp.forEach((r) => {
      if (r.result === false && r.source.trigger === 'immediate') {
        r.source.actions.forEach((a) => handleAction(a, { invert: true }))
      }
    })
    const matchedRules = temp.filter((r) => r.result)
    if (matchedRules.length) {
      // matched rules
      matchedRules
        .filter((r) => r.source.trigger === 'immediate')
        .forEach((r) => {
          r.source.actions.forEach((a) => handleAction(a))
        })
    }

    result.value = temp
  },
  { deep: true, immediate: true },
)

onNavigate(() => {
  if (!enableValidation.value) return true
  const { rules } = form.value
  const temp = runner.evaluate(toValue(datasource), ...rules)
  let cont = true
  temp.forEach((r) => {
    if (r.result !== false && r.source.trigger === 'milestone') {
      r.source.actions.forEach((a) => handleAction(a, { invert: true }))
      cont = false
    }
  })

  return cont
})

const showExitScreen = ref(false)
</script>

<template>
  <div class="h-screen">
    <!-- <FormField :form="form" v-model="datasource" /> -->
    <!--  -->
    <div class="grid grid-cols-[auto_1fr] gap-8 p-4 h-full">
      <div class="bg-zinc-100 p-4">
        <ul>
          <template v-for="f in form.slots.default.fields" :key="f.id">
            <li :class="[f.disabled && 'opacity-30', 'pb-4']">
              <div>{{ f.label?.text }}</div>
              <template v-if="f.fields && f.fields?.length > 1">
                <ol class="list-decimal list-inside ml-4">
                  <template v-for="c in f.fields" :key="c.id">
                    <li class="pb-2">
                      {{ c.label?.text ?? c.property ?? c.id }}
                    </li>
                  </template>
                </ol>
              </template>
            </li>
          </template>
        </ul>
        <hr class="my-8" />
        <div>
          <input id="enableValidation" type="checkbox" v-model="enableValidation" />
          <label for="enableValidation" class="ml-2"> Enable Validation </label>
        </div>
        <ul>
          <template v-for="r in result" :key="r.source.label">
            <li>{{ r.source.label }} - {{ r.result ?? 'N/A' }}</li>
          </template>
        </ul>
      </div>
      <KeepAlive
        ><template v-if="showExitScreen">
          <div></div>
        </template>
        <template v-else>
          <MultiView v-model="chapterIndex">
            <div
              class="p-4 rounded border border-zinc-300 min-w-96 grid grid-rows-[auto_1fr_auto] gap-4 relative"
            >
              <div class="absolute right-4 top-4 bg-zinc-100 px-2 text-sm">
                <select v-model="mode" class="bg-zinc-100 py-2 px-4 rounded">
                  <option :value="DISPLAY_MODES.entry">Entry</option>
                  <option :value="DISPLAY_MODES.response">Read</option>
                </select>
              </div>
              <header>
                <h3 class="text-xl font-light mb-2">{{ currentChapter.label }}</h3>
                <div class="flex gap-4">
                  <template v-for="(page, index) in currentChapter.fields" :key="page.id">
                    <div
                      :class="[index === pageIndex ? 'bg-cyan-400' : 'bg-zinc-600', 'h-1 w-20']"
                    ></div>
                  </template>
                </div>
              </header>
              <main>
                <template v-for="f in form.slots.default.fields" :key="f.id">
                  <div>
                    <View :label="f.label?.text!" :id="f.id">
                      <MultiView v-model="pageIndex">
                        <template v-for="c in f.fields" :key="c.id">
                          <View :id="c.id">
                            <FieldComponent :field="c" :datasource />
                          </View>
                        </template>
                      </MultiView>
                    </View>
                  </div>
                </template>
              </main>
              <footer class="flex justify-between mt-4">
                <button
                  @click="goBack"
                  :disabled="!(hasPreviousChapter || hasPreviousPage)"
                  class="disabled:opacity-30 bg-cyan-400 w-20 py-1 text-white rounded-sm"
                >
                  <i class="fa fa-chevron-left"></i>
                </button>
                <button
                  @click="goNext"
                  :disabled="!(hasNextChapter || hasNextPage)"
                  class="disabled:opacity-30 bg-cyan-400 w-20 py-1 text-white rounded-sm"
                >
                  <i class="fa fa-chevron-right"></i>
                </button>
              </footer>
              <pre>{{ datasource }}</pre>
            </div>
          </MultiView>
        </template>
      </KeepAlive>
    </div>
  </div>
</template>
