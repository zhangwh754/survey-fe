import { ChangeEvent, FC, MouseEvent, useState } from 'react'
import { Button, Input, Space, Tabs, TabsProps, Typography } from 'antd'
import { useDispatch } from 'react-redux'
import {
  BarsOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MenuOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import {
  ComponentConfigType,
  componentListSortByType,
  ComponentPropsType,
} from '@/components/SurveyComponent'
import styles from './style.module.scss'
import {
  ComponentType,
  setAppendNewComponent,
  setComponentHideStatus,
  setComponentLockStatus,
  setComponentOrder,
  setComponentTitle,
  setSelectedComponentId,
} from '@/store/component/componentReducer'
import { nanoid } from 'nanoid'
import useGetSurveyDetailInfo from '@/hooks/useGetSurveyDetailInfo'
import classNames from 'classnames'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Draggable from '@/components/DragComponent/Draggable'
import Droppable from '@/components/DragComponent/Droppable'

type PropTypes = {}

const { Title } = Typography

// 组件库
const DisplayComponentList: FC = () => {
  const dispatch = useDispatch()

  const onAppendNewComponent = (component: ComponentConfigType<ComponentPropsType>) => {
    dispatch(
      setAppendNewComponent({
        id: nanoid(),
        title: component.title,
        componentType: component.type,
        props: component.defaultProps,
      })
    )
  }

  return componentListSortByType.map(t => {
    return (
      <div key={t.id}>
        <Title level={3} style={{ fontSize: '16px' }}>
          {t.title}
        </Title>

        {t.components.map(c => {
          const { Component, defaultProps, type } = c as ComponentConfigType<ComponentPropsType>

          return (
            <div
              key={type}
              className={styles['canvas-row']}
              onClick={() => onAppendNewComponent(c as ComponentConfigType<ComponentPropsType>)}
            >
              <div className={styles['canvas-item']}>
                <Component {...defaultProps}></Component>
              </div>
            </div>
          )
        })}
      </div>
    )
  })
}

// 图层组件配置
const ConfigComponentList: FC<{ componentsList: ComponentType[]; selectedComponentId: string }> = ({
  componentsList,
  selectedComponentId,
}) => {
  const dispatch = useDispatch()

  const onToggleLock = (e: MouseEvent, id: string, isLock: boolean) => {
    e.stopPropagation()

    dispatch(setComponentLockStatus({ id, isLock }))
  }

  const onToggleHide = (e: MouseEvent, id: string, isHide: boolean) => {
    e.stopPropagation()

    dispatch(setComponentHideStatus({ id, isHide }))
  }

  const [updateComponentId, setUpdateComponentId] = useState<string | null>(null)

  const onTitleEdit = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const title = e.target.value

    dispatch(setComponentTitle({ id, title }))
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
    <DndContext onDragEnd={handleDragEnd}>
      {componentsList.map(item => {
        const { id, title, isLock, isHide } = item

        const isActive = selectedComponentId === id

        return (
          <Draggable key={id} id={id}>
            <Droppable id={id}>
              <div
                className={classNames({
                  [styles['component-row']]: true,
                  [styles['active']]: isActive,
                })}
                onClick={() => dispatch(setSelectedComponentId(id))}
              >
                <div className={styles['component-name']} onClick={() => setUpdateComponentId(id)}>
                  {id === updateComponentId ? (
                    <Input
                      value={title}
                      autoFocus
                      onChange={e => onTitleEdit(e, id)}
                      onPressEnter={() => setUpdateComponentId(null)}
                      onBlur={() => setUpdateComponentId(null)}
                    />
                  ) : (
                    title
                  )}
                </div>
                <div className={styles['component-buttons']}>
                  <Space>
                    <Button
                      shape="circle"
                      size="small"
                      icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
                      onClick={e => onToggleLock(e, id, !isLock)}
                    />
                    <Button
                      shape="circle"
                      size="small"
                      icon={isHide ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      onClick={e => onToggleHide(e, id, !isHide)}
                    />
                  </Space>
                </div>
              </div>
            </Droppable>
          </Draggable>
        )
      })}
    </DndContext>
  )
}

const SurveyComponentList: FC<PropTypes> = () => {
  const { componentsList, selectedComponentId } = useGetSurveyDetailInfo()

  const items: TabsProps['items'] = [
    {
      key: 'propsConfig',
      label: (
        <Space>
          <BarsOutlined />
          组件库
        </Space>
      ),
      children: <DisplayComponentList />,
    },
    {
      key: 'pageConfig',
      label: (
        <Space>
          <MenuOutlined />
          图层
        </Space>
      ),
      children: (
        <ConfigComponentList
          componentsList={componentsList}
          selectedComponentId={selectedComponentId}
        />
      ),
    },
  ]

  return (
    <>
      <Tabs defaultActiveKey="propsConfig" items={items} />
    </>
  )
}

export default SurveyComponentList
