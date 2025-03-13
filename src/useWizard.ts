import { ref, computed, toValue, type MaybeRef } from 'vue'
import { createEventHook } from '@vueuse/core'

export type Chapter = {
  id: string
  property?: string
  label?: string
  disabled: boolean
  fields?: Omit<Chapter, 'fields'>[]
}

export const useWizard = (form: MaybeRef) => {
  const chapterIndex = ref(0)
  const pageIndex = ref(0)

  const pages = ref([])

  const chapters = computed(() => {
    const arr: Chapter[] = []
    toValue(form).slots.default?.fields.forEach((f) => {
      if (f.control === 'container') {
        arr.push({
          id: f.id,
          property: f.property,
          disabled: f.disabled,
          label: f.label?.text,
          fields: f.fields?.map((c) => ({ id: c.id, property: c.property, disabled: c.disabled })),
        })
      }
    })
    return arr
  })

  const hasNextChapter = computed(() => {
    return chapterIndex.value < chapters.value.filter((x) => !x.disabled).length - 1
  })

  const hasPreviousChapter = computed(() => {
    return chapterIndex.value > 0
  })

  const hasNextPage = computed(() => {
    if (!currentChapter.value.fields) return false
    return pageIndex.value < currentChapter.value.fields?.length - 1
  })

  const hasPreviousPage = computed(() => {
    return pageIndex.value > 0
  })

  const currentChapter = computed(() => chapters.value[chapterIndex.value])

  const navigate = createEventHook<boolean>()

  const goBack = async () => {
    const [cont] = await navigate.trigger()
    
    if (hasPreviousPage.value) {
      pageIndex.value -= 1
    } else if (hasPreviousChapter.value) {
      move(-1)
      if (currentChapter.value.fields) pageIndex.value = currentChapter.value.fields?.length - 1
    }
  }

  const goNext = async () => {
    const [cont] = await navigate.trigger()
    if (!cont) return
    if (hasNextPage.value) {
      pageIndex.value += 1
    } else if (hasNextChapter.value) {
      move(1)
      pageIndex.value = 0
    }
  }

  const move = (direction: number) => {
    let index = chapterIndex.value

    do {
      index = index + direction
    } while (chapters.value[index].disabled)

    chapterIndex.value = index
  }

  return {
    chapters,
    pages,
    chapterIndex,
    currentChapter,
    pageIndex,
    hasNextPage,
    hasPreviousPage,
    hasNextChapter,
    hasPreviousChapter,
    onNavigate: navigate.on,
    goBack,
    goNext,

    previousButton: {
      onClick: goBack,
      disabled: computed(() =>
        hasPreviousChapter.value || hasPreviousPage.value ? undefined : false,
      ),
    },

    nextButton: {
      onClick: goNext,
      disabled: computed(() => !(hasNextChapter.value || hasNextPage.value)),
    },
  }
}
