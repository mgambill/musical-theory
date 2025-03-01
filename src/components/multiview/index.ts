export { default as MultiView } from './MultiView.vue'
export { default as View } from './MultiViewPanel.vue'

export const MultiViewInjectionKey = Symbol() as InjectionKey<
  Omit<ReturnType<typeof setup>, 'initialize'>
>

export type View = {
  id: string;
  label: string;
  index: number
  active: ComputedRef<boolean>,
  navigate: ()=>void
} & {}

export const setup = (index: MaybeRef<number> = 0) => {
  const activeIndex = toRef(index)
  const views = ref([] as View[])
  const getIndex = (key: string) => views.value.findIndex((v) => v.id === key)
  const isActive = (id: string) => getIndex(id) === toValue(activeIndex)

  const register = (options: { id: string; label: string } & {}) => {
    const active = computed(() => isActive(options.id))
    const navigate= () => {
      activeIndex.value = getIndex(options.id)
    }

    const context:View = { ...options, index: views.value.length, active, navigate }
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

export const useMultiView = (index: MaybeRef<number> = 0) => {
  const context = setup(index)
  provide(MultiViewInjectionKey, context)
  return { activeIndex: context.activeIndex, isActive: context.isActive, views: context.views }
}
