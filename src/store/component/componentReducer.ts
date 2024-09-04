import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash-es'
import { ComponentPropsType } from '@/components/SurveyComponent'
import { getNextSelectComponentId, swapArrayElements } from './utils'
import { nanoid } from 'nanoid'

export type ComponentType = {
  id: string
  title: string
  componentType: string
  isLock?: boolean
  isHide?: boolean
  props: ComponentPropsType
}

export interface ComponentState {
  selectedComponentId: string
  componentsList: ComponentType[]
  copiedComponentData: null | ComponentType
}

const initialState: ComponentState = {
  selectedComponentId: '',
  componentsList: [],
  copiedComponentData: null,
}

export const componentSlice = createSlice({
  name: 'component',
  initialState,
  reducers: {
    setComponentsStateReducer: (_state: ComponentState, action: PayloadAction<ComponentState>) => {
      return action.payload
    },
    setSelectedComponentId: (state: ComponentState, action: PayloadAction<string>) => {
      return { ...state, selectedComponentId: action.payload }
    },
    setSelectedComponentProps: (
      state: ComponentState,
      action: PayloadAction<{ props: ComponentPropsType; id: string }>
    ) => {
      return {
        ...state,
        componentsList: state.componentsList.map(c => {
          if (c.id === action.payload.id) {
            return { ...c, props: { ...c.props, ...action.payload.props } }
          }
          return c
        }),
      }
    },
    setAppendNewComponent: (state: ComponentState, action: PayloadAction<ComponentType>) => {
      const { selectedComponentId } = state

      const randomId = Math.random().toString(32).slice(4, 7)

      if (!selectedComponentId) {
        return {
          ...state,
          componentsList: state.componentsList.concat({
            ...action.payload,
            title: action.payload.title + randomId,
          }),
        }
      }

      const index = state.componentsList.findIndex(c => c.id === selectedComponentId)

      if (index < 0) {
        return {
          ...state,
          componentsList: state.componentsList.concat({
            ...action.payload,
            title: action.payload.title + randomId,
          }),
        }
      }

      const newComponentsList = [...state.componentsList]

      newComponentsList.splice(index + 1, 0, {
        ...action.payload,
        title: action.payload.title + randomId,
      })

      return { ...state, componentsList: newComponentsList }
    },
    setComponentLockStatus: (
      state: ComponentState,
      action: PayloadAction<{ id: string; isLock: boolean }>
    ) => {
      const component = state.componentsList.find(item => item.id === action.payload.id)

      if (!component) return

      component.isLock = action.payload.isLock
    },
    setComponentHideStatus: (
      state: ComponentState,
      action: PayloadAction<{ id: string; isHide: boolean }>
    ) => {
      const component = state.componentsList.find(item => item.id === action.payload.id)

      if (!component) return

      component.isHide = action.payload.isHide

      const newSelectComponentId = getNextSelectComponentId(state, action.payload.id)

      state.selectedComponentId = newSelectComponentId
    },
    setComponentDelete: (state: ComponentState) => {
      const { selectedComponentId, componentsList } = state

      const index = componentsList.findIndex(item => item.id === selectedComponentId)

      if (index < 0) return

      // 先隐藏方便获取下一个组件的id
      componentsList[index].isHide = true

      const newSelectComponentId = getNextSelectComponentId(state, selectedComponentId)

      state.selectedComponentId = newSelectComponentId

      componentsList.splice(index, 1)
    },
    setComponentCopy: (state: ComponentState) => {
      const { selectedComponentId, componentsList } = state

      const selectComponent = componentsList.find(item => item.id === selectedComponentId)

      if (!selectComponent) return

      state.copiedComponentData = selectComponent
    },
    setComponentPaste: (state: ComponentState) => {
      const { selectedComponentId, componentsList, copiedComponentData } = state

      if (!copiedComponentData) return

      const _component = cloneDeep(copiedComponentData)

      _component.id = nanoid()

      if (!selectedComponentId) {
        componentsList.push(_component)
      }

      const index = componentsList.findIndex(item => item.id === selectedComponentId)

      if (index < 0) return

      componentsList.splice(index + 1, 0, _component)
    },
    setComponentTitle: (
      state: ComponentState,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const component = state.componentsList.find(item => item.id === action.payload.id)

      if (!component) return

      component.title = action.payload.title
    },
    setComponentOrder: (
      state: ComponentState,
      action: PayloadAction<{ index1: number; index2: number }>
    ) => {
      const { index1, index2 } = action.payload

      swapArrayElements(state.componentsList, index1, index2)
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setComponentsStateReducer,
  setSelectedComponentId,
  setSelectedComponentProps,
  setAppendNewComponent,
  setComponentLockStatus,
  setComponentHideStatus,
  setComponentDelete,
  setComponentCopy,
  setComponentPaste,
  setComponentTitle,
  setComponentOrder,
} = componentSlice.actions

export default componentSlice.reducer
