import { FC, ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'

type PropTypes = {
  id: string | number
  children: ReactNode
}

const Droppable: FC<PropTypes> = props => {
  const { setNodeRef } = useDroppable({
    // const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })

  return <div ref={setNodeRef}>{props.children}</div>
}

export default Droppable
