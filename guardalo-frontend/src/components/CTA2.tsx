/* eslint-disable prettier/prettier */
import React from 'react'
import { Link } from 'gatsby'
import { Link as ChakraLink, useTheme } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionLink = motion(ChakraLink)

type CTAProps = {
  onClick?: () => void
  mb?: string | number
}

const CTA: React.FC<CTAProps> = ({ onClick, mb = '0.5rem' }) => {
  const theme = useTheme()

  return (
    <MotionLink
      as={Link}
      transition={{ type: 'spring', duration: 0.05 }}
      whileHover={{
        scale: 1.05,
        boxShadow: theme.shadows['xl'],
      }}
      whileTap={{ scale: 0.95 }}
      layerStyle="cta"
      mb={mb}
      textStyle="cta"
      onClick={onClick}
      to="/alquilar"
      textDecoration="none !important"
      color="white"
      boxShadow="md"
    >
      Alquilar una unidad
    </MotionLink>
  )
}

export default CTA