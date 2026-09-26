import React from 'react'

import Svg from '../images/logo.inline.svg'
import { Box, BoxProps } from '@chakra-ui/react'

type LogoProps = {
  white: boolean
}

const Logo: React.FC<LogoProps & BoxProps> = ({ white, ...rest }) => (
  <Box
    as={Svg}
    p="0.25rem"
    ml={['0.5rem', '0.5rem', '0']}
    maxW="60vw"
    sx={{
      '& path': {
        fill: white ? 'white !important' : undefined,
        transition: 'all 0.3s ease',
      },
    }}
    {...rest}
  />
)

export default Logo
