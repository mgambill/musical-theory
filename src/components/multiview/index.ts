//export { default as MultiView } from './MultiView.vue'
export { default as View } from './MultiViewPanel.vue'

export const MultiViewInjectionKey = Symbol('multiview') as InjectionKey<
  Omit<ReturnType<typeof setup>, 'initialize'>
>

export type View = {
  id: string
  label: string
  index: number
  active: ComputedRef<boolean>
  navigate: () => void
} & {}

export const setup = (index: MaybeRef<number> = 0) => {
  const activeIndex = toRef(index)
  const views = ref([] as View[])
  const getIndex = (key: string) => views.value.findIndex((v) => v.id === key)
  const isActive = (id: string) => getIndex(id) === toValue(activeIndex)

  const register = (options: { id: string; label: string } & {}) => {
    const active = computed(() => isActive(options.id))
    const navigate = () => {
      activeIndex.value = getIndex(options.id)
    }

    const context: View = { ...options, index: views.value.length, active: active, navigate }
    views.value.push(context)
    return context
  }
  return {
    register,
    isActive,
    activeIndex,
    views,
  }
}

export const MultiView = defineComponent({
  name: 'MultiView2',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    // Create a computed binding that works like defineModel in the SFC
    const currentIndex = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    // Use our multi-view composable with the reactive currentIndex
    //const { views, activeIndex, isActive } = useMultiView(currentIndex)
    const context = setup(currentIndex)
    provide(MultiViewInjectionKey, context)
    // Return a render function that passes our context as slot props
    return () => {
      if (!slots.default) return null
      return slots.default({
        views: toValue(context.views),
        activeIndex: toValue(context.activeIndex),
        isActive: context.isActive,
      })
    }
  },
})
