import React from 'react'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'

import { Box, Divider, Text, VStack } from '@chakra-ui/react'
import MotionBox from '../components/MotionBox'

import CTA from './CTA'
import CTA2 from './CTA2'

import paths from '../paths'
import { useAuth } from '../context/AuthContext'

// TODO: Fix typings here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Variants = { open: any; closed: any; closedHero?: any }

const closed = {
  opacity: 0,
  transitionEnd: {
    display: 'none',
  },
}

const containerVariants: Variants = {
  open: {
    opacity: 1,
    display: 'flex',
  },
  closed,
  closedHero: closed,
}

type NavProps = {
  handleClick: () => void
}

const Nav: React.FC<NavProps> = ({ handleClick }) => {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  return (
    <MotionBox
      flexDirection="column"
      flexWrap="nowrap"
      width="fit-content"
      m="0 auto !important"
      mb="0"
      height="100%"
      justifyContent="center"
      alignItems="center"
      variants={containerVariants}
    >
      <Box m="0 0 2rem 0" w="100%">
        {paths.map((path, index) => (
          <Box w="100%" key={path.path} textAlign="center">
            <Text
              as={Link}
              to={path.path}
              fontSize="2xl"
              color="primary"
              fontWeight={location.pathname === path.path ? 'semiBold' : 'medium'}
              onClick={handleClick}
              textTransform="uppercase"
              lineHeight="2.5"
              opacity={location.pathname === path.path ? 1 : 0.7}
              _hover={{ opacity: 1 }}
            >
              {path.name}
            </Text>
            <Divider border="separator" borderColor="separator" />
          </Box>
        ))}

        {isAuthenticated ? (
          <>
            <Box w="100%" textAlign="center">
              <Text
                as={Link}
                to="/panel"
                fontSize="2xl"
                color="primary"
                fontWeight="bold"
                onClick={handleClick}
                textTransform="uppercase"
                lineHeight="2.5"
                opacity={location.pathname === '/panel' ? 1 : 0.9}
                _hover={{ opacity: 1 }}
              >
                Mi Panel
              </Text>
              <Divider border="separator" borderColor="separator" />
            </Box>
            <Box w="100%" textAlign="center">
              <Text
                as="button"
                fontSize="xl"
                color="red.500"
                fontWeight="medium"
                onClick={() => {
                  logout()
                  handleClick()
                }}
                textTransform="uppercase"
                lineHeight="2.5"
                opacity={0.8}
                _hover={{ opacity: 1 }}
              >
                Cerrar Sesión
              </Text>
            </Box>
          </>
        ) : (
          <Box w="100%" textAlign="center">
            <Text
              as={Link}
              to="/login"
              fontSize="2xl"
              color="primary"
              fontWeight="medium"
              onClick={handleClick}
              textTransform="uppercase"
              lineHeight="2.5"
              opacity={location.pathname === '/login' ? 1 : 0.7}
              _hover={{ opacity: 1 }}
            >
              Ingresar / Registrarse
            </Text>
          </Box>
        )}
      </Box>
      <VStack spacing={4} w="100%" mt={2} mb={6}>
        <CTA2 onClick={handleClick} mb={0} />
        <CTA onClick={handleClick} mb={0} />
      </VStack>
    </MotionBox>
  )
}

export default Nav
