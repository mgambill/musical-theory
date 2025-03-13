import { type InjectionKey, type MaybeRef, inject, toValue } from 'vue'
import type { ComponentDefinition } from '~/types'
import type { Field } from '@v3technology/core'

export const componentResolverKey: InjectionKey<ReturnType<typeof useComponentResolver>> = Symbol()

export function useComponentResolver(
  definitions: ComponentDefinition[] /*, fallbackComponent?: Component | DefineComponent*/,
) {
  const definitionMap = new Map(definitions.map((c) => [c.id, c]))
  //console.log('definitionMap', definitionMap)
  const findDefinitionById = (value: MaybeRef<Field['control'] | ComponentDefinition>) => {
    const v = toValue(value)
    const id = isComponentDefinition(v) ? v.id : v
    const result = definitionMap.get(id)
    return result
  }

  return { definitions, findDefinitionById }
}

function isComponentDefinition(value: any): value is ComponentDefinition {
  return typeof value === 'object' && 'id' in value
}

export function useComponentLookup() {
  const resolver = inject(componentResolverKey)
  if (!resolver)
    throw new Error(
      'useComponentLookup is not setup correctly. Ensure useComponentRegistry is installed.',
    )
  return resolver
}

export function resolveComponentDefinition(id?: Field['control']) {
  if (id === undefined) return
  return useComponentLookup().findDefinitionById(id)
}

export function resolveComponent(id: Field['control']) {
  return useComponentLookup().findDefinitionById(id)?.component
}

export function getDefinitions(withComponents: boolean = false) {
  const source = useComponentLookup()
  return withComponents ? source.definitions.filter((d) => d.component) : source.definitions
}
