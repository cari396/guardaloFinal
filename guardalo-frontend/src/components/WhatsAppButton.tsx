import React, { useState } from 'react'
import { Box, Flex, Text, Tooltip } from '@chakra-ui/react'
import { FaWhatsapp } from 'react-icons/fa'

interface WhatsAppButtonProps {
  phoneNumber?: string
  defaultMessage?: string
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '5492346691234',
  defaultMessage = 'Hola, quisiera consultar sobre el alquiler de un box en Guardalo',
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const encodedMessage = encodeURIComponent(defaultMessage)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  return (
    <Box
      position="fixed"
      bottom={{ base: '20px', md: '28px' }}
      right={{ base: '20px', md: '28px' }}
      zIndex={1050}
    >
      <Flex
        as="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        align="center"
        bg="#25D366"
        color="white"
        p={{ base: '12px', md: '14px' }}
        borderRadius="full"
        boxShadow="0 6px 20px rgba(37, 211, 102, 0.45)"
        cursor="pointer"
        transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        transform={isHovered ? 'scale(1.08)' : 'scale(1)'}
        _hover={{
          bg: '#1EBE5D',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.6)',
          textDecoration: 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box fontSize={{ base: '30px', md: '34px' }} lineHeight={1}>
          <FaWhatsapp />
        </Box>

        {/* Desktop pill message on hover */}
        <Box
          maxW={isHovered ? '200px' : '0px'}
          overflow="hidden"
          whiteSpace="nowrap"
          transition="max-width 0.35s ease, opacity 0.25s ease, margin 0.25s ease"
          opacity={isHovered ? 1 : 0}
          ml={isHovered ? 2.5 : 0}
          mr={isHovered ? 1.5 : 0}
          display={{ base: 'none', md: 'block' }}
        >
          <Text fontSize="sm" fontWeight="bold" color="white" userSelect="none">
            ¿Dudas? Chateá con nosotros
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default WhatsAppButton
