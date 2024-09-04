import { ComponentState } from './componentReducer'

/**
 * @description: 选中列表下一个未被隐藏的组件
 * @param {ComponentState} state
 */
export function getNextSelectComponentId(state: ComponentState, id: string) {
  const { componentsList } = state

  const index = componentsList.findIndex(i => i.id === id)

  if (index < 0) return ''

  if (componentsList.length === 1) return ''

  for (let i = index; i < componentsList.length; i++) {
    if (!componentsList[i].isHide) {
      return componentsList[i].id
    }
  }

  return ''
}

/**
 * @description: 交换数组内容
 * @param {any} array
 * @param {number} index1
 * @param {number} index2
 */
export function swapArrayElements(array: any[], index1: number, index2: number) {
  const temp = array[index1]
  array[index1] = array[index2]
  array[index2] = temp
}
