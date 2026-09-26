import React, { useRef } from 'react'
import { chakra, Box, Flex, Img, Stack, Text, Heading } from '@chakra-ui/react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage as GI } from 'gatsby-plugin-image'
import { useIntersection } from 'react-use'

import sizeIcon from '../images/features/size.svg'
import cameraIcon from '../images/features/camera.svg'
import timeIcon from '../images/features/time.svg'
import easeIcon from '../images/features/ease.svg'
import paymentIcon from '../images/features/payment.svg'
import MotionBox from './MotionBox'

const GatsbyImage = chakra(GI)

const icons: [string, string][] = [
  ['size', sizeIcon],
  ['camera', cameraIcon],
  ['time', timeIcon],
  ['ease', easeIcon],
  ['payment', paymentIcon],
]

const Info: React.FC = (): JSX.Element => {
  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  })

  const { text, img } = useStaticQuery(graphql`
    query infoQuery {
      text: infoYaml {
        sectionIntro {
          title
          body
        }
        sectionOfferings {
          title
          items {
            title
            body
            icon
          }
        }
      }
      img: allFile(
        filter: { relativeDirectory: { eq: "informacion" }, extension: { eq: "jpg" } }
        sort: { fields: relativePath, order: ASC }
      ) {
        edges {
          node {
            id
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `)

  return (
    <Flex
      direction="column"
      wrap="nowrap"
      maxW={['100%', '100%', '1280px']}
      id="informacion"
      className="info-link"
      mx="auto"
    >
      <Flex flex="0 0 100%" direction={['column', 'column', 'row']} w="100%">
        <Box>
          <Heading as="h2" m="2rem 1rem">
            {text.sectionIntro.title}
          </Heading>
          {text.sectionIntro.body.map((p, i) => (
            <Text m="0 2rem" key={i} pb="2rem" fontSize="xl">
              {p}
            </Text>
          ))}
        </Box>
        <Box flex="0 0 60%" position="relative" mb="10%">
          <Box position="relative" top="20%" right="-20%">
            <GatsbyImage
              image={img.edges[1].node.childImageSharp.gatsbyImageData}
              alt="Depósito de Guardalo.com"
              boxShadow="md"
            />
          </Box>
        </Box>
      </Flex>
      <Box
        flex="0 0 100%"
        id="unidades"
        className="info-link"
        pb="3rem"
        ref={intersectionRef}
      >
        <Heading textAlign="center" m="0 0 2rem 0">
          {text.sectionOfferings.title}
        </Heading>
        <Flex
          direction={['column', 'column', 'row']}
          alignItems={['center', 'center ', 'stretch']}
          justifyContent="center"
          wrap="wrap"
        >
          {text.sectionOfferings.items.map((item, i) => (
            <Stack
              key={item.title}
              direction="column"
              spacing="1rem"
              w={['70%', '40%', '220px']}
              wrap="nowrap"
              justifyContent="stretch"
              bg="white"
              boxShadow="md"
              textAlign="center"
              alignItems="center"
              position="relative"
              overflow="hidden"
              mx="0.5rem"
              mb="1rem"
            >
              <MotionBox
                display="flex"
                position="absolute"
                direction="column"
                w="100%"
                h="100%"
                zIndex="2"
                bg="gray"
                initial={false}
                variants={{
                  open: {
                    y: 'calc(-100% + 16px)',
                    transition: { delay: i * 0.3, ease: 'easeInOut', duration: 2 },
                  },
                }}
                animate={intersection && intersection.isIntersecting ? 'open' : false}
                justifyContent="center"
                alignItems="flex-end"
              >
                <Box w="24px" h="6px" my="5px" bg="text" opacity="0.7" />
              </MotionBox>
              <Img
                p="2rem"
                w={['80%', '80%', '100%']}
                alt={`Icono: ${item.icon}`}
                src={icons.find((i) => i[0] === item.icon)?.[1]}
              />
              <Heading as="h3" textTransform="uppercase" fontSize="lg" px="2rem">
                {item.title}
              </Heading>
              <Text p="1rem" display="block" flex="1">
                {item.body}
              </Text>
            </Stack>
          ))}
        </Flex>
      </Box>
    </Flex>
  )
}

export default Info
