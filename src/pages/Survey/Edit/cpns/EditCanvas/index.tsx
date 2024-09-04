import { FC, MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Spin } from 'antd'
import classNames from 'classnames'
import styles from './style.module.scss'
import { setComponentOrder, setSelectedComponentId } from '@/store/component/componentReducer'
import useGetSurveyDetailInfo from '@/hooks/useGetSurveyDetailInfo'
import { getComponentConfigByType } from '@/components/SurveyComponent'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Draggable from '@/components/DragComponent/Draggable'
import Droppable from '@/components/DragComponent/Droppable'

type PropTypes = {
  loading: boolean
}

const EditCanvas: FC<PropTypes> = props => {
  const { loading } = props

  const dispatch = useDispatch()

  const { componentsList, selectedComponentId } = useGetSurveyDetailInfo()

  const onComponentClick = (e: MouseEvent, id: string) => {
    e.stopPropagation()

    dispatch(setSelectedComponentId(id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (!over) return

    const currentId = active.id
    const previousId = over.id

    const index1 = componentsList.findIndex(item => item.id === currentId)
    const index2 = componentsList.findIndex(item => item.id === previousId)

    if (index1 === -1 || index2 === -1) return

    dispatch(setComponentOrder({ index1, index2 }))
  }

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin></Spin>
        </div>
      ) : (
        <div className={styles['canvas-container']}>
          <DndContext onDragEnd={handleDragEnd}>
            {componentsList.map(item => {
              const { id, componentType, props, isLock, isHide } = item

              const { Component } = getComponentConfigByType(componentType)

              return (
                !isHide && (
                  <Draggable key={id} id={id}>
                    <Droppable id={id}>
                      <div
                        className={classNames({
                          [`${styles['canvas-row']}`]: true,
                          [`${styles.selected}`]: id === selectedComponentId,
                          [`${styles.lock}`]: isLock,
                        })}
                        onClick={e => onComponentClick(e, id)}
                      >
                        <div className={styles['canvas-item']}>
                          <Component {...props}></Component>
                        </div>
                      </div>
                    </Droppable>
                  </Draggable>
                )
              )
            })}
          </DndContext>
        </div>
      )}
    </>
  )
}

export default EditCanvas
