import { Divider, Flex, ListItem } from '@chakra-ui/layout'
import { Box, Heading, Stack, UnorderedList } from '@chakra-ui/react'
import React from 'react'
import ContactItems from './ContactItems'
import Link from './Link'
import Logo from './Logo'

type ListLinkProps = {
  to: string
}
const ListLink: React.FC<ListLinkProps> = ({ to, children }) => (
  <ListItem listStyleType="none">
    <Link to={to}>{children}</Link>
  </ListItem>
)

const Footer: React.FC = () => {
  return (
    <Box as="footer" w="100%" bg="primary" color="white" py="2rem" alignSelf="flex-end">
      <Flex
        mx="auto"
        maxW="870"
        justify="space-between"
        p="1rem"
        direction={['column', 'column', 'row']}
      >
        <Stack
          direction="column"
          fontSize="xl"
          fontWeight="bold"
          lineHeight="1"
          spacing="1rem"
          mb="3rem"
        >
          <Link to="/">Inicio</Link>
          <Link to="/faq">Preguntas frecuentes</Link>
          <Link to="/contacto">Contacto</Link>
          <Divider display={['none', 'none', 'block']} />
          <Link to="/alquilar">Alquilar una unidad</Link>
          <Link to="/renovar">Renovar una unidad</Link>
        </Stack>

        <Flex direction="column" mb="3rem">
          <Heading
            as="h3"
            mb="1rem"
            fontSize="xl"
            lineHeight="1"
            color="white"
            opacity="0.6"
          >
            Información
          </Heading>
          <UnorderedList fontSize="lg">
            <ListLink to="/#informacion">¿Quiénes somos?</ListLink>
            <ListLink to="/#unidades">¿Qué ofrecemos?</ListLink>
            <ListLink to="/#galeria">¿Cómo es el complejo?</ListLink>
            <ListLink to="/#ubicacion">¿Dónde estamos?</ListLink>
          </UnorderedList>
        </Flex>

        <Stack display="column" w="33%">
          <ContactItems />
        </Stack>
      </Flex>

      <Logo
        mt={['1rem', '1rem', '2rem']}
        p="0.5rem"
        ml="auto"
        mr="auto"
        opacity={0.2}
        white
      />
    </Box>
  )
}

export default Footer
