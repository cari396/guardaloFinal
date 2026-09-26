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

  return (
    <Box minH="100vh" w="100%" bg="#f4f7fb">
      {/* Top Bar (Prototype Pages 1 & 2) */}
      <Flex
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        h="70px"
        bg="white"
        borderBottom="1px solid #e2e8f0"
        zIndex={50}
        align="center"
        justify="space-between"
        px={[4, 6, 8]}
        boxShadow="0 1px 3px rgba(0,0,0,0.03)"
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
            <Logo white={false} maxW={['150px', '180px']} />
          </Link>
        </HStack>

        {/* User profile dropdown on top-right: JUAN LÓPEZ ▼ */}
        <Flex align="center">
          <UserNav inDashboard={true} />
        </Flex>
      </Flex>

      {/* Main Container: Sidebar + Content */}
      <Flex pt="70px" minH="100vh">
        {/* Desktop Sidebar (Dark Navy `#16284a` / `#1a2b49`) */}
        <Box
          display={['none', 'none', 'block']}
          w={['220px', '240px', '260px']}
          bg="#16284a"
          position="fixed"
          top="70px"
          bottom={0}
          left={0}
          zIndex={40}
          boxShadow="2px 0 8px rgba(0,0,0,0.1)"
          overflowY="auto"
        >
          {renderNavContent()}
        </Box>

        {/* Mobile Drawer Sidebar */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="#16284a">
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
