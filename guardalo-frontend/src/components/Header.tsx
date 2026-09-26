import React, { useEffect, useState } from 'react'
import { Link, navigate } from 'gatsby'
import { useLocation } from '@reach/router'
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Badge,
  Avatar,
  Divider,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiMenu,
  FiHome,
  FiDollarSign,
  FiHelpCircle,
  FiMail,
  FiBox,
  FiLogOut,
  FiUser,
  FiPackage,
  FiRepeat,
  FiArrowRight,
} from 'react-icons/fi'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

export const headerHeight = 76

interface NavItem {
  name: string
  path: string
}

const navItems: NavItem[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Precios', path: '/precios/' },
  { name: 'Preguntas Frecuentes', path: '/faq/' },
  { name: 'Contacto', path: '/contacto/' },
]

const Header: React.FC = () => {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [onTop, setOnTop] = useState(true)

  const isHome = location.pathname === '/'

  // Clean scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop
      setOnTop(scrollPos < 40)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    onClose()
  }, [location.pathname])

  const white = isHome && onTop
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const rentUrl = isAuthenticated ? '/alquilar' : '/login?redirect=/alquilar'
  const renewUrl = isAuthenticated ? '/renovar' : '/login?redirect=/renovar'

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        h={`${headerHeight}px`}
        zIndex={1000}
        transition="all 0.3s ease"
        bg={
          white
            ? 'rgba(14, 25, 48, 0.45)'
            : isDark
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(255, 255, 255, 0.95)'
        }
        backdropFilter="blur(14px)"
        borderBottom="1px solid"
        borderColor={
          white
            ? 'rgba(255, 255, 255, 0.12)'
            : isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : '#e2e8f0'
        }
        boxShadow={
          white
            ? 'none'
            : isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.05)'
        }
      >
        <Flex
          maxW="1200px"
          h="100%"
          mx="auto"
          px={['1rem', '1.5rem', '2rem']}
          align="center"
          justify="space-between"
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Logo white={white || isDark} maxW={['150px', '180px']} />
          </Link>

          {/* Desktop Navigation Links */}
          <HStack spacing={8} display={['none', 'none', 'flex']}>
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path.replace(/\/$/, ''))

              return (
                <Box
                  as={Link}
                  key={item.path}
                  to={item.path}
                  fontSize="13.5px"
                  fontWeight={isActive ? '700' : '600'}
                  letterSpacing="wider"
                  textTransform="uppercase"
                  color={
                    white
                      ? isActive
                        ? '#93c5fd'
                        : 'white'
                      : isDark
                      ? isActive
                        ? '#60a5fa'
                        : '#e2e8f0'
                      : isActive
                      ? '#1d4ed8'
                      : '#1e293b'
                  }
                  position="relative"
                  py={1}
                  transition="all 0.2s ease"
                  _hover={{
                    color: white ? '#93c5fd' : isDark ? '#93c5fd' : '#2563eb',
                    transform: 'translateY(-1px)',
                  }}
                >
                  {item.name}
                  {isActive && (
                    <Box
                      position="absolute"
                      bottom="-2px"
                      left="0"
                      right="0"
                      h="2px"
                      bg={white ? '#93c5fd' : isDark ? '#60a5fa' : '#2563eb'}
                      borderRadius="full"
                    />
                  )}
                </Box>
              )
            })}
          </HStack>

          {/* Desktop Actions */}
          <HStack spacing={4} display={['none', 'none', 'flex']} align="center">
            <ThemeToggle size="sm" variant={white ? 'ghost' : isDark ? 'ghost' : 'outline'} />
            {isAuthenticated && user ? (
              <HStack spacing={3}>
                <Button
                  as={Link}
                  to="/panel"
                  size="sm"
                  bg={white ? 'whiteAlpha.200' : isDark ? '#2563EB' : '#16284a'}
                  color="white"
                  border="1px solid"
                  borderColor={white ? 'whiteAlpha.300' : isDark ? '#3B82F6' : '#16284a'}
                  _hover={{
                    bg: white ? 'whiteAlpha.300' : isDark ? '#1D4ED8' : '#0f1d38',
                    transform: 'translateY(-1px)',
                    boxShadow: 'sm',
                  }}
                  borderRadius="full"
                  px={4}
                  h="38px"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  leftIcon={<FiBox />}
                >
                  Mi Panel
                </Button>
                <IconButton
                  aria-label="Cerrar sesión"
                  icon={<FiLogOut />}
                  size="sm"
                  variant="ghost"
                  color={white ? 'whiteAlpha.800' : isDark ? 'gray.400' : 'gray.500'}
                  _hover={{
                    bg: white ? 'whiteAlpha.200' : isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                    color: 'red.500',
                  }}
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  title="Cerrar sesión"
                />
              </HStack>
            ) : (
              <HStack spacing={5}>
                <Box
                  as={Link}
                  to="/login"
                  fontSize="13.5px"
                  fontWeight="600"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  color={white ? 'white' : isDark ? '#E2E8F0' : '#16284a'}
                  _hover={{ textDecoration: 'underline', opacity: 0.9 }}
                  whiteSpace="nowrap"
                >
                  Ingresar
                </Box>
                <Button
                  as={Link}
                  to={rentUrl}
                  size="sm"
                  bg={white ? 'white' : isDark ? '#2563EB' : '#16284a'}
                  color={white ? '#16284a' : 'white'}
                  _hover={{
                    bg: white ? 'gray.100' : isDark ? '#1D4ED8' : '#0f1d38',
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                  borderRadius="full"
                  px={5}
                  h="38px"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  boxShadow="sm"
                >
                  Alquilar Box
                </Button>
              </HStack>
            )}
          </HStack>

          {/* Mobile Right Controls (< md) */}
          <HStack spacing={2} display={['flex', 'flex', 'none']} align="center">
            <ThemeToggle size="sm" variant={white ? 'ghost' : isDark ? 'ghost' : 'outline'} />
            {isAuthenticated && (
              <Button
                as={Link}
                to="/panel"
                size="xs"
                variant={white ? 'outline' : 'solid'}
                colorScheme="blue"
                bg={white ? 'whiteAlpha.200' : isDark ? '#2563EB' : '#16284a'}
                color="white"
                borderColor={white ? 'whiteAlpha.400' : 'transparent'}
                borderRadius="full"
                px={3}
                fontSize="11px"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Mi Panel
              </Button>
            )}
            <IconButton
              aria-label="Abrir menú"
              icon={<FiMenu size="24px" />}
              variant="ghost"
              color={white ? 'white' : isDark ? '#F1F5F9' : '#16284a'}
              _hover={{ bg: white ? 'whiteAlpha.200' : isDark ? 'whiteAlpha.200' : 'blackAlpha.50' }}
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Slide-Out Drawer (Ultra-Modern, Responsive) */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
        <DrawerContent bg={isDark ? '#0F172A' : 'white'} color={isDark ? 'white' : 'gray.800'} maxW="320px">
          <DrawerCloseButton mt={2} mr={2} size="lg" />
          <DrawerHeader borderBottom={isDark ? '1px solid #334155' : '1px solid #e2e8f0'} py={4} px={5}>
            <Link to="/" onClick={onClose}>
              <Logo white={isDark} maxW="150px" />
            </Link>
          </DrawerHeader>

          <DrawerBody px={5} py={6}>
            <VStack spacing={5} align="stretch">
              {/* User Section in Drawer */}
              {isAuthenticated && user ? (
                <Box
                  bg={isDark ? 'whiteAlpha.100' : '#eff6ff'}
                  border="1px solid"
                  borderColor={isDark ? 'whiteAlpha.200' : '#bfdbfe'}
                  borderRadius="xl"
                  p={4}
                >
                  <HStack spacing={3} mb={2}>
                    <Avatar
                      size="sm"
                      name={user.name}
                      bg="#16284a"
                      color="white"
                      fontWeight="bold"
                    />
                    <Box overflow="hidden">
                      <Text fontWeight="bold" fontSize="sm" color={isDark ? 'white' : '#16284a'} isTruncated>
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.500'} isTruncated>
                        {user.email}
                      </Text>
                    </Box>
                  </HStack>
                  <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'} mb={3} fontSize="10px">
                    Rol: {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </Badge>
                  <Button
                    as={Link}
                    to="/panel"
                    onClick={onClose}
                    w="100%"
                    size="sm"
                    bg={isDark ? '#2563EB' : '#16284a'}
                    color="white"
                    _hover={{ bg: isDark ? '#1D4ED8' : '#0f1d38' }}
                    leftIcon={<FiBox />}
                    fontWeight="semibold"
                    fontSize="xs"
                    letterSpacing="wider"
                    textTransform="uppercase"
                  >
                    Ir a Mi Panel
                  </Button>
                </Box>
              ) : (
                <Box
                  bg={isDark ? 'whiteAlpha.100' : 'gray.50'}
                  border="1px solid"
                  borderColor={isDark ? 'whiteAlpha.200' : '#e2e8f0'}
                  borderRadius="xl"
                  p={4}
                  textAlign="center"
                >
                  <Text fontSize="xs" color={isDark ? 'gray.300' : 'gray.600'} mb={3}>
                    Accedé a tu cuenta para gestionar tus alquileres
                  </Text>
                  <Button
                    as={Link}
                    to="/login"
                    onClick={onClose}
                    w="100%"
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<FiUser />}
                    fontWeight="bold"
                  >
                    Ingresar / Registrarse
                  </Button>
                </Box>
              )}

              {/* Navigation Links with Icons */}
              <VStack spacing={1} align="stretch">
                <Text
                  fontSize="11px"
                  fontWeight="bold"
                  color={isDark ? 'gray.500' : 'gray.400'}
                  textTransform="uppercase"
                  letterSpacing="wider"
                  px={3}
                  mb={1}
                >
                  Navegación
                </Text>
                {navItems.map((item) => {
                  const icon =
                    item.path === '/'
                      ? FiHome
                      : item.path.includes('precios')
                      ? FiDollarSign
                      : item.path.includes('faq')
                      ? FiHelpCircle
                      : FiMail
                  const IconComp = icon
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path.replace(/\/$/, ''))

                  return (
                    <Flex
                      as={Link}
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      align="center"
                      justify="space-between"
                      px={3.5}
                      py={2.5}
                      borderRadius="lg"
                      bg={isActive ? (isDark ? 'whiteAlpha.200' : 'blue.50') : 'transparent'}
                      color={isActive ? (isDark ? '#60a5fa' : '#1d4ed8') : (isDark ? '#e2e8f0' : '#334155')}
                      fontWeight={isActive ? '700' : '500'}
                      fontSize="sm"
                      transition="all 0.15s"
                      _hover={{
                        bg: isDark ? 'whiteAlpha.100' : 'gray.100',
                        color: isDark ? 'white' : '#16284a',
                      }}
                    >
                      <HStack spacing={3}>
                        <IconComp size="16px" />
                        <Text>{item.name}</Text>
                      </HStack>
                      <FiArrowRight size="13px" opacity={0.5} />
                    </Flex>
                  )
                })}
              </VStack>

              <Divider borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'} />

              {/* Quick Actions */}
              <VStack spacing={2.5} align="stretch">
                <Button
                  as={Link}
                  to={rentUrl}
                  onClick={onClose}
                  w="100%"
                  h="44px"
                  bg={isDark ? '#2563EB' : '#16284a'}
                  color="white"
                  _hover={{ bg: isDark ? '#1D4ED8' : '#0f1d38' }}
                  leftIcon={<FiPackage />}
                  fontWeight="bold"
                  fontSize="sm"
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  Alquilar una unidad
                </Button>
                <Button
                  as={Link}
                  to={renewUrl}
                  onClick={onClose}
                  w="100%"
                  h="44px"
                  variant="outline"
                  borderColor={isDark ? 'whiteAlpha.300' : '#cbd5e1'}
                  color={isDark ? 'white' : '#16284a'}
                  _hover={{ bg: isDark ? 'whiteAlpha.100' : 'gray.50' }}
                  leftIcon={<FiRepeat />}
                  fontWeight="semibold"
                  fontSize="sm"
                  borderRadius="lg"
                >
                  Renovar alquiler
                </Button>
              </VStack>
            </VStack>
          </DrawerBody>

          {/* Drawer Footer with Logout & Address */}
          <DrawerFooter borderTop={isDark ? '1px solid #334155' : '1px solid #e2e8f0'} justifyContent="space-between" py={3} px={5}>
            {isAuthenticated ? (
              <Button
                variant="ghost"
                colorScheme="red"
                size="sm"
                leftIcon={<FiLogOut />}
                onClick={() => {
                  logout()
                  onClose()
                  navigate('/')
                }}
                fontSize="xs"
              >
                Cerrar Sesión
              </Button>
            ) : (
              <Text fontSize="11px" color="gray.500">
                Guardalo.com · Chivilcoy
              </Text>
            )}
            <Text fontSize="10.5px" color="gray.400">
              Ruta 5 Km 158.5
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Header
