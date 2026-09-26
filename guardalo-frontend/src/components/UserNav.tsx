import React from 'react'
import { Link, navigate } from 'gatsby'
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Badge,
} from '@chakra-ui/react'
import { FaChevronDown, FaUser, FaSignOutAlt, FaShieldAlt, FaBoxOpen } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

interface UserNavProps {
  white?: boolean
  inDashboard?: boolean
}

const UserNav: React.FC<UserNavProps> = ({ white = false, inDashboard = false }) => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <Flex alignItems="center" mr={4}>
        <Box
          as={Link}
          to="/login"
          fontSize={['sm', 'md']}
          fontWeight="medium"
          color={white ? 'white' : 'primary'}
          textDecoration="none"
          _hover={{ textDecoration: 'underline', opacity: 0.9 }}
          cursor="pointer"
          whiteSpace="nowrap"
        >
          Ingresar | Registrarse
        </Box>
      </Flex>
    )
  }

  if (!inDashboard) {
    return (
      <Flex alignItems="center" mr={4} gap={2}>
        <Box
          as={Link}
          to="/panel"
          fontSize={['sm', 'md']}
          fontWeight="semibold"
          color={white ? 'white' : 'primary'}
          textDecoration="none"
          _hover={{ textDecoration: 'underline', opacity: 0.9 }}
          cursor="pointer"
          whiteSpace="nowrap"
        >
          Mi Panel
        </Box>
        <Text color={white ? 'whiteAlpha.600' : 'gray.400'} fontSize="sm">
          |
        </Text>
        <Box
          as="button"
          onClick={() => {
            logout()
            navigate('/')
          }}
          fontSize={['sm', 'md']}
          fontWeight="normal"
          color={white ? 'whiteAlpha.800' : 'gray.500'}
          textDecoration="none"
          _hover={{ textDecoration: 'underline', color: 'red.500' }}
          cursor="pointer"
          whiteSpace="nowrap"
        >
          Salir
        </Box>
      </Flex>
    )
  }

  return (
    <Flex alignItems="center" mr={2}>
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          variant="ghost"
          size="sm"
          px={3}
          py={2}
          color="primary"
          _hover={{ bg: 'blackAlpha.50' }}
          _active={{ bg: 'blackAlpha.100' }}
          fontWeight="semibold"
          fontSize="sm"
          rightIcon={<FaChevronDown size="11px" />}
          textTransform="uppercase"
          letterSpacing="wider"
        >
          <Text as="span" display="inline-block" maxW={['120px', '200px']} isTruncated>
            {user.name}
          </Text>
        </MenuButton>

        <MenuList
          zIndex={100}
          boxShadow="lg"
          borderColor="gray.200"
          py={2}
          minW="220px"
          bg="white"
          color="gray.800"
        >
          <Box px={4} py={2}>
            <Text fontWeight="bold" fontSize="sm" color="gray.800">
              {user.name}
            </Text>
            <Text fontSize="xs" color="gray.500" isTruncated>
              {user.email}
            </Text>
          </Box>

          <MenuDivider />

          <MenuItem
            icon={<FaBoxOpen />}
            onClick={() => navigate('/panel')}
            fontSize="sm"
            color="gray.700"
          >
            Mi Panel / Mis Boxes
          </MenuItem>

          <MenuItem
            icon={<FaUser />}
            onClick={() => navigate('/panel?tab=datos')}
            fontSize="sm"
            color="gray.700"
          >
            Mis Datos de Perfil
          </MenuItem>

          <MenuDivider />

          <MenuItem
            icon={<FaSignOutAlt />}
            onClick={() => {
              logout()
              navigate('/')
            }}
            fontSize="sm"
            color="red.600"
            _hover={{ bg: 'red.50', color: 'red.700' }}
          >
            Cerrar Sesión
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default UserNav
