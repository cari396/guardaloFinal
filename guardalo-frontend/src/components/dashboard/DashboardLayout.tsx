import React, { useState } from 'react'
import { Link } from 'gatsby'
import {
  Box,
  Flex,
  Text,
  Stack,
  HStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiPackage,
  FiUser,
  FiRepeat,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiMenu,
  FiLayers,
} from 'react-icons/fi'
import Logo from '../Logo'
import UserNav from '../UserNav'
import ThemeToggle from '../ThemeToggle'
import { useAuth } from '../../context/AuthContext'

export type DashboardTab =
  | 'boxes'
  | 'datos'
  | 'operaciones'
  | 'inventario'
  | 'precios'
  | 'clientes'
  | 'contrato'
  | 'admin_operaciones'

interface DashboardLayoutProps {
  currentTab: DashboardTab
  onSelectTab: (tab: DashboardTab) => void
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Sidebar navigation items
  const clientNavItems: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'boxes', label: 'MIS BOXES', icon: FiPackage },
    { id: 'datos', label: 'MIS DATOS', icon: FiUser },
    { id: 'operaciones', label: 'MIS OPERACIONES', icon: FiRepeat },
  ]

  const adminNavItems: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'inventario', label: 'INVENTARIO DE BOXES', icon: FiLayers },
    { id: 'admin_operaciones', label: 'OPERACIONES / TRANSFERENCIAS', icon: FiRepeat },
    { id: 'precios', label: 'PRECIOS', icon: FiDollarSign },
    { id: 'clientes', label: 'CLIENTES', icon: FiUsers },
    { id: 'contrato', label: 'CONTRATO', icon: FiFileText },
  ]

  const isAdmin = user?.role === 'admin'

  const renderNavContent = () => (
    <Flex direction="column" h="100%" justify="space-between" py={4}>
      <Box>
        {/* Client section */}
        <Stack spacing={1}>
          {clientNavItems.map((item) => {
            const IconComp = item.icon
            const isSelected = currentTab === item.id
            return (
              <Flex
                key={item.id}
                align="center"
                px={6}
                py={3.5}
                cursor="pointer"
                bg={isSelected ? '#223862' : 'transparent'}
                borderLeft={isSelected ? '4px solid #63b3ed' : '4px solid transparent'}
                color={isSelected ? 'white' : '#b0c4de'}
                _hover={{ bg: '#1d3156', color: 'white' }}
                transition="all 0.2s ease"
                onClick={() => {
                  onSelectTab(item.id)
                  onClose()
                }}
              >
                <Box mr={3.5} fontSize="17px">
                  <IconComp />
                </Box>
                <Text
                  fontSize="13px"
                  fontWeight={isSelected ? 'bold' : 'medium'}
                  letterSpacing="wider"
                >
                  {item.label}
                </Text>
              </Flex>
            )
          })}
        </Stack>

        {/* Administration section (Prototype Page 1) */}
        {isAdmin && (
          <Box mt={8}>
            <Box px={6} py={2} mb={1}>
              <Text
                fontSize="11px"
                fontWeight="bold"
                letterSpacing="widest"
                color="#6e88ad"
                textTransform="uppercase"
              >
                ADMINISTRACIÓN
              </Text>
            </Box>
            <Stack spacing={1}>
              {adminNavItems.map((item) => {
                const IconComp = item.icon
                const isSelected = currentTab === item.id
                return (
                  <Flex
                    key={item.id}
                    align="center"
                    px={6}
                    py={3.5}
                    cursor="pointer"
                    bg={isSelected ? '#223862' : 'transparent'}
                    borderLeft={isSelected ? '4px solid #63b3ed' : '4px solid transparent'}
                    color={isSelected ? 'white' : '#b0c4de'}
                    _hover={{ bg: '#1d3156', color: 'white' }}
                    transition="all 0.2s ease"
                    onClick={() => {
                      onSelectTab(item.id)
                      onClose()
                    }}
                  >
                    <Box mr={3.5} fontSize="17px">
                      <IconComp />
                    </Box>
                    <Text
                      fontSize="13px"
                      fontWeight={isSelected ? 'bold' : 'medium'}
                      letterSpacing="wider"
                    >
                      {item.label}
                    </Text>
                  </Flex>
                )}
              )}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Footer Info in Sidebar */}
      <Box px={6} pt={6} borderTop="1px solid #223862">
        <Text fontSize="xs" color="#6e88ad">
          Guardalo.com &copy; {new Date().getFullYear()}
        </Text>
        <Text fontSize="10px" color="#526d91" mt={0.5}>
          {isAdmin ? 'Modo Administrador' : 'Modo Cliente'}
        </Text>
      </Box>
    </Flex>
  )

  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const topBarBg = useColorModeValue('white', '#1E293B')
  const topBarBorder = useColorModeValue('1px solid #e2e8f0', '1px solid #334155')
  const pageBg = useColorModeValue('#f4f7fb', '#0B1120')
  const sidebarBg = useColorModeValue('#16284a', '#0F172A')

  return (
    <Box minH="100vh" w="100%" bg={pageBg} transition="background-color 0.2s ease">
      {/* Top Bar (Prototype Pages 1 & 2) */}
      <Flex
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        h="70px"
        bg={topBarBg}
        borderBottom={topBarBorder}
        zIndex={50}
        align="center"
        justify="space-between"
        px={[4, 6, 8]}
        boxShadow="0 1px 3px rgba(0,0,0,0.03)"
        transition="background-color 0.2s ease, border-color 0.2s ease"
      >
        <HStack spacing={4}>
          {/* Mobile menu trigger */}
          <IconButton
            display={['flex', 'flex', 'none']}
            aria-label="Abrir menú"
            icon={<FiMenu />}
            variant="ghost"
            onClick={onOpen}
          />
          <Link to="/">
            <Logo white={isDark} maxW={['150px', '180px']} />
          </Link>
        </HStack>

        {/* User profile dropdown and dark mode on top-right */}
        <HStack spacing={3} align="center">
          <ThemeToggle variant="outline" size="sm" />
          <UserNav inDashboard={true} />
        </HStack>
      </Flex>

      {/* Main Container: Sidebar + Content */}
      <Flex pt="70px" minH="100vh">
        {/* Desktop Sidebar (Dark Navy `#16284a` / `#1a2b49`) */}
        <Box
          display={['none', 'none', 'block']}
          w={['220px', '240px', '260px']}
          bg={sidebarBg}
          position="fixed"
          top="70px"
          bottom={0}
          left={0}
          zIndex={40}
          boxShadow="2px 0 8px rgba(0,0,0,0.1)"
          overflowY="auto"
          transition="background-color 0.2s ease"
        >
          {renderNavContent()}
        </Box>

        {/* Mobile Drawer Sidebar */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg={sidebarBg}>
            <DrawerCloseButton color="white" />
            <DrawerBody p={0} pt={10}>
              {renderNavContent()}
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Content Area */}
        <Box
          ml={['0', '0', '260px']}
          flex="1"
          p={[4, 6, 10]}
          minH="calc(100vh - 70px)"
          w={['100%', '100%', 'calc(100% - 260px)']}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default DashboardLayout
