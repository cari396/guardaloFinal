import React from 'react'
import { Flex } from '@chakra-ui/react'

import HeaderBox from '../components/HeaderBox'

const FullSizeMessage: React.FC = ({ children }) => {
  return (
    <>
      <HeaderBox />
      <Flex
        minH="calc(var(--vh, 1vh) * 100 - var(--headerHeight))"
        flexDirection="column"
        justify="center"
        align="center"
        maxW="480px"
        px="2rem"
        mx="auto"
        textAlign="center"
      >
        {children}
      </Flex>
    </>
  )
}

export default FullSizeMessage
