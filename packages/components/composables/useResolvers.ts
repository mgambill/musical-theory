import { type App, type InjectionKey, type MaybeRef, inject, toValue } from 'vue'
import type { ComponentDefinition } from '../types'
import type { Field } from '@v3technology/core'

export const componentResolverKey: InjectionKey<ReturnType<typeof useComponentResolver>> =
  Symbol('components-ui')

export const registerComponents = (app: App, definitions: ComponentDefinition[]) => {
  const context = useComponentResolver(definitions)
  app.provide(componentResolverKey, context)
  app.config.globalProperties.$findDefinitionById = context.findDefinitionById
}

function useComponentResolver(
  definitions: ComponentDefinition[] /*, fallbackComponent?: Component | DefineComponent*/,
) {
  const definitionMap = new Map(definitions.map((c) => [c.id, c]))

  const findDefinitionById = (value?: MaybeRef<Field['control'] | ComponentDefinition>) => {
    if (value === undefined) return
    const v = toValue(value)
    const id = isComponentDefinition(v) ? v.id : v
    const result = definitionMap.get(id)
    return result
  }

  return {
    definitions,
    findDefinitionById,
    resolveComponentDefinition: (id?: Field['control']) => {
      return findDefinitionById(id)
    },
    resolveComponent: (id?: Field['control']) => {
      return findDefinitionById(id)?.component
    },
    getDefinitions: (withComponents: boolean = false) => {
      const source = useComponentContext()
      return withComponents ? source.definitions.filter((d) => d.component) : source.definitions
    },
  }
}

function isComponentDefinition(value: unknown): value is ComponentDefinition {
  return value !== null && typeof value === 'object' && 'id' in value
}

export function useComponentContext() {
  const resolver = inject(componentResolverKey)
  if (!resolver) {
    console.error(
      'useComponentContext: componentResolverKey not found in the current context.',
      componentResolverKey,
    )
    throw new Error(
      'useComponentContext is not setup correctly. Ensure useComponentRegistry is installed.',
    )
  }
  return resolver
}
