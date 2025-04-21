import type { App } from 'vue'
import type { ComponentDefinition } from './types'
import { controls } from './controls'
import { registerComponents } from './composables/useResolvers'
import ValueComponent from './fields/ValueComponent.vue'
import { type Pinia, getActivePinia } from 'pinia'

export const useComponentRegistry = {
  install(
    app: App,
    { definitionsResolver, idResolver, registerPrimeVue = false }: ComponentRegistryOption = {},
  ) {
    if (getActivePinia() === undefined)
      throw new Error('Pinia is required for v3technology ComponentPlugin')

    if (registerPrimeVue) {
      console.warn('PrimeVue registered with v3technology ComponentPlugin')
    } else console.warn('PrimeVue registration is omitted')

    app.component('ValueComponent', ValueComponent)

    // if not provided default to all controls
    definitionsResolver ??= (c) => c

    const definitions = definitionsResolver(controls)
    idResolver ??= () => crypto.randomUUID()

    registerComponents(app, definitions)
  },
}

export default useComponentRegistry

export type ComponentRegistryOption = {
  definitionsResolver?: (input: ComponentDefinition[]) => ComponentDefinition[]
  idResolver?: () => string | number
  registerPrimeVue?: boolean
  pinia?: Pinia
}
