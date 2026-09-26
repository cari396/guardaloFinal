import React, { useEffect, useState } from 'react'
import { Link, navigate } from 'gatsby'
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Container,
} from '@chakra-ui/react'
import { useLocation } from '@reach/router'
import { FaCheckCircle, FaExclamationCircle, FaEnvelope, FaArrowRight, FaHome } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import SEO from '../components/Seo'

const VerificarEmailPage: React.FC = () => {
  const location = useLocation()
  const { verifyEmail, resendVerification, isAuthenticated } = useAuth()
  const toast = useToast()

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [resendEmail, setResendEmail] = useState<string>('')
  const [resending, setResending] = useState<boolean>(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')

    if (!token) {
      setStatus('no-token')
      return
    }

    let isMounted = true

    const doVerify = async () => {
      try {
        const result = await verifyEmail(token)
        if (!isMounted) return

        if (result.success) {
          setStatus('success')
        } else {
          setStatus('error')
          setErrorMessage(result.message || 'El enlace de activación es inválido o ya ha expirado.')
        }
      } catch (err: any) {
        if (!isMounted) return
        setStatus('error')
        setErrorMessage('Ocurrió un error al intentar verificar la cuenta. Por favor intentá nuevamente.')
      }
    }

    doVerify()

    return () => {
      isMounted = false
    }
  }, [location.search])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail) {
      toast({
        title: 'Ingresá tu correo',
        description: 'Por favor escribí el email con el que te registraste.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setResending(true)
    try {
      const res = await resendVerification(resendEmail.trim())
      if (res.success) {
        toast({
          title: 'Enlace enviado',
          description: 'Te enviamos un nuevo enlace de activación. Revisá tu casilla de correo.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'No se pudo enviar',
          description: res.message || 'Verificá que el correo ingresado sea el correcto.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    } catch (err: any) {
      toast({
        title: 'Error de conexión',
        description: 'No pudimos conectar con el servidor.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <SEO title="Verificar Cuenta - Guardalo.com" />
      <Flex minH="100vh" direction="column" bg="#F8FAFC">
        {/* Navigation bar */}
        <Box bg="#1E3264" py={4} px={6} boxShadow="sm">
          <Container maxW="container.lg">
            <Flex justify="space-between" align="center">
              <Logo white={true} maxW="180px" />
              <Button
                as={Link}
                to="/"
                variant="ghost"
                color="white"
                size="sm"
                leftIcon={<FaHome />}
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Inicio
              </Button>
            </Flex>
          </Container>
        </Box>

        {/* Content Box */}
        <Flex flex="1" align="center" justify="center" p={6}>
          <Box
            w="100%"
            maxW="520px"
            bg="white"
            borderRadius="2xl"
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
            border="1px solid"
            borderColor="gray.100"
            p={[6, 8, 10]}
            textAlign="center"
          >
            {/* Status: Loading */}
            {status === 'loading' && (
              <VStack spacing={6} py={8}>
                <Spinner size="xl" thickness="4px" speed="0.75s" color="primary" />
                <Box>
                  <Heading as="h2" size="md" color="gray.800" mb={2}>
                    Activando tu cuenta...
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    Estamos validando tu enlace de seguridad en Guardalo.com
                  </Text>
                </Box>
              </VStack>
            )}

            {/* Status: Success */}
            {status === 'success' && (
              <VStack spacing={6}>
                <Flex
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="#ecfdf5"
                  align="center"
                  justify="center"
                  color="#10b981"
                  fontSize="38px"
                >
                  <FaCheckCircle />
                </Flex>

                <Box>
                  <Heading as="h2" size="lg" color="#1E3264" mb={2}>
                    ¡Cuenta activada con éxito!
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Tu correo ha sido verificado correctamente. Ya tenés acceso completo a Guardalo.com para alquilar y gestionar tus boxes.
                  </Text>
                </Box>

                <Button
                  bg="primary"
                  color="white"
                  size="lg"
                  w="100%"
                  rightIcon={<FaArrowRight />}
                  _hover={{ bg: '#142347' }}
                  onClick={() => navigate('/panel')}
                >
                  Ir a mi Panel
                </Button>
              </VStack>
            )}

            {/* Status: Error or Expired */}
            {status === 'error' && (
              <VStack spacing={6}>
                <Flex
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="#fef2f2"
                  align="center"
                  justify="center"
                  color="#ef4444"
                  fontSize="38px"
                >
                  <FaExclamationCircle />
                </Flex>

                <Box>
                  <Heading as="h2" size="md" color="gray.800" mb={2}>
                    Enlace inválido o expirado
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {errorMessage}
                  </Text>
                </Box>

                {/* Resend Form */}
                <Box w="100%" bg="#f8fafc" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={3} textAlign="left">
                    ¿Necesitás un nuevo enlace de activación?
                  </Text>
                  <form onSubmit={handleResend}>
                    <VStack spacing={3}>
                      <FormControl id="resend-email">
                        <Input
                          type="email"
                          size="sm"
                          bg="white"
                          placeholder="Tu correo electrónico"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        size="sm"
                        w="100%"
                        colorScheme="blue"
                        bg="primary"
                        leftIcon={<FaEnvelope />}
                        isLoading={resending}
                      >
                        Reenviar correo de activación
                      </Button>
                    </VStack>
                  </form>
                </Box>

                <HStack spacing={4} w="100%">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    size="md"
                    w="50%"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    as={Link}
                    to="/"
                    variant="ghost"
                    size="md"
                    w="50%"
                  >
                    Volver al Inicio
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* Status: No Token */}
            {status === 'no-token' && (
              <VStack spacing={6}>
                <Flex
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="#eff6ff"
                  align="center"
                  justify="center"
                  color="#3b82f6"
                  fontSize="38px"
                >
                  <FaEnvelope />
                </Flex>

                <Box>
                  <Heading as="h2" size="md" color="gray.800" mb={2}>
                    Verificación de Correo
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Para activar tu cuenta hacé clic directamente en el enlace que enviamos a tu casilla de correo.
                  </Text>
                </Box>

                {/* Resend Form */}
                <Box w="100%" bg="#f8fafc" p={4} borderRadius="xl" border="1px solid" borderColor="gray.200">
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={3} textAlign="left">
                    Solicitar enlace de activación:
                  </Text>
                  <form onSubmit={handleResend}>
                    <VStack spacing={3}>
                      <FormControl id="resend-email-notoken">
                        <Input
                          type="email"
                          size="sm"
                          bg="white"
                          placeholder="Tu correo electrónico"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        size="sm"
                        w="100%"
                        colorScheme="blue"
                        bg="primary"
                        leftIcon={<FaEnvelope />}
                        isLoading={resending}
                      >
                        Enviar enlace
                      </Button>
                    </VStack>
                  </form>
                </Box>

                <Button
                  as={Link}
                  to="/login"
                  colorScheme="blue"
                  bg="primary"
                  size="md"
                  w="100%"
                >
                  Ir a Iniciar Sesión
                </Button>
              </VStack>
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default VerificarEmailPage
