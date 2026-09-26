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
      mb={mb}
      layerStyle="cta"
      textStyle="cta"
      onClick={onClick}
      to="/renovar"
      textDecoration="none !important"
      color="white"
      boxShadow="md"
    >
      Renovar una unidad
    </MotionLink>
  )
}

export default CTA
