import { Box, Flex, HStack, Icon, Text, Button } from '@chakra-ui/react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import React from 'react'
import HeroBG from './HeroBG'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FiPackage, FiRepeat } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const data = useStaticQuery(graphql`
    query HeroText {
      heroYaml {
        heroText
      }
    }
  `)

  const rentUrl = isAuthenticated ? '/alquilar' : '/login?redirect=/alquilar'
  const renewUrl = isAuthenticated ? '/renovar' : '/login?redirect=/renovar'

  return (
    <Box position="relative" h="calc(var(--vh, 1vh) * 100)" minH="600px">
      <HeroBG />
      <Flex
        top="0"
        left="0"
        position="absolute"
        h="100%"
        w="100%"
        direction="column"
        justify="space-between"
        align="center"
        zIndex="10"
        pt={['90px', '100px', '110px']}
        pb="2rem"
        px={['1.5rem', '2rem', '3rem']}
      >
        <Box /> {/* Spacer to balance layout */}

        {/* Hero Content Container */}
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          maxW="880px"
          mx="auto"
          px={[2, 4]}
        >
          {/* Main Title */}
          <Text
            color="white"
            fontWeight="800"
            fontSize={['2xl', '3xl', '4xl', '5xl']}
            lineHeight={['1.25', '1.2', '1.15']}
            letterSpacing="-0.02em"
            textShadow="0 3px 25px rgba(0, 0, 0, 0.55)"
            mb={5}
          >
            {data.heroYaml.heroText}
          </Text>

          {/* Subtitle */}
          <Text
            color="whiteAlpha.900"
            fontSize={['sm', 'md', 'lg']}
            fontWeight="400"
            maxW="640px"
            textShadow="0 2px 10px rgba(0, 0, 0, 0.45)"
            mb={8}
            lineHeight="tall"
          >
            Alquiler de bauleras y depósitos privados individuales con monitoreo 24/7 y acceso rápido y flexible.
          </Text>

          {/* Action Buttons */}
          <HStack spacing={[3, 4]} flexWrap="wrap" justify="center">
            <Button
              as={Link}
              to={rentUrl}
              size="lg"
              h={['48px', '52px']}
              px={[6, 8]}
              bg="#2563eb"
              color="white"
              fontWeight="bold"
              fontSize={['sm', 'md']}
              borderRadius="full"
              leftIcon={<FiPackage size="18px" />}
              boxShadow="0 10px 25px rgba(37, 99, 235, 0.45)"
              _hover={{
                bg: '#1d4ed8',
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 35px rgba(37, 99, 235, 0.6)',
              }}
              _active={{ transform: 'scale(0.98)' }}
              transition="all 0.2s"
              textDecoration="none !important"
            >
              Alquilar una unidad
            </Button>
            <Button
              as={Link}
              to={renewUrl}
              size="lg"
              h={['48px', '52px']}
              px={[6, 8]}
              bg="rgba(255, 255, 255, 0.15)"
              backdropFilter="blur(10px)"
              border="1.5px solid"
              borderColor="rgba(255, 255, 255, 0.4)"
              color="white"
              fontWeight="bold"
              fontSize={['sm', 'md']}
              borderRadius="full"
              leftIcon={<FiRepeat size="18px" />}
              _hover={{
                bg: 'rgba(255, 255, 255, 0.25)',
                borderColor: 'white',
                transform: 'translateY(-2px)',
              }}
              _active={{ transform: 'scale(0.98)' }}
              transition="all 0.2s"
              textDecoration="none !important"
            >
              Renovar alquiler
            </Button>
          </HStack>
        </Flex>

        {/* Scroll Indicator */}
        <Box
          as="a"
          href="#informacion"
          alignSelf="center"
          position="relative"
          color="whiteAlpha.800"
          _hover={{ color: 'white', transform: 'translateY(2px)' }}
          transition="all 0.2s"
          display="flex"
          flexDirection="column"
          alignItems="center"
          cursor="pointer"
        >
          <Text fontSize="11px" fontWeight="700" letterSpacing="wider" textTransform="uppercase" mb={1}>
            Más información
          </Text>
          <Icon as={MdKeyboardArrowDown} w={5} h={5} />
        </Box>
      </Flex>
    </Box>
  )
}

export default Hero
