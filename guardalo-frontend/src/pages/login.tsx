import React, { useState } from 'react'
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
  Divider,
  HStack,
  VStack,
  Badge,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { useLocation } from '@reach/router'
import { FaArrowLeft, FaCheckCircle, FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import Logo from '../components/Logo'
import SEO from '../components/Seo'

const LoginPage: React.FC = () => {
  const { login, register, resendVerification, loginWithGoogle, isAuthenticated } = useAuth()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const modeParam = searchParams.get('mode')

  const [isRegister, setIsRegister] = useState(modeParam === 'register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [dni, setDni] = useState('')
  const [cuit, setCuit] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Chivilcoy')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const toast = useToast()

  React.useEffect(() => {
    if (modeParam === 'register') {
      setIsRegister(true)
    }
  }, [modeParam])

  React.useEffect(() => {
    if (isAuthenticated && redirectParam) {
      navigate(redirectParam)
    }
  }, [isAuthenticated, redirectParam])

  const destination = redirectParam || '/panel'

  const handleResendEmail = async (targetEmail: string) => {
    if (!targetEmail) return
    setResending(true)
    try {
      const res = await resendVerification(targetEmail)
      if (res.success) {
        toast({
          title: 'Enlace enviado',
          description: 'Te reenviamos el correo de activación. Revisá tu bandeja de entrada o spam.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'No se pudo enviar',
          description: res.message || 'Error al reenviar el correo.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    } catch (err: any) {
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setResending(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) {
      toast({
        title: 'Ingresá tu correo',
        description: 'Por favor completá tu email para recibir el enlace de recuperación.',
        status: 'warning',
        duration: 3000,
      })
      return
    }
    setForgotLoading(true)
    try {
      const res = await authApi.forgotPassword(forgotEmail.trim())
      setForgotSuccess(true)
      toast({
        title: 'Solicitud enviada',
        description: res.data?.message || 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.',
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
    } catch (err: any) {
      toast({
        title: 'Error al solicitar enlace',
        description: err?.response?.data?.message || 'Error de conexión con el servidor.',
        status: 'error',
        duration: 4000,
      })
    } finally {
      setForgotLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUnverifiedEmail(null)
    try {
      if (isRegister) {
        if (!name || !email || !password || !confirmPassword) {
          toast({
            title: 'Campos requeridos',
            description: 'Por favor completá todos los campos obligatorios.',
            status: 'warning',
            duration: 3000,
          })
          setLoading(false)
          return
        }
        if (password.length < 6) {
          toast({
            title: 'Contraseña muy corta',
            description: 'La contraseña debe tener al menos 6 caracteres.',
            status: 'warning',
            duration: 3500,
          })
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          toast({
            title: 'Las contraseñas no coinciden',
            description: 'Por favor asegurate de que ambas contraseñas coincidan.',
            status: 'warning',
            duration: 4000,
            isClosable: true,
          })
          setLoading(false)
          return
        }
        const result = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: confirmPassword,
          dni: dni.trim(),
          cuit: cuit.trim(),
          phone: phone.trim(),
          city: city.trim() || 'Chivilcoy',
        })
        if (!result.success) {
          toast({
            title: 'Error al registrarse',
            description: result.message || 'Verifica los datos ingresados.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          return
        }

        if (result.requires_verification) {
          setRegisteredEmail(result.email || email.trim())
          toast({
            title: '¡Cuenta registrada!',
            description: 'Te enviamos un enlace de activación a tu correo electrónico.',
            status: 'info',
            duration: 6000,
            isClosable: true,
          })
          return
        }

        toast({
          title: '¡Cuenta creada con éxito!',
          description: `Bienvenido a Guardalo.com, ${name}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        navigate(destination)
      } else {
        const result = await login(email, password)
        if (!result.success) {
          if (result.requires_verification) {
            setUnverifiedEmail(email.trim())
            toast({
              title: 'Cuenta pendiente de activación',
              description: 'Debés activar tu cuenta con el enlace que enviamos a tu correo.',
              status: 'warning',
              duration: 6000,
              isClosable: true,
            })
            return
          }
          toast({
            title: 'Error al ingresar',
            description: result.message || 'Verifica tu email y contraseña.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          return
        }
        toast({
          title: '¡Bienvenido!',
          description: 'Has ingresado correctamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        navigate(destination)
      }
    } catch (err: any) {
      toast({
        title: 'Error al procesar solicitud',
        description: err?.message || 'Verifica los datos ingresados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    const clientId =
      (typeof window !== 'undefined' && (window as any)._ENV_GOOGLE_CLIENT_ID) ||
      process.env.GATSBY_GOOGLE_CLIENT_ID

    if (!clientId) {
      toast({
        title: 'Configuración de Google pendiente',
        description:
          'Para habilitar el selector de cuentas de Google oficial en tu dominio, ingresá el Client ID de Google Cloud Console en config.js. Mientras tanto, podés registrarte e ingresar con tu Email y Contraseña.',
        status: 'info',
        duration: 7000,
        isClosable: true,
      })
      return
    }

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      setLoading(true)
      const google = (window as any).google
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            const success = await loginWithGoogle({ credential: response.credential })
            if (success) {
              toast({
                title: 'Sesión iniciada con Google',
                description: '¡Bienvenido a Guardalo.com!',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
              navigate(destination)
            }
          } catch (err: any) {
            toast({
              title: 'Error al iniciar sesión',
              description: err?.message || 'No se pudo validar la cuenta de Google.',
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
          } finally {
            setLoading(false)
          }
        },
      })
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setLoading(false)
        }
      })
    } else {
      toast({
        title: 'Cargando servicio de Google',
        description: 'Aguarde un instante mientras se conecta con Google Identity Services.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <SEO title={isRegister ? 'Registrarse' : 'Acceder'} />
      <Flex minH="100vh" w="100%" direction={['column', 'column', 'row']}>
        {/* Left Side: Storage Facility Background (Prototype Page 3) */}
        <Box
          w={['100%', '100%', '50%']}
          minH={['220px', '280px', '100vh']}
          bgImage="linear-gradient(rgba(14, 25, 48, 0.35), rgba(14, 25, 48, 0.45)), url('/images/storage-login.jpg')"
          bgSize="cover"
          bgPosition="center"
          position="relative"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={[6, 8, 12]}
        >
          {/* Back link */}
          <Box>
            <HStack
              as={Link}
              to="/"
              color="white"
              spacing={2}
              opacity={0.9}
              _hover={{ opacity: 1, textDecoration: 'underline' }}
              w="fit-content"
            >
              <FaArrowLeft size="14px" />
              <Text fontSize="sm" fontWeight="medium">
                Volver a Guardalo.com
              </Text>
            </HStack>
          </Box>

          {/* Logo overlay on bottom left */}
          <Box>
            <Logo white={true} maxW="240px" />
            <Text color="whiteAlpha.800" fontSize="sm" mt={2} maxW="340px">
              Alquiler de depósitos y bauleras inteligentes. Accedé a tus boxes y gestioná tus
              servicios.
            </Text>
          </Box>
        </Box>

        {/* Right Side: Auth Form (Prototype Page 3) */}
        <Flex
          w={['100%', '100%', '50%']}
          minH={['auto', 'auto', '100vh']}
          bg="white"
          alignItems="center"
          justifyContent="center"
          p={[6, 8, 12]}
        >
          <Box w="100%" maxW="380px" mx="auto">
            {isForgotPassword ? (
              <Box py={2}>
                <Box textAlign="center" mb={6}>
                  <Flex
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    bg="#eff6ff"
                    align="center"
                    justify="center"
                    color="#1E3264"
                    fontSize="26px"
                    mx="auto"
                    mb={3}
                  >
                    <FaLock />
                  </Flex>
                  <Heading as="h2" size="md" color="#1E3264" mb={2}>
                    Recuperar Contraseña
                  </Heading>
                  <Text color="gray.500" fontSize="xs">
                    Ingresá tu correo electrónico para recibir un enlace seguro de restablecimiento.
                  </Text>
                </Box>

                {forgotSuccess ? (
                  <VStack spacing={4} textAlign="center">
                    <Box bg="#ecfdf5" border="1px solid #a7f3d0" borderRadius="xl" p={4}>
                      <Text fontSize="xs" fontWeight="bold" color="#065f46" mb={1}>
                        ✓ ¡Correo de recuperación enviado!
                      </Text>
                      <Text fontSize="xs" color="#047857">
                        Revisá tu bandeja de entrada o spam. Hacé clic en el botón del correo para crear tu nueva clave.
                      </Text>
                    </Box>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsForgotPassword(false)
                        setForgotSuccess(false)
                      }}
                    >
                      ← Volver a Iniciar Sesión
                    </Button>
                  </VStack>
                ) : (
                  <form onSubmit={handleForgotPassword}>
                    <Stack spacing={4}>
                      <FormControl id="forgot-email" isRequired>
                        <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                          Correo Electrónico
                        </FormLabel>
                        <Input
                          type="email"
                          variant="flushed"
                          placeholder="email@ejemplo.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          borderColor="primary"
                          focusBorderColor="primary"
                          fontSize="md"
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        bg="primary"
                        color="white"
                        size="md"
                        h="44px"
                        mt={2}
                        fontSize="sm"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        isLoading={forgotLoading}
                        _hover={{ bg: '#142347' }}
                      >
                        Enviar Enlace
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        color="gray.600"
                        onClick={() => setIsForgotPassword(false)}
                      >
                        ← Volver a Iniciar Sesión
                      </Button>
                    </Stack>
                  </form>
                )}
              </Box>
            ) : registeredEmail ? (
              <Box textAlign="center" py={4}>
                <Flex
                  w="72px"
                  h="72px"
                  borderRadius="full"
                  bg="#eff6ff"
                  color="#1E3264"
                  mx="auto"
                  mb={4}
                  align="center"
                  justify="center"
                  fontSize="32px"
                  boxShadow="sm"
                >
                  <FaEnvelope />
                </Flex>
                <Heading as="h2" size="md" color="#1E3264" mb={2}>
                  ¡Revisá tu correo para activar tu cuenta!
                </Heading>
                <Text color="gray.600" fontSize="sm" mb={4} lineHeight="tall">
                  Enviamos un enlace de activación a <strong>{registeredEmail}</strong>. Hacé clic en el enlace para validar tu email y poder ingresar a tu cuenta.
                </Text>
                <Box
                  bg="#f8fafc"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  p={3}
                  mb={5}
                  fontSize="xs"
                  color="gray.600"
                  textAlign="left"
                >
                  💡 <strong>¿No encontrás el correo?</strong> Revisá en tu carpeta de Correo no deseado o Spam. Si aún no te llega, podés solicitar uno nuevo.
                </Box>
                <VStack spacing={3}>
                  <Button
                    variant="outline"
                    size="md"
                    borderColor="#1E3264"
                    color="#1E3264"
                    w="100%"
                    leftIcon={<FaEnvelope />}
                    isLoading={resending}
                    onClick={() => handleResendEmail(registeredEmail)}
                  >
                    Reenviar correo de activación
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    color="gray.600"
                    w="100%"
                    onClick={() => {
                      setRegisteredEmail(null)
                      setIsRegister(false)
                    }}
                  >
                    Volver al Inicio de Sesión
                  </Button>
                </VStack>
              </Box>
            ) : (
              <>
                <Box textAlign="center" mb={6}>
                  <Heading
                    as="h1"
                    fontSize={['2xl', '3xl']}
                    fontWeight="bold"
                    letterSpacing="widest"
                    color="primary"
                    textTransform="uppercase"
                    mb={2}
                  >
                    {isRegister ? 'REGISTRARSE' : 'ACCEDER'}
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    {isRegister
                      ? 'Completá tus datos para crear una nueva cuenta'
                      : 'Ingresá a tu cuenta para gestionar tus boxes'}
                  </Text>
                </Box>

                {redirectParam === '/alquilar' && (
                  <Box bg="#eff6ff" border="1px solid #bfdbfe" borderRadius="xl" p={3} mb={5} textAlign="center">
                    <Text fontSize="xs" fontWeight="bold" color="#1d4ed8">
                      🔒 {isRegister ? 'Creá tu cuenta' : 'Iniciá sesión'} para continuar con el alquiler de tu box
                    </Text>
                  </Box>
                )}

                {redirectParam === '/renovar' && (
                  <Box bg="#eff6ff" border="1px solid #bfdbfe" borderRadius="xl" p={3} mb={5} textAlign="center">
                    <Text fontSize="xs" fontWeight="bold" color="#1d4ed8">
                      🔒 {isRegister ? 'Creá tu cuenta' : 'Iniciá sesión'} para renovar tu alquiler
                    </Text>
                  </Box>
                )}

                {unverifiedEmail && !isRegister && (
                  <Box bg="#fffbeb" border="1px solid #fde68a" borderRadius="xl" p={4} mb={5}>
                    <Text fontSize="xs" fontWeight="semibold" color="#b45309" mb={2}>
                      ⚠️ Tu cuenta todavía no fue activada. Por favor revisá tu correo o solicitá un nuevo enlace:
                    </Text>
                    <Button
                      size="xs"
                      colorScheme="orange"
                      variant="solid"
                      w="100%"
                      leftIcon={<FaEnvelope />}
                      isLoading={resending}
                      onClick={() => handleResendEmail(unverifiedEmail)}
                    >
                      Reenviar correo de activación
                    </Button>
                  </Box>
                )}

                <form onSubmit={handleLogin}>
                  <Stack spacing={4}>
                {isRegister && (
                  <>
                    <FormControl id="name" isRequired>
                      <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                        Nombre completo
                      </FormLabel>
                      <Input
                        variant="flushed"
                        placeholder="Tu nombre y apellido"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        borderColor="primary"
                        focusBorderColor="primary"
                        fontSize="md"
                      />
                    </FormControl>

                    <HStack spacing={4}>
                      <FormControl id="dni">
                        <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                          Número de DNI
                        </FormLabel>
                        <Input
                          variant="flushed"
                          type="text"
                          inputMode="numeric"
                          placeholder="ej: 34567890"
                          value={dni}
                          onChange={(e) => setDni(e.target.value)}
                          borderColor="primary"
                          focusBorderColor="primary"
                          fontSize="md"
                        />
                      </FormControl>

                      <FormControl id="cuit">
                        <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                          CUIT / CUIL (Opcional)
                        </FormLabel>
                        <Input
                          variant="flushed"
                          type="text"
                          inputMode="numeric"
                          placeholder="ej: 20-34567890-4"
                          value={cuit}
                          onChange={(e) => setCuit(e.target.value)}
                          borderColor="primary"
                          focusBorderColor="primary"
                          fontSize="md"
                        />
                      </FormControl>
                    </HStack>

                    <HStack spacing={4}>
                      <FormControl id="phone">
                        <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                          Teléfono / Celular
                        </FormLabel>
                        <Input
                          variant="flushed"
                          type="text"
                          inputMode="tel"
                          placeholder="02346 15-55-1234"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          borderColor="primary"
                          focusBorderColor="primary"
                          fontSize="md"
                        />
                      </FormControl>

                      <FormControl id="city">
                        <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                          Localidad
                        </FormLabel>
                        <Input
                          variant="flushed"
                          placeholder="Chivilcoy"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          borderColor="primary"
                          focusBorderColor="primary"
                          fontSize="md"
                        />
                      </FormControl>
                    </HStack>
                  </>
                )}

                <FormControl id="email" isRequired>
                  <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    variant="flushed"
                    placeholder="email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor="primary"
                    focusBorderColor="primary"
                    fontSize="md"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                    Contraseña
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      variant="flushed"
                      placeholder={isRegister ? 'Mínimo 6 caracteres' : '••••••••••••'}
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
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        icon={showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {isRegister && (
                  <FormControl
                    id="confirmPassword"
                    isRequired
                    isInvalid={!!confirmPassword && password !== confirmPassword}
                  >
                    <FormLabel fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
                      Confirmar Contraseña
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="flushed"
                        placeholder="Repetí tu contraseña"
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
                          aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
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
                )}

                {!isRegister && (
                  <Flex justify="flex-end">
                    <Text
                      as="a"
                      href="#recuperar"
                      fontSize="xs"
                      color="gray.500"
                      _hover={{ color: 'primary', textDecoration: 'underline' }}
                      onClick={(e) => {
                        e.preventDefault()
                        setIsForgotPassword(true)
                        setForgotEmail(email)
                        setForgotSuccess(false)
                      }}
                    >
                      Olvidé mi contraseña
                    </Text>
                  </Flex>
                )}

                <Button
                  type="submit"
                  isLoading={loading}
                  bg="primary"
                  color="white"
                  h="44px"
                  mt={2}
                  fontSize="sm"
                  fontWeight="bold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  _hover={{ bg: '#142347', transform: 'translateY(-1px)' }}
                  _active={{ bg: '#0e1933' }}
                  boxShadow="sm"
                  w="100%"
                >
                  {isRegister ? 'Crear Cuenta' : 'Acceder'}
                </Button>
              </Stack>
            </form>

            {/* Divider */}
            <Flex align="center" my={5}>
              <Divider borderColor="gray.300" />
              <Text px={3} fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                o bien
              </Text>
              <Divider borderColor="gray.300" />
            </Flex>

            {/* Google Sign In (Solo Google) */}
            <Button
              leftIcon={<FcGoogle size={20} />}
              bg="white"
              color="#3c4043"
              border="1px solid"
              borderColor="#dadce0"
              h="44px"
              fontSize="sm"
              fontWeight="semibold"
              _hover={{ bg: '#f8fafd', borderColor: '#c2e7ff', boxShadow: '0 1px 3px rgba(60,64,67,0.15)' }}
              _active={{ bg: '#f1f3f4' }}
              w="100%"
              boxShadow="0 1px 2px rgba(60,64,67,0.08)"
              onClick={handleGoogle}
              isLoading={loading}
            >
              Continuar con Google
            </Button>

            {/* Bottom Register Prompt */}
            <Box textAlign="center" mt={6}>
              <Text fontSize="sm" color="gray.600">
                {isRegister ? '¿Ya tenés una cuenta?' : '¿Todavía no tenés una cuenta?'}{' '}
                <Text
                  as="span"
                  color="primary"
                  fontWeight="bold"
                  cursor="pointer"
                  _hover={{ textDecoration: 'underline' }}
                  onClick={() => {
                    setIsRegister(!isRegister)
                    setConfirmPassword('')
                    setUnverifiedEmail(null)
                  }}
                >
                  {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
                </Text>
              </Text>
            </Box>
          </>
        )}
      </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default LoginPage
