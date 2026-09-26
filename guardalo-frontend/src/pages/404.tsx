import React from 'react'
import { Heading, Text } from '@chakra-ui/react'

import FullSizeMessage from '../components/fullSizeMessage'
import Link from '../components/Link'

import SEO from '../components/Seo'

const NotFoundPage: React.FC = () => (
  <>
    <SEO title="Página inexistente" />
    <FullSizeMessage>
      <Heading pb="2rem"> Página inexistente</Heading>
      <Text pb="1rem">La página a la que intentaste acceder no existe.</Text>
      <Link
        color="primary"
        fontWeight="bold"
        _hover={{ textDecoration: 'underline' }}
        to="/"
      >
        Clickeá para volver al inicio
      </Link>
    </FullSizeMessage>
  </>
)

export default NotFoundPage
