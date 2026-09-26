import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { graphql, useStaticQuery } from 'gatsby'
import { MdLocationOn } from 'react-icons/md'
import React from 'react'

import Map from './Map'

const Location: React.FC = (): JSX.Element => {
  const { text } = useStaticQuery(graphql`
    query ubicacionQuery {
      text: ubicacionYaml {
        title
        body
        location
      }
    }
  `)

  const { title, body, location } = text

  return (
    <Box as="section" w="100%" id="ubicacion" className="info-link">
      <Flex
        maxW="960px"
        mx="auto"
        direction="column"
        wrap="nowrap"
        textAlign="center"
        id="ubicacion"
      >
        <Heading m="0 2rem 1rem 2rem">{title}</Heading>
        <Text m="0 2rem 1rem 2rem">{body}</Text>
      </Flex>
      <Box layerStyle="innerPrimaryBG">
        <Flex mx="auto" alignItems="center" w="fit-content">
          <MdLocationOn size="2em" color="white" />
          <Text m="0 0 0 0.5rem" color="white">
            {location}
          </Text>
        </Flex>
      </Box>
      <Box maxW="960px" mx="auto" py="2rem">
        <Map />
      </Box>
    </Box>
  )
}

export default Location
