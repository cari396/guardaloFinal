import React from 'react'

import { graphql, useStaticQuery } from 'gatsby'
import { Box, Flex, Heading, HeadingProps } from '@chakra-ui/react'

type QueryTypes = {
  text: {
    edges: Array<{ node: { html: string } }>
  }
}

type TosTextProps = {
  titleProps?: HeadingProps
}

const TosText: React.FC<TosTextProps> = ({ titleProps }) => {
  const { text } = useStaticQuery<QueryTypes>(graphql`
    query Tos {
      text: allMarkdownRemark(filter: { frontmatter: { title: { eq: "tos" } } }) {
        edges {
          node {
            id
            html
          }
        }
      }
    }
  `)

  return (
    <Flex direction="column" wrap="nowrap" maxW="960px" py="1rem" mx="auto" color="text">
      <Heading textStyle="sectionTitle" {...titleProps}>
        Términos y Condiciones de Servicio
      </Heading>
      <Box
        sx={{
          color: 'text',
          ol: {
            li: {
              mb: '1rem',
              '& p': {
                mb: '1rem',
              },
              '& p:first-of-type': {
                fontWeight: 'bold',
              },
              '& ol': {
                pl: '1rem',
                listStyleType: 'lower-alpha',
              },
            },
          },
        }}
        dangerouslySetInnerHTML={{ __html: text.edges[0].node.html }}
      />
    </Flex>
  )
}

export default TosText
