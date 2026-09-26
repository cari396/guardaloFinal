import React, { useEffect, useState } from 'react'
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { FormProvider, useForm } from 'react-hook-form'

import theme from '../theme'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { AuthProvider } from '../context/AuthContext'

import { headerHeight } from './Header'

import 'typeface-cabin'
import 'leaflet/dist/leaflet.css'
import { GlobalStateContext } from '../hooks/useGlobalState'

const Index: React.FC = ({ children }) => {
  const [pdfUrl, setPdfUrl] = useState(null) // GlobalStateContext
  const value = { pdfUrl, setPdfUrl }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const smoothscroll = require('smoothscroll-polyfill')
    smoothscroll.polyfill()

    const setDocHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`)
      document.documentElement.style.setProperty('--headerHeight', `${headerHeight}px`)
    }

    setDocHeight()
    //window.addEventListener('resize', setDocHeight)
    window.addEventListener('orientationchange', setDocHeight)
  }, [])

  const methods = useForm()

  let pathname = ''
  try {
    pathname =
      (children as any)?.props?.location?.pathname ||
      (typeof window !== 'undefined' ? window.location.pathname : '')
  } catch (e) {
    pathname = ''
  }

  const isDashboardOrAuth = pathname.startsWith('/panel') || pathname.startsWith('/login')

  return (
    <ChakraProvider resetCSS theme={theme}>
      <GlobalStateContext.Provider value={value}>
        <AuthProvider>
          {isDashboardOrAuth ? (
            <Box w="100%" minH="100vh" bg="#f4f7fb">
              {children}
            </Box>
          ) : (
            <FormProvider {...methods}>
              <Header />
              <Flex
                w="100%"
                direction="column"
                wrap="nowrap"
                overflowX="hidden"
                alignItems="stretch"
                minH="calc(var(--vh, 1vh) * 100)"
              >
                {children}
                <Box flex="1 1 0px" />
                <Footer />
              </Flex>
            </FormProvider>
          )}
          <WhatsAppButton />
        </AuthProvider>
      </GlobalStateContext.Provider>
    </ChakraProvider>
  )
}

export default Index
