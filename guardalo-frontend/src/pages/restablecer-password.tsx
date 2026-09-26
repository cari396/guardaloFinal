import React, { useState, useEffect } from 'react'
import { Link, navigate } from 'gatsby'
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Stack,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
} from '@chakra-ui/react'
import { useLocation } from '@reach/router'
import { FaCheckCircle, FaLock, FaEye, FaEyeSlash, FaHome, FaArrowRight } from 'react-icons/fa'
import { authApi } from '../services/api'
import Logo from '../components/Logo'
import SEO from '../components/Seo'

const RestablecerPasswordPage: React.FC = () => {
  const location = useLocation()
  const toast = useToast()

  const [token, setToken] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tokenParam = params.get('token')
    const emailParam = params.get('email')
    if (tokenParam) setToken(tokenParam)
    if (emailParam) setEmail(emailParam)
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !email) {
      toast({
        title: 'Enlace incompleto',
        description: 'Faltan parámetros de seguridad en el enlace.',
        status: 'error',
        duration: 4000,
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'Contraseña muy corta',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        status: 'warning',
        duration: 3500,
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Las contraseñas no coinciden',
        description: 'Verificá que ambas contraseñas coincidan exactamente.',
        status: 'warning',
        duration: 4000,
      })
      return
    }

    setLoading(true)
    try {
      const res = await authApi.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      })

      if (res.data && res.data.success) {
        setCompleted(true)
        toast({
          title: '¡Contraseña restablecida!',
          description: 'Tu clave se actualizó correctamente.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Error al restablecer',
          description: res.data?.message || 'El enlace es inválido o expiró.',
          status: 'error',
          duration: 4000,
        })
      }
    } catch (err: any) {
      toast({
        title: 'No se pudo actualizar',
        description: err?.response?.data?.message || 'El enlace ha expirado o ya fue utilizado.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Restablecer Contraseña - Guardalo.com" />
      <Flex minH="100vh" direction="column" bg="#F8FAFC">
        {/* Header */}
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
            maxW="440px"
            bg="white"
            borderRadius="2xl"
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
            border="1px solid"
            borderColor="gray.100"
            p={[6, 8, 10]}
          >
            {completed ? (
              <VStack spacing={6} textAlign="center" py={4}>
                <Flex
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="#ecfdf5"
                  align="center"
                  justify="center"
                  color="#10b981"
                  fontSize="36px"
                >
                  <FaCheckCircle />
                </Flex>
                <Box>
                  <Heading as="h2" size="md" color="#1E3264" mb={2}>
                    ¡Contraseña actualizada!
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Tu contraseña fue modificada exitosamente. Ya podés ingresar a tu cuenta con tu nueva clave.
                  </Text>
                </Box>
                <Button
                  bg="primary"
                  color="white"
                  size="md"
                  w="100%"
                  rightIcon={<FaArrowRight />}
                  _hover={{ bg: '#142347' }}
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
              </VStack>
            ) : !token ? (
              <VStack spacing={5} textAlign="center" py={4}>
                <Flex
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  bg="#fef2f2"
                  align="center"
                  justify="center"
                  color="#ef4444"
                  fontSize="28px"
                >
                  <FaLock />
                </Flex>
                <Box>
                  <Heading as="h2" size="md" color="gray.800" mb={2}>
                    Enlace no válido
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    El enlace para restablecer la contraseña no contiene el código de seguridad requerido o ha caducado.
                  </Text>
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
            ) : (
              <Box>
                <Box textAlign="center" mb={6}>
                  <Flex
                    w="56px"
                    h="56px"
                    borderRadius="full"
                    bg="#eff6ff"
                    align="center"
                    justify="center"
                    color="primary"
                    fontSize="24px"
                    mx="auto"
                    mb={3}
                  >
                    <FaLock />
                  </Flex>
                  <Heading as="h1" size="md" color="#1E3264" mb={2}>
                    Nueva Contraseña
                  </Heading>
                  <Text color="gray.500" fontSize="xs">
                    Ingresá tu nueva clave para la cuenta <strong>{email}</strong>
                  </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <FormControl id="email" isReadOnly>
                      <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                        Correo Electrónico
                      </FormLabel>
                      <Input
                        type="email"
                        variant="flushed"
                        value={email}
                        isReadOnly
                        bg="gray.50"
                        fontSize="sm"
                      />
                    </FormControl>

                    <FormControl id="password" isRequired>
                      <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                        Nueva Contraseña
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          variant="flushed"
                          placeholder="Mínimo 6 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          borderColor="primary"
                          focusBorderColor="primary"
                          fontSize="md"
                          pr="2.5rem"
                        />
                        <InputRightElement width="2.5rem">
                          <IconButton
                            h="1.75rem"
                            size="sm"
                            variant="ghost"
                            color="gray.400"
                            _hover={{ color: 'primary' }}
                            aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                            icon={showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl
                      id="confirmPassword"
                      isRequired
                      isInvalid={!!confirmPassword && password !== confirmPassword}
                    >
                      <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                        Confirmar Nueva Contraseña
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          variant="flushed"
                          placeholder="Repetí la contraseña"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          borderColor={
                            confirmPassword && password !== confirmPassword
                              ? 'red.400'
                              : confirmPassword && password === confirmPassword
                              ? 'green.400'
                              : 'primary'
                          }
                          focusBorderColor={
                            confirmPassword && password !== confirmPassword ? 'red.500' : 'primary'
                          }
                          fontSize="md"
                          pr="2.5rem"
                        />
                        <InputRightElement width="2.5rem">
                          <IconButton
                            h="1.75rem"
                            size="sm"
                            variant="ghost"
                            color="gray.400"
                            _hover={{ color: 'primary' }}
                            aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                            icon={showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {confirmPassword && password !== confirmPassword && (
                        <Text fontSize="2xs" color="red.500" mt={1}>
                          Las contraseñas no coinciden
                        </Text>
                      )}
                      {confirmPassword && password === confirmPassword && (
                        <Text fontSize="2xs" color="green.600" mt={1}>
                          ✓ Las contraseñas coinciden
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      bg="primary"
                      color="white"
                      size="md"
                      h="44px"
                      mt={3}
                      fontSize="sm"
                      fontWeight="bold"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      isLoading={loading}
                      _hover={{ bg: '#142347' }}
                    >
                      Actualizar Contraseña
                    </Button>
                  </Stack>
                </form>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default RestablecerPasswordPage
