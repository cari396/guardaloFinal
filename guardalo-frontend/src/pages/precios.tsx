import React from 'react'
import { graphql, PageProps } from 'gatsby'
import { Flex, Heading, Text } from '@chakra-ui/react'

import SEO from '../components/Seo'
import HeaderBox from '../components/HeaderBox'
import PriceList from '../components/PriceList'
import PriceList2 from '../components/PriceList2'
import PriceList3 from '../components/PriceList3'


type PreciosPageData = {
  data: {
    p: {
      title: string
      body: string
      prices: Price[]
    }
  }
}

const PreciosPage: React.FC<PageProps & PreciosPageData> = ({ data }) => {
  const { title, body } = data.p

  return (
    <>
      <SEO title="Precios" />
      <HeaderBox />
      <Flex
        direction="column"
        wrap="nowrap"
        w={['100%', '500px', '960px']}
        py="1rem"
        mx="auto"
        justifyContent="stretch"
        alignItems="stretch"
      >
        <Heading textStyle="sectionTitle">{title}</Heading>

        <Text fontSize="1.5rem" px="2rem" mb="2rem" textAlign="center">
          {body}
        </Text>
        <Text
        textAlign="center"
        fontSize="1.5rem"
        fontWeight="bold"
        marginBottom="1.5rem">
          Tamaño pequeño: 8.3m² (1.66x5m)</Text>
        <PriceList />
        <Text
        textAlign="center"
        fontSize="1.5rem"
        fontWeight="bold"
        marginBottom="1rem">
          Tamaño mediano: 13.75m² (2.75x5m)</Text>
        <PriceList2/>
        <Text
        textAlign="center"
        fontSize="1.5rem"
        fontWeight="bold"
        marginBottom="1rem">
          Tamaño grande: 20.5m² (4.10x5m)</Text>
        <PriceList3/>
      </Flex>
    </>
  )
}

export const query = graphql`
  query preciosPageQuery {
    p: preciosYaml {
      title
      body
    }
  }
`

export default PreciosPage
