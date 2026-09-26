import { Box, Flex, Heading } from '@chakra-ui/react'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import Carousel from './Carousel'

const Gallery: React.FC = () => {
  const { text } = useStaticQuery(graphql`
    query galeriaQuery {
      text: galeriaYaml {
        title
        body
      }
    }
  `)

  return (
    <Box w="100%" mx="auto" py="1rem" boxShadow="inner" bg="white">
      <Flex direction="column" maxW="960px" className="info-link" id="galeria" mx="auto">
        <Heading m="0 1rem 1rem 1rem" textAlign="center">
          {text.title}
        </Heading>
        <Carousel />
      </Flex>
    </Box>
  )
}

export default Gallery
