// import { isRef, ref, toValue, withModifiers, type Ref } from 'vue'
// import { createInjectionState } from '@vueuse/core'
// //import { type TreeNode } from 'primevue/treefield'
// import { type Field } from '@v3technology/fields-core'

// const [useProvideLayerState, _useLayerState] = createInjectionState((fields: Ref, onImageRightClick: (event: Event, field: Field) => void) => {
//   console.log('useProvideLayerState', isRef(fields))

//   //const fields = ref(_fields)
//   const expandedKeys = ref<Record<string, any>>({})
//   const selectedKeys = ref<string[]>([])

//   let targetKey: string | undefined = ''
//   let targetIndex = 0

//   const expandNode = (field) => {
//     if (field.children && field.children.length) {
//       expandedKeys.value[field.id] = true

//       for (const child of field.children) {
//         expandNode(child)
//       }
//     }
//   }

//   const expandAll = () => {
//     for (const field of toValue(fields)) {
//       expandNode(field)
//     }
//     expandedKeys.value = { ...expandedKeys.value }
//   }

//   const collapseAll = () => {
//     expandedKeys.value = {}
//   }

//   const onDragEnter = (e: DragEvent) => {
//     e.preventDefault()
//     const el = e.target! as HTMLElement
//     if (el.classList.contains('dragging')) return
//     el.parentElement?.classList.add('hovering')
//   }

//   const onDragLeave = (e: DragEvent, field: Field, index: number) => {
//     const el = e.target! as HTMLElement
//     targetKey = field.id
//     targetIndex = index
//     el.parentElement?.classList.remove('hovering')
//   }

//   const onDragStart = (e: DragEvent) => {
//     const el = e.target! as HTMLElement
//     el.classList.add('dragging')
//   }

//   const onDragEnd = (e: DragEvent, field: Field, index: number) => {
//     const el = e.target! as HTMLElement
//     el.classList.remove('dragging')
//     moveTo(field.id, index, targetKey, targetIndex)
//   }

//   const moveTo = (sourceKey: string | undefined, sourceIndex: number, targetKey: string | undefined, targetIndex: number) => {
//     if (!sourceKey || !targetKey) return
//     const [source, sourceCollection] = findField(sourceKey)
//     const [target, targetCollection] = findField(targetKey)

//     console.log('>', { source, sourceCollection, sourceIndex }, { target, targetCollection, targetIndex })

//     if (source && target && sourceCollection && targetCollection) {
//       const item = sourceCollection?.splice(sourceIndex, 1)
//       targetCollection.splice(targetIndex, 0, item[0])
//     }
//   }

//   function findField(id: string | Field): [Field | null, Field[] | null] {
//     if (typeof id !== 'string') id = id.id

//     const find = (source: Field[]): [Field | null, Field[] | null] => {
//       if (source == null) return [null, null]
//       for (const n of source) {
//         if (n.id === id) return [n, source]
//         if (n.fields) {
//           const [item, coll] = find(n.fields)
//           if (item) return [item, coll]
//         }
//       }
//       return [null, null]
//     }
//     return find(toValue(fields))
//   }
//   console.log('END')
//   return {
//     fields,
//     findField,
//     expandedKeys,
//     selectedKeys,
//     expandAll,
//     collapseAll,
//     triggerContextMenu: (event: Event, field: Field) => {
//       console.log('triggerContextMenu', event, onImageRightClick)
//       if (onImageRightClick) onImageRightClick(event, field)
//     },
//     bindings: (field: Field, index: number) => ({
//       draggable: true,
//       onDragenter: withModifiers((e: Event) => onDragEnter(e as DragEvent), ['self']),
//       onDragleave: withModifiers((e: Event) => onDragLeave(e as DragEvent, field, index), ['self']),
//       onDragstart: withModifiers((e: Event) => onDragStart(e as DragEvent), ['self']),
//       onDragend: withModifiers((e: Event) => onDragEnd(e as DragEvent, field, index), ['self'])
//     })
//   }
// })

// export { useProvideLayerState }

// export function useLayerState() {
//   const store = _useLayerState()
//   if (store == null) throw new Error('Please call `useProvideLayerState` on the appropriate parent component')
//   return store
// }
