import React from 'react'
import { PageProps, Link as GatsbyLink } from 'gatsby'

import SEO from '../components/Seo'
import Link from '../components/Link'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  HStack,
  Avatar,
  Badge,
} from '@chakra-ui/react'
import { FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi'
import RenovarBoxForm from '../components/RenovarBoxForm'
import HeaderBox from '../components/HeaderBox'
import PriceList from '../components/PriceList'
import PriceList2 from '../components/PriceList2'
import PriceList3 from '../components/PriceList3'

import useGlobalState from '../hooks/useGlobalState'
import { useAuth } from '../context/AuthContext'

const RenovarPage: React.FC<PageProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { pdfUrl } = useGlobalState()
  const { isAuthenticated, user } = useAuth()

  return (
    <>
      <SEO title="Renovar" />
      <HeaderBox />
      <Flex
        direction="column"
        wrap="nowrap"
        maxW={['100%', '960px', '960px']}
        pt="1rem"
        pb="5rem"
        px={['1rem', '2rem']}
        mx="auto"
      >
        {pdfUrl ? (
          <Box textAlign="center">
            <Heading textStyle="sectionTitle">¡Gracias!</Heading>
            <Text px="2rem">
              Tu solicitud fue enviada con éxito. Te contactaremos en breve mediante
              e-mail o por vía telefónica. Podes revisar tu solicitud en el correo
              electrónico que te enviamos o en el contrato debajo. Si tenés alguna duda o
              corrección que hacer, podes hacerlo desde las opciones que brindamos en la
              página de{' '}
              <Link color="primary" to="/contacto">
                contacto
              </Link>
              .
            </Text>

            <Flex justify="center" gap={4} wrap="wrap" my="2rem">
              <Link
                display="inline-block"
                layerStyle="cta"
                fontWeight="bold"
                textTransform="uppercase"
                to={pdfUrl}
                target="_blank"
              >
                📄 Descargar / Ver Contrato
              </Link>
              <Link
                display="inline-block"
                layerStyle="cta"
                bg="#16284a"
                _hover={{ bg: '#101d36' }}
                fontWeight="bold"
                textTransform="uppercase"
                to="/panel"
              >
                Ir a Mi Panel
              </Link>
            </Flex>
          </Box>
        ) : (
          <>
            <Heading textStyle="sectionTitle">Renovar una unidad</Heading>

            {/* Modal de Precios */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent
                minW={['calc(100% - 2rem)', 'calc(100% - 2rem)', '960px']}
                mx="1rem"
                color="primary"
              >
                <ModalHeader>Precios</ModalHeader>
                <ModalCloseButton />
                <ModalBody h="fit-content">
                  <Text
                    textAlign="center"
                    fontSize="1.5rem"
                    fontWeight="bold"
                    marginBottom="1.5rem"
                  >
                    Tamaño pequeño: 8.3m² (1.66x5m)
                  </Text>
                  <PriceList />
                  <Text
                    textAlign="center"
                    fontSize="1.5rem"
                    fontWeight="bold"
                    marginBottom="1rem"
                  >
                    Tamaño mediano: 13.75m² (2.75x5m)
                  </Text>
                  <PriceList2 />
                  <Text
                    textAlign="center"
                    fontSize="1.5rem"
                    fontWeight="bold"
                    marginBottom="1.5rem"
                  >
                    Tamaño grande: 20.5m² (4.10x5m)
                  </Text>
                  <PriceList3 />
                </ModalBody>

                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Protección de Cuenta */}
            {!isAuthenticated ? (
              <Box
                maxW="620px"
                w="100%"
                mx="auto"
                my="2rem"
                p={[6, 8, 10]}
                bg="white"
                borderRadius="2xl"
                boxShadow="0 10px 30px rgba(0, 0, 0, 0.06)"
                border="1px solid #e2e8f0"
                textAlign="center"
              >
                <Flex
                  w="64px"
                  h="64px"
                  bg="#eff6ff"
                  color="#2563eb"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  mx="auto"
                  mb={5}
                  fontSize="26px"
                >
                  <FiLock />
                </Flex>
                <Heading as="h2" size="lg" color="#16284a" mb={3}>
                  Iniciá sesión para renovar tu alquiler
                </Heading>
                <Text color="gray.600" fontSize="md" mb={6} lineHeight="tall">
                  Para renovar tu contrato y vincularlo a tus boxes vigentes, por favor ingresá a tu cuenta o registrate si aún no lo hiciste.
                </Text>

                <Flex direction={['column', 'row']} gap={3} justify="center" mb={6}>
                  <Button
                    as={GatsbyLink}
                    to="/login?redirect=/renovar"
                    size="lg"
                    bg="#16284a"
                    color="white"
                    _hover={{ bg: '#0f1d38', transform: 'translateY(-1px)' }}
                    borderRadius="xl"
                    fontWeight="bold"
                    leftIcon={<FiLogIn />}
                    flex={1}
                  >
                    Ingresar a mi cuenta
                  </Button>
                  <Button
                    as={GatsbyLink}
                    to="/login?mode=register&redirect=/renovar"
                    size="lg"
                    variant="outline"
                    borderColor="#cbd5e1"
                    color="#16284a"
                    _hover={{ bg: 'gray.50', transform: 'translateY(-1px)' }}
                    borderRadius="xl"
                    fontWeight="bold"
                    leftIcon={<FiUserPlus />}
                    flex={1}
                  >
                    Crear cuenta nueva
                  </Button>
                </Flex>

                <Divider my={5} />

                <Text fontSize="sm" color="gray.500">
                  ¿Querés consultar valores antes de renovar?{' '}
                  <Button
                    variant="link"
                    color="#2563eb"
                    fontWeight="semibold"
                    fontSize="sm"
                    onClick={onOpen}
                  >
                    Ver precios vigentes
                  </Button>
                </Text>
              </Box>
            ) : (
              <>
                <Box
                  bg="#eff6ff"
                  border="1px solid #bfdbfe"
                  borderRadius="xl"
                  p={4}
                  mb={6}
                >
                  <Flex align="center" justify="space-between" wrap="wrap" gap={2}>
                    <HStack spacing={3}>
                      <Avatar size="sm" name={user?.name} bg="#16284a" color="white" />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" color="#16284a">
                          Renovando como: {user?.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {user?.email} {user?.dni ? `· DNI: ${user.dni}` : ''}
                        </Text>
                      </Box>
                    </HStack>
                    <Badge colorScheme="blue" fontSize="11px">
                      Cuenta verificada
                    </Badge>
                  </Flex>
                </Box>

                <Text fontSize="lg" px="2rem" mb="2rem">
                  Para solicitar la renovación de una unidad, completá el siguiente
                  formulario. Si tenes dudas, podes{' '}
                  <Link color="primary" to="/contacto">
                    enviarnos un mensaje
                  </Link>{' '}
                  o explorar{' '}
                  <Link color="primary" to="/faq">
                    las preguntas frecuentes
                  </Link>
                  .
                </Text>
                <Text
                  fontSize="lg"
                  px="2rem"
                  mb="1rem"
                  textAlign="center"
                  textTransform="uppercase"
                  fontWeight="bold"
                >
                  <Link
                    to="/precios"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault()
                      onOpen()
                    }}
                  >
                    Ver los precios vigentes
                  </Link>
                </Text>

                <Divider color="rgba(0, 0, 0, 0.2)" m="2rem" w="calc(100% - 4rem)" />

                <RenovarBoxForm />
              </>
            )}
          </>
        )}
      </Flex>
    </>
  )
}

export default RenovarPage
