import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Box, Heading, Text } from '@chakra-ui/react'
import ContactItems from './ContactItems'

type QueryTypes = {
  data: {
    title: string
    contactText: string
    formText: string
  }
}

const ContactHeader: React.FC = () => {
  const { data } = useStaticQuery<QueryTypes>(graphql`
    query ContactFormQuery {
      data: contactoYaml {
        title
        contactText
        formText
      }
    }
  `)
  return (
    <>
      <Box maxW="670px" mx="auto" textAlign="center">
        <Heading textStyle="sectionTitle">{data.title}</Heading>
        <Text fontSize="lg" px="2rem" mb="2rem">
          {data.contactText}
        </Text>
      </Box>
      <ContactItems
        display="flex"
        flexDirection={['column', 'row', 'row']}
        justifyContent="center"
        alignItems="center"
        layerStyle="innerPrimaryBG"
        itemProps={{ m: '0 2rem 0 0', _first: { mb: ['2rem', '0', '0'] } }}
      />
      <Box maxW="670px" mx="auto" textAlign="center" py="2rem">
        <Text fontSize="lg" px="2rem">
          {data.formText}
        </Text>
      </Box>
    </>
  )
}

export default ContactHeader
