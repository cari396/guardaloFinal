import React from 'react'
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react'
import { FiSun, FiMoon } from 'react-icons/fi'

interface ThemeToggleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline' | 'solid'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'sm',
  variant = 'ghost',
}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const iconColor = useColorModeValue('#1E3264', '#F6E05E')
  const hoverBg = useColorModeValue('rgba(30, 50, 100, 0.08)', 'rgba(255, 255, 255, 0.12)')
  const borderColor = useColorModeValue('#CBD5E1', '#475569')

  return (
    <Tooltip label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} hasArrow>
      <IconButton
        aria-label="Alternar modo oscuro o claro"
        icon={isDark ? <FiSun /> : <FiMoon />}
        onClick={toggleColorMode}
        size={size}
        variant={variant}
        color={iconColor}
        borderColor={borderColor}
        _hover={{ bg: hoverBg }}
        transition="all 0.2s ease"
        borderRadius="md"
        fontSize="16px"
      />
    </Tooltip>
  )
}

export default ThemeToggle
