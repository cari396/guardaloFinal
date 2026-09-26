import React from 'react'
import { PageProps } from 'gatsby'

import SEO from '../components/Seo'
import Hero from '../components/Hero'
import Info from '../components/Info'
import Gallery from '../components/Gallery'
import Location from '../components/Location'

const IndexPage: React.FC<PageProps> = () => (
  <>
    <SEO title="Inicio" />
    <Hero />
    <Info />
    <Gallery />
    <Location />
  </>
)

export default IndexPage
