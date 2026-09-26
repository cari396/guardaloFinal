import React from 'react'
import { graphql, PageProps } from 'gatsby'
import { OrderedList, Flex, Heading, Text, Link, Divider} from '@chakra-ui/react'
import SEO from '../components/Seo'
import HeaderBox from '../components/HeaderBox'

type FaqPageData = {
  data: {
    text: {
      title: string
      faq: Array<{
        key: string
        question: string
        answer: string
      }>
    }
  }
}
const FaqPage: React.FC<PageProps & FaqPageData> = ({ data }) => {
  const { title, faq } = data.text

  return (
    <>
      <SEO title="Preguntas frecuentes" />
      <HeaderBox />
      <Flex direction="column" wrap="nowrap" maxW="960px" py="1rem" mx="auto">
        <Heading textStyle="sectionTitle">{title}</Heading>
        {/* <Heading m="0 1rem 0 1rem" fontSize="xl" as="h3" pb="1rem">
          Índice
        </Heading>
        <OrderedList p="0 2rem 0 3rem" m="0 0 3rem 0" color="text">
          {faq.map((item) => (
            <li key={item.key}>
              <Link m="0 0 1em 0" color="primary" href={`#${item.key}`}>
                {item.question}
              </Link>
            </li>
          ))} */}
        {/* </OrderedList> */}
        <OrderedList listStyleType="none" p="0">
          {faq.map((item) => (
            <li key={item.key} id={item.key}>
              <Text as="h3" m="0 1rem 0 1rem" fontWeight="bold" textAlign="center" marginBottom="2rem" cursor="pointer" >
                <details>
                  <summary>{item.question}</summary>
                  <Text m="0 2rem 2rem 2rem" fontWeight="normal" whileTap={{ scale: 0.95 }}>
                  <p>{item.answer}</p>
                  </Text>
                </details>
                
              </Text>
              {/* <Text m="0 2rem 2rem 2rem">{item.answer}</Text> */}
            </li>
          ))}
        </OrderedList>
      </Flex>
    </>
  )
}

export const query = graphql`
  query faqQuery {
    text: faqYaml {
      title
      faq {
        key
        question
        answer
      }
    }
  }
`

export default FaqPage
