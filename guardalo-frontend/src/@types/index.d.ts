// Modules
declare module '*.inline.svg' {
  import * as React from 'react'
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.svg'
declare module '*.jpg'
declare module '*.png'
declare module '*.json'
declare module '*.mp4'

// Types
type Price = {
  key: number
  text: string
  price: number
  promo?: string
  promo_long?: string
}
