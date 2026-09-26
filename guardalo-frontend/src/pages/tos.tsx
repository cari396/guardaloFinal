import React from 'react'
import { PageProps } from 'gatsby'

import SEO from '../components/Seo'
import HeaderBox from '../components/HeaderBox'
import TosText from '../components/TosText'

const FaqPage: React.FC<PageProps> = () => {
  return (
    <>
      <SEO title="Términos y Condiciones de Servicio" />
      <HeaderBox />
      <TosText />
    </>
  )
}

export default FaqPage
