import React from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { IconButton } from '@chakra-ui/react'
import { motion } from 'framer-motion'

type MenuButtonProps = {
  navOpen: boolean
  white: boolean
  handleClick: () => void
}

const MotionIconButton = motion(IconButton)

const MenuButton: React.FC<MenuButtonProps> = ({ navOpen, white, handleClick }) => (
  <MotionIconButton
    aria-label={`${navOpen ? 'Abrir' : 'Cerrar'} menú`}
    bg="none"
    outline="none"
    border="none"
    padding="0.5rem"
    margin="0 1rem 0 0"
    color={white ? 'white' : 'primary'}
    height="3.5rem"
    _hover={{ cursor: 'pointer' }}
    onClick={handleClick}
  >
    {!navOpen ? <MdMenu size="2.5rem" /> : <MdClose size="2.5rem" />}
  </MotionIconButton>
)

export default MenuButton
