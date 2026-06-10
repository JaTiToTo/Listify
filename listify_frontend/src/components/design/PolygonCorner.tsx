import React from 'react'
import imgPolygonCorner from '../../assets/svgs/polygonCorner.svg'

type Props = {
  className?: string
}

export default function PolygonCorner({ className = '' }: Props) {
  return (
    <div className={className}>
      <img alt="" className="absolute block inset-0 max-w-none size-full object-contain" src={imgPolygonCorner} />
    </div>
  )
}
