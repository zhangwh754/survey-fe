import { FC, ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/core'

type PropTypes = {
  id: string | number
  children: ReactNode
  style?: object
}

const Draggable: FC<PropTypes> = props => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'initial',
  }

  return (
    <div ref={setNodeRef} style={{ ...style, ...props.style }} {...listeners} {...attributes}>
      {props.children}
    </div>
  )
}

export default Draggable
