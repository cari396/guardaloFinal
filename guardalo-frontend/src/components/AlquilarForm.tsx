import React, { useEffect, useRef, useState } from 'react'
import { useFormContext, SubmitHandler, useWatch } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Box,
  Flex,
  Stack,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  InputProps,
  Checkbox,
  useDisclosure,
  Divider,
  Select,
  Button,
  StackProps,
  SimpleGrid,
  ModalBody,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  UnorderedList,
  ListItem,
  Badge,
  HStack,
  VStack,
  useToast,
  Icon,
} from '@chakra-ui/react'

import axios, { AxiosPromise } from 'axios'
import TosText from './TosText'
import DatePicker from './DatePicker'
import usePricesList from '../hooks/usePriceList'
import usePricesList2 from '../hooks/usePriceList2'
import usePricesList3 from '../hooks/usePriceList3'
import PaymentImages from './PaymentImages'
import { headerHeight } from './Header'
import useGlobalState from '../hooks/useGlobalState'
import { useAuth } from '../context/AuthContext'
import { boxApi, API_BASE_URL, getApiBaseUrl } from '../services/api'
import PaymentMethodSelector, { PaymentMethodData } from './PaymentMethodSelector'
import { FaCheckCircle, FaFilePdf, FaExternalLinkAlt, FaCreditCard, FaUniversity, FaArrowRight, FaUser, FaBoxOpen } from 'react-icons/fa'
import { SiMercadopago } from 'react-icons/si'
import { navigate } from 'gatsby'
import { MdAirlineSeatIndividualSuite } from 'react-icons/md'


const InputContainer: React.FC<StackProps> = ({ children, ...props }) => (
  <Stack
    w={['100%', '100%', '480px']}
    flexDirection="column"
    flexWrap="nowrap"
    spacing="3rem"
    px="1rem"
    {...props}
  >
    {children}
  </Stack>
)
const inputCommonProps: Partial<InputProps> = {
  minW: '100%',
  variant: 'flushed',
  borderColor: 'text',
  borderBottomWidth: '1px',
  focusBorderColor: 'primary',
  color: 'text',
  _placeholder: { color: 'rgba(0, 0, 0, 0.35)' },
  _active: { color: 'primary' },
  _focus: { color: 'primary' },
  _disabled: { color: 'text' },
}

type FormFields = {
  name: string
  last_name: string
  dni: string
  cellphone: string
  phone: string
  address: string
  city: string
  email: string
  message: string
  payment: string
  cuit: string
  factura: 'A' | 'B' | 'C'
  tos: string
  size: string
  time: number
  start: Date
  end: Date
  price: number
}

const sendMessage = (data: FormFields, paymentInfo?: PaymentMethodData): AxiosPromise => {
  const s = new Date(data.start.toString()).setUTCHours(12, 0, 0, 0)
  const start = new Date(s).toLocaleDateString('es-AR')

  const e = new Date(data.end.toString()).setUTCHours(12, 0, 0, 0)
  const end = new Date(e).toLocaleDateString('es-AR')

  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('last_name', data.last_name)
  formData.append('dni', data.dni)
  formData.append('cellphone', data.cellphone)
  formData.append('phone', data.phone || '')
  formData.append('address', data.address)
  formData.append('city', data.city)
  formData.append('email', data.email)
  formData.append('message', data.message || '')
  formData.append('cuit', data.cuit)
  formData.append('factura', data.factura)
  formData.append('tos', data.tos)
  formData.append('size', data.size)
  formData.append('time', data.time.toString())
  formData.append('start', start)
  formData.append('end', end)
  formData.append('price', data.price.toString())

  if (paymentInfo) {
    if (paymentInfo.method === 'transferencia') {
      formData.append('payment', 'Transferencia Bancaria')
      if (paymentInfo.transferReference) {
        formData.append('transfer_reference', paymentInfo.transferReference)
      }
      if (paymentInfo.receiptFile) {
        formData.append('receipt_file', paymentInfo.receiptFile)
      }
    } else {
      formData.append('payment', 'Mercado Pago')
    }
  } else {
    formData.append('payment', data.payment || 'Mercado Pago')
  }

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('guardalo_token') || localStorage.getItem('guardalo_auth_token')
    : null
  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  }
  if (token) {
    formData.append('auth_token', token)
    headers['Authorization'] = `Bearer ${token}`
  }

  const endpoint = `${getApiBaseUrl()}/alquilar`

  return axios({
    method: 'post',
    url: endpoint,
    data: formData,
    headers,
  })
}

const _stepsValidation = [
  ['name', 'last_name', 'dni', 'cellphone', 'phone', 'address', 'city', 'email'],
  ['tos'],
]

const stepsValidation = [
  ..._stepsValidation,
  [..._stepsValidation[0], 'size', 'cuit', 'time', 'start', 'end', 'price'],
]

const paymentMethods = [
  'Visa',
  'Visa Débito',
  'Mastercard',
  'Mastercard Débito',
  'MercadoPago',
  'Transferencia bancaria',
  'Efectivo',
  'Cabal credito',
  'Cabal debito',
  'Tarjeta maestro'
]

const getDateNthDayFromToday = (day: number): Date => {
  return new Date(new Date().setDate(new Date().getDate() + day))
}

const AlquilarForm: React.FC = () => {
  const [sending, setSending] = useState(false)
  const [stepError, setStepError] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [step, setStep] = useState(0)
  const [tomorrow] = useState<Date>(getDateNthDayFromToday(0))
  const [values, setValues] = useState<FormFields | null>(null)
  const stepDisplayRef = useRef<HTMLParagraphElement>(null)
  const toast = useToast()

  const [paymentData, setPaymentData] = useState<PaymentMethodData>({
    method: 'mercadopago',
    transferReference: '',
  })
  const [completedResult, setCompletedResult] = useState<any | null>(null)

  const prices = usePricesList()
  const prices2 = usePricesList2()
  const prices3 = usePricesList3()
  const { setPdfUrl } = useGlobalState()

  const [availability, setAvailability] = useState<Record<string, { total: number; available: number }>>({})

  useEffect(() => {
    boxApi
      .getAvailability()
      .then((res) => {
        if (res.data && res.data.availability) {
          setAvailability(res.data.availability)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!stepDisplayRef.current || typeof window === 'undefined') {
      return
    }
    const rect = stepDisplayRef.current.getBoundingClientRect()
    const targetY = rect.top + window.pageYOffset - headerHeight - 20
    window.scrollTo({
      top: Math.max(0, targetY),
      left: 0,
      behavior: 'smooth',
    })
  }, [step])

  const {
    formState,
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    setValue,
    getValues,
    control,
  } = useFormContext()

  const watched = useWatch({
    control,
    name: ['start', 'time', 'end', 'size'],
    defaultValue: [undefined, undefined, undefined, 'Tamaño mediano'],
  })
  const watchFields = Array.isArray(watched) ? watched : []
  const watchStart = watchFields[0]
  const watchTime = watchFields[1]
  const watchEnd = watchFields[2]
  const watchSize = watchFields[3] || 'Tamaño mediano'

  useEffect(() => {
    const selectedSize = watchSize || 'Tamaño mediano'
    const currentList = selectedSize.includes('pequeño')
      ? prices
      : selectedSize.includes('grande')
      ? prices3
      : prices2

    if (watchTime) {
      const days = parseInt(watchTime)
      const found = currentList.find(
        (i) =>
          i.key === days ||
          (days >= 90 && (i.key === 90 || i.key === 100)) ||
          (days >= 180 && (i.key === 180 || i.key === 210))
      )
      const newPrice = found ? found.price : ''
      setValue('price', newPrice)

      if (watchStart) {
        const startDay = new Date(watchStart)
        const endDay = new Date(startDay.getTime())
        endDay.setUTCHours(12, 0, 0, 0)
        endDay.setDate(startDay.getDate() + days)
        endDay.setDate(endDay.getDate() - 1)
        setValue('end', endDay)
      }
    }
  }, [watchStart, watchTime, watchSize, prices, prices2, prices3, setValue])

  useEffect(() => {
    setValues(getValues() as FormFields)
  }, [isOpen])

  const { errors, isSubmitSuccessful } = formState
  const { user } = useAuth()

  useEffect(() => {
    if (user && setValue) {
      const parts = (user.name || '').trim().split(' ')
      const firstName = parts[0] || user.name || ''
      const lastName = parts.slice(1).join(' ') || ''
      setValue('name', firstName, { shouldValidate: true, shouldDirty: true })
      setValue('last_name', lastName, { shouldValidate: true, shouldDirty: true })
      setValue('email', user.email || '', { shouldValidate: true, shouldDirty: true })
      const cleanDni = user.dni ? user.dni.replace(/\D/g, '') : ''
      setValue('dni', cleanDni, { shouldValidate: true, shouldDirty: true })
      setValue('cellphone', user.phone || '', { shouldValidate: true, shouldDirty: true })
      setValue('phone', user.phone || '', { shouldValidate: true, shouldDirty: true })
      setValue('address', user.address || '', { shouldValidate: true, shouldDirty: true })
      setValue('city', user.city || 'Chivilcoy', { shouldValidate: true, shouldDirty: true })
      setValue('tos', 'true', { shouldValidate: true, shouldDirty: true })
      if (user.cuit) {
        setValue('cuit', user.cuit, { shouldValidate: true, shouldDirty: true })
      }
      // If user is already authenticated, jump straight to Box selection (Step 2)
      setStep((currentStep) => (currentStep === 0 ? 2 : currentStep))
    }
  }, [user, setValue])

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (sending) {
      return
    }

    // Card validations if card method selected
    if (paymentData.method === 'tarjeta') {
      const cleanNum = (paymentData.cardNumber || '').replace(/\D/g, '')
      if (cleanNum.length < 13) {
        toast({
          title: 'Número de tarjeta incompleto',
          description: 'Por favor, ingresá los 16 dígitos de tu tarjeta para procesar el pago.',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        return
      }
      if (!paymentData.cardHolder || paymentData.cardHolder.trim().length < 3) {
        toast({
          title: 'Nombre del titular requerido',
          description: 'Ingresá el nombre y apellido como figura en el plástico.',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        return
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        toast({
          title: 'Código CVV incompleto',
          description: 'Ingresá los dígitos de seguridad de tu tarjeta.',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        return
      }
    }

    setSending(true)

    try {
      const response = await sendMessage(data, paymentData)
      setSending(false)
      const resData = response?.data
      setCompletedResult(resData)

      const contractUrl = resData?.url || resData?.contract_url

      if (resData?.mercadopago?.init_point) {
        toast({
          title: 'Conectando con Mercado Pago',
          description: 'Se abrirá la pasarela oficial para abonar tu alquiler.',
          status: 'info',
          duration: 6000,
          isClosable: true,
        })
        if (typeof window !== 'undefined') {
          window.open(resData.mercadopago.init_point, '_blank')
        }
      } else if (resData?.card) {
        toast({
          title: '¡Pago con Tarjeta Aprobado!',
          description: `Autorización: ${resData.card.authorization_code}. Tu box fue asignado.`,
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
      } else if (resData?.bank) {
        toast({
          title: '¡Reserva de Box Registrada!',
          description: 'Completá la transferencia a los datos bancarios indicados.',
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
      }

      if (contractUrl) {
        setPdfUrl(contractUrl)
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || 'Ocurrió un error. Por favor, intentalo nuevamente.'
      toast({
        title: 'Error al procesar el pago',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setError('submit', { type: 'manual', message: errorMsg })
      setSending(false)
    }
  }

  const buttonText = (() => {
    if (sending) {
      return paymentData.method === 'mercadopago'
        ? 'Conectando con Mercado Pago...'
        : 'Registrando reserva...'
    }
    if (completedResult) {
      return '¡Alquiler procesado!'
    }
    if (paymentData.method === 'mercadopago') {
      const totalAmount = Math.round((Number(values?.price || 0)) * 1.21)
      return `Pagar $${totalAmount.toLocaleString('es-AR')} con Mercado Pago`
    }
    return 'Confirmar Reserva por Transferencia'
  })()

  return (
    <>
      <Flex
        w="100%"
        direction="column"
        wrap="nowrap"
        align="center"
        justifyContent="center"
        pb="4rem"
      >
        {user && (
          <Box
            bg="blue.50"
            border="1px solid #bfdbfe"
            p={4}
            borderRadius="md"
            mb={6}
            w={['100%', '100%', '480px']}
          >
            <Flex justify="space-between" align="center" mb={1}>
              <Text fontWeight="bold" color="primary" fontSize="sm">
                👤 Alquilando con tu cuenta
              </Text>
              <Badge colorScheme="green">Datos Verificados</Badge>
            </Flex>
            <Text fontSize="xs" color="gray.700">
              <strong>{user.name}</strong> {user.dni ? `· DNI: ${user.dni}` : ''}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {user.email} {user.phone ? `· ${user.phone}` : ''} {user.city ? `· ${user.city}` : ''}
            </Text>
            <HStack spacing={4} mt={2}>
              <Text
                fontSize="11px"
                color="blue.600"
                cursor="pointer"
                fontWeight="semibold"
                textDecoration="underline"
                onClick={() => setStep(step === 0 ? 2 : 0)}
              >
                {step === 0 ? '← Continuar a Selección de Box' : '✏️ Modificar datos personales para este alquiler'}
              </Text>
            </HStack>
          </Box>
        )}
        {/* Interactive Visual Stepper */}
        <Flex
          w={['100%', '100%', '520px']}
          align="center"
          justify="space-between"
          mb="2.5rem"
          px={4}
          ref={stepDisplayRef}
        >
          {/* Step 1 */}
          <Flex
            direction="column"
            align="center"
            cursor="pointer"
            onClick={() => setStep(0)}
            opacity={step === 0 ? 1 : 0.8}
            transition="all 0.2s"
          >
            <Flex
              w="36px"
              h="36px"
              borderRadius="full"
              bg={step === 0 ? 'primary' : step > 0 || user ? 'green.500' : 'gray.300'}
              color="white"
              align="center"
              justify="center"
              fontWeight="bold"
              fontSize="sm"
              boxShadow={step === 0 ? '0 0 0 3px rgba(30, 50, 100, 0.2)' : 'none'}
            >
              {step > 0 || user ? '✓' : '1'}
            </Flex>
            <Text fontSize="xs" fontWeight={step === 0 ? 'bold' : 'medium'} color="primary" mt={1.5}>
              1. Tus Datos
            </Text>
          </Flex>

          <Box flex="1" h="2px" bg={step >= 1 || (user && step === 2) ? 'green.500' : 'gray.200'} mx={3} mb="20px" />

          {/* Step 2 */}
          <Flex
            direction="column"
            align="center"
            cursor="pointer"
            onClick={async () => {
              const valid = await trigger(stepsValidation[0])
              if (valid) setStep(1)
            }}
            opacity={step === 1 ? 1 : 0.8}
            transition="all 0.2s"
          >
            <Flex
              w="36px"
              h="36px"
              borderRadius="full"
              bg={step === 1 ? 'primary' : step > 1 || (user && step === 2) ? 'green.500' : 'gray.300'}
              color="white"
              align="center"
              justify="center"
              fontWeight="bold"
              fontSize="sm"
              boxShadow={step === 1 ? '0 0 0 3px rgba(30, 50, 100, 0.2)' : 'none'}
            >
              {step > 1 || (user && step === 2) ? '✓' : '2'}
            </Flex>
            <Text fontSize="xs" fontWeight={step === 1 ? 'bold' : 'medium'} color="primary" mt={1.5}>
              2. Términos
            </Text>
          </Flex>

          <Box flex="1" h="2px" bg={step === 2 ? 'primary' : 'gray.200'} mx={3} mb="20px" />

          {/* Step 3 */}
          <Flex
            direction="column"
            align="center"
            cursor="pointer"
            onClick={async () => {
              const valid = await trigger(stepsValidation[0])
              if (valid) setStep(2)
            }}
            opacity={step === 2 ? 1 : 0.8}
            transition="all 0.2s"
          >
            <Flex
              w="36px"
              h="36px"
              borderRadius="full"
              bg={step === 2 ? 'primary' : 'gray.300'}
              color="white"
              align="center"
              justify="center"
              fontWeight="bold"
              fontSize="sm"
              boxShadow={step === 2 ? '0 0 0 3px rgba(30, 50, 100, 0.2)' : 'none'}
            >
              3
            </Flex>
            <Text fontSize="xs" fontWeight={step === 2 ? 'bold' : 'medium'} color="primary" mt={1.5}>
              3. Box y Pago
            </Text>
          </Flex>
        </Flex>
        {step === 0 ? (
          <InputContainer>
            <FormControl id="name" isInvalid={errors.name}>
              <Input
                {...inputCommonProps}
                type="text"
                autoComplete="given-name"
                placeholder="Nombre"
                aria-label="Nombre"
                disabled={isSubmitSuccessful}
                {...register('name', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="last_name" isInvalid={errors.last_name}>
              <Input
                {...inputCommonProps}
                type="text"
                autoComplete="family-name"
                placeholder="Apellido"
                aria-label="Apellido"
                disabled={isSubmitSuccessful}
                {...register('last_name', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="dni" isInvalid={errors.dni}>
              <Input
                {...inputCommonProps}
                type="text"
                inputMode="numeric"
                placeholder="Número de DNI (Documento de Identidad)"
                aria-label="Número de DNI"
                disabled={isSubmitSuccessful}
                {...register('dni', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="cellphone" isInvalid={errors.cellphone}>
              <Input
                {...inputCommonProps}
                type="text"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Número de teléfono móvil"
                aria-label="Número de teléfono movil"
                disabled={isSubmitSuccessful}
                {...register('cellphone', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="phone" isInvalid={errors.phone}>
              <Input
                {...inputCommonProps}
                type="text"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Número de teléfono fijo"
                aria-label="Número de teléfono fijo"
                disabled={isSubmitSuccessful}
                {...register('phone', { required: false })}
              />
            </FormControl>

            <FormControl id="address" isInvalid={errors.address}>
              <Input
                {...inputCommonProps}
                type="text"
                autoComplete="street-address"
                placeholder="Domicilio"
                aria-label="Domicilio"
                disabled={isSubmitSuccessful}
                {...register('address', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="city" isInvalid={errors.city}>
              <Input
                {...inputCommonProps}
                type="text"
                autoComplete="address-level2"
                placeholder="Localidad"
                aria-label="Localidad"
                disabled={isSubmitSuccessful}
                {...register('city', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="email" isInvalid={errors.email}>
              <Input
                {...inputCommonProps}
                type="text"
                autoComplete="email"
                placeholder="e-mail"
                aria-label="e-mail"
                disabled={isSubmitSuccessful}
                {...register('email', {
                  required: true,
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                })}
              />
              <FormErrorMessage>
                {errors.email
                  ? errors.email.type === 'required'
                    ? 'Este campo es obligatorio'
                    : null || errors.email.type === 'pattern'
                    ? 'La dirección de correo electrónico no es válida'
                    : null
                  : null}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="message" isInvalid={errors.message}>
              <Input
                as={TextareaAutosize}
                {...inputCommonProps}
                aria-label="Mensaje (opcional)"
                placeholder="Mensaje (opcional)"
                resize="none"
                lineHeight={10}
                minRows={1}
                overflow="hidden"
                w="100%"
                disabled={isSubmitSuccessful}
                {...register('message', { required: false })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>
          </InputContainer>
        ) : null}

        {step === 1 ? (
          <Box px="2rem">
            <TosText titleProps={{ fontSize: 'xl' }} />
            <FormControl id="tos">
              <Checkbox
                isInvalid={errors.tos}
                disabled={isSubmitSuccessful}
                borderColor="text"
                color={errors.tos ? 'red !important' : 'text'}
                sx={{
                  '[aria-hidden=true][data-checked]': {
                    background: 'primary',
                    borderColor: 'primary',
                  },
                }}
                _checked={{
                  background: 'red !important',
                }}
                {...register('tos', { required: true })}
              >
                Acepto los Términos y Condiciones de Servicio
              </Checkbox>
            </FormControl>
          </Box>
        ) : null}

        {step === 2 ? (
          <InputContainer>
            <FormControl id="size" isInvalid={errors.size}>
              <Text fontWeight="medium" mb={1}>Tamaño del box:</Text>
              <Select
                {...inputCommonProps}
                cursor="pointer"
                sx={{ '> option': { bg: 'white', color: '#2d3748' } }}
                placeholder="Seleccioná el tamaño del box"
                aria-label="Tamaño del box"
                disabled={isSubmitSuccessful}
                {...register('size', { required: true })}
              >
                <option
                  value="Tamaño pequeño"
                  disabled={Boolean(availability['Pequeño'] && availability['Pequeño'].available <= 0)}
                >
                  Tamaño pequeño: 8.3m² (1.66x5m)
                  {availability['Pequeño']
                    ? availability['Pequeño'].available <= 0
                      ? ' — ¡AGOTADO!'
                      : ` (${availability['Pequeño'].available} disponibles)`
                    : ''}
                </option>
                <option
                  value="Tamaño mediano"
                  disabled={Boolean(availability['Mediano'] && availability['Mediano'].available <= 0)}
                >
                  Tamaño mediano: 13.75m² (2.75x5m)
                  {availability['Mediano']
                    ? availability['Mediano'].available <= 0
                      ? ' — ¡AGOTADO!'
                      : ` (${availability['Mediano'].available} disponibles)`
                    : ''}
                </option>
                <option
                  value="Tamaño grande"
                  disabled={Boolean(availability['Grande'] && availability['Grande'].available <= 0)}
                >
                  Tamaño grande: 20.5m² (4.10x5m)
                  {availability['Grande']
                    ? availability['Grande'].available <= 0
                      ? ' — ¡AGOTADO!'
                      : ` (${availability['Grande'].available} disponibles)`
                    : ''}
                </option>
              </Select>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="time" isInvalid={errors.time}>
              <Text fontWeight="medium" mb={1}>Duración de alquiler:</Text>
              <Select
                {...inputCommonProps}
                cursor="pointer"
                sx={{ '> option': { bg: 'white', color: '#2d3748' } }}
                placeholder="Seleccioná el tiempo de alquiler"
                aria-label="Tiempo de alquiler"
                disabled={isSubmitSuccessful}
                {...register('time', { required: true })}
              >
                {(
                  watchSize && watchSize.includes('pequeño')
                    ? prices
                    : watchSize && watchSize.includes('grande')
                    ? prices3
                    : prices2
                ).map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.text}: ${p.price.toLocaleString('es-AR')} + IVA(21%){p.promo ? ` (${p.promo})` : ''}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="price" display="none">
              <Input type="hidden" readOnly defaultValue="" {...register('price')} />
            </FormControl>

            <FormControl id="start" isInvalid={errors.start}>
              <Text>Seleccioná el primer día de alquiler:</Text>
              <Flex w="100%" justify="center" mt="1rem">
                <DatePicker
                  control={control}
                  disabledDays={{ before: tomorrow, after: getDateNthDayFromToday(31) }}
                  highlightTo={watchEnd}
                  disabled={isSubmitSuccessful}
                />
              </Flex>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>
            <FormControl id="end">
              <Input readOnly type="hidden" defaultValue="" {...register('end')} />
            </FormControl>

            <Divider color="rgba(0, 0, 0, 0.2)" />

            <PaymentMethodSelector
              amount={Number(getValues('price') || values?.price || 0)}
              value={paymentData}
              onChange={(newData) => {
                setPaymentData(newData)
                const methodLabel =
                  newData.method === 'transferencia'
                    ? 'Transferencia Bancaria'
                    : 'Mercado Pago'
                setValue('payment', methodLabel)
              }}
              onMercadoPagoClick={() => {
                clearErrors('submit')
                handleSubmit(onSubmit)()
              }}
              disabled={isSubmitSuccessful || sending}
            />

            <FormControl id="payment" display="none">
              <Input type="hidden" defaultValue="Mercado Pago" {...register('payment')} />
            </FormControl>

            <FormControl id="factura" isInvalid={errors.factura}>
              <Text fontWeight="medium" mb={1}>Facturación:</Text>
              <Select
                {...inputCommonProps}
                cursor="pointer"
                sx={{ '> option': { bg: 'white', color: '#2d3748' } }}
                placeholder="Facturación"
                aria-label="Facturación"
                disabled={isSubmitSuccessful}
                {...register('factura', { required: true })}
              >
                <option value="Consumidor final">Consumidor final</option>
                <option value="Monotribustista">Monotribustista</option>
                <option value="Responsable inscripto">Responsable inscripto</option>
                <option value="Otra">Otra</option>
              </Select>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>
            <FormControl id="cuit" isInvalid={errors.cuit}>
              <Text fontSize="sm" color="gray.600" mb={2}>
                A efectos de esta contratación, solicito la emisión de la factura al
                siguiente CUIT / CUIL:{' '}
              </Text>
              <Input
                {...inputCommonProps}
                type="text"
                inputMode="numeric"
                placeholder="Número de CUIT / CUIL (ej: 20-32456789-4)"
                aria-label="Número de CUIT"
                disabled={isSubmitSuccessful}
                {...register('cuit', { required: true })}
              />
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>
          </InputContainer>
        ) : null}

        <InputContainer
          my="2rem"
          display="flex"
          justify="flex-end"
          align="flex-end"
          wrap="nowrap"
          flexDirection="row"
          direction="row"
          spacing="2rem"
        >
          {step > 0 ? (
            <Button
              variant="ghost"
              borderRadius="none"
              textTransform="uppercase"
              bg="transparent"
              _hover={{ bg: 'separator' }}
              color="primary"
              fontWeight="bold"
              border="none"
              outline="none"
              py="1em"
              fontSize="xl"
              h="auto"
              onClick={() => {
                setStep(step - 1)
              }}
            >
              Volver
            </Button>
          ) : null}

          <Button
            borderRadius="none"
            textTransform="uppercase"
            bg="primary"
            color="white"
            fontWeight="bold"
            border="none"
            outline="none"
            py="1em"
            fontSize="xl"
            h="auto"
            onClick={async () => {
              setStepError(false)
              if (!stepsValidation[step]) {
                setStepError(true)
                return
              }
              const result = await trigger(stepsValidation[step])

              if (result) {
                if (step < 2) {
                  setStep(step + 1)
                } else {
                  const currentVals = getValues() as FormFields
                  setValues(currentVals)
                  onOpen()
                }
              } else {
                setStepError(true)
              }
            }}
          >
            {step === 2 ? 'Revisar y Confirmar' : 'Continuar'}
          </Button>
        </InputContainer>
        <Text color="red.500" textAlign="center">
          {stepError
            ? 'Para poder continuar, debés completar todos los campos obligatorios'
            : ' '}
        </Text>

        {values ? (
          <Modal size="xl" isOpen={isOpen} onClose={() => {
            if (completedResult) {
              navigate('/panel')
            }
            onClose()
          }}>
            <ModalOverlay />
            <ModalContent mx="1rem" borderRadius="xl" overflow="hidden">
              <ModalHeader
                bg={completedResult ? 'green.500' : 'primary'}
                color="white"
                py={4}
                px={6}
                fontSize="lg"
                fontWeight="bold"
              >
                {completedResult
                  ? '¡Solicitud Completada!'
                  : 'Revisá y Confirmá tu Alquiler'}
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6} color="text">
                {/* VISTA DE ÉXITO LUEGO DE PAGAR / CONFIRMAR */}
                {completedResult ? (
                  <VStack spacing={5} align="stretch" textAlign="center">
                    <Flex justify="center" pt={2}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg={
                          paymentData.method === 'mercadopago'
                            ? 'blue.50'
                            : 'green.50'
                        }
                      >
                        <Icon
                          as={
                            paymentData.method === 'mercadopago'
                              ? SiMercadopago
                              : paymentData.method === 'transferencia'
                              ? FaUniversity
                              : FaCheckCircle
                          }
                          w={14}
                          h={14}
                          color={
                            paymentData.method === 'mercadopago'
                              ? '#009ee3'
                              : 'green.500'
                          }
                        />
                      </Box>
                    </Flex>

                    <Box>
                      <Text fontSize="xl" fontWeight="black" color="#16284a">
                        {paymentData.method === 'mercadopago'
                          ? '¡Alquiler Iniciado en Mercado Pago!'
                          : paymentData.method === 'transferencia'
                          ? '¡Reserva de Box Registrada!'
                          : '¡Pago Aprobado y Alquiler Confirmado!'}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        {completedResult.message}
                      </Text>
                    </Box>

                    {/* Detalle de la Operación */}
                    <Box
                      bg="#f8fafc"
                      p={4}
                      borderRadius="lg"
                      border="1px solid #e2e8f0"
                      textAlign="left"
                    >
                      <SimpleGrid columns={2} spacing={3} fontSize="sm">
                        <Box>
                          <Text fontSize="2xs" color="gray.500" textTransform="uppercase">
                            Código de Operación
                          </Text>
                          <Text fontWeight="bold" color="#16284a">
                            {completedResult.operation?.code}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="2xs" color="gray.500" textTransform="uppercase">
                            Unidad Asignada
                          </Text>
                          <Text fontWeight="bold" color="#1d4ed8">
                            {completedResult.operation?.box}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="2xs" color="gray.500" textTransform="uppercase">
                            Importe Total
                          </Text>
                          <Text fontWeight="bold" color="green.600">
                            ${Math.round(Number(completedResult.operation?.amount || 0) * 1.21).toLocaleString('es-AR')}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="2xs" color="gray.500" textTransform="uppercase">
                            Estado del Pago
                          </Text>
                          <Badge
                            colorScheme={
                              completedResult.operation?.payment_status === 'pagado'
                                ? 'green'
                                : 'yellow'
                            }
                          >
                            {completedResult.operation?.payment_status?.toUpperCase()}
                          </Badge>
                        </Box>
                        {completedResult.card?.authorization_code && (
                          <Box gridColumn="span 2">
                            <Text fontSize="2xs" color="gray.500" textTransform="uppercase">
                              Comprobante de Autorización
                            </Text>
                            <Text fontWeight="bold" fontFamily="monospace" fontSize="xs" color="gray.700">
                              {completedResult.card.authorization_code} · {completedResult.card.card_brand} (**** {completedResult.card.card_last_four})
                            </Text>
                          </Box>
                        )}
                      </SimpleGrid>
                    </Box>

                    {/* Botón especial para Mercado Pago si quedó abierta */}
                    {completedResult.mercadopago?.init_point && (
                      <Button
                        w="100%"
                        bg="#009ee3"
                        color="white"
                        h="50px"
                        _hover={{ bg: '#0082ba' }}
                        fontWeight="bold"
                        fontSize="md"
                        leftIcon={<Icon as={SiMercadopago} />}
                        onClick={() => window.open(completedResult.mercadopago.init_point, '_blank')}
                      >
                        Abrir pasarela de Mercado Pago
                      </Button>
                    )}

                    {/* Botones de acción */}
                    <VStack spacing={3} pt={2}>
                      {(completedResult.url || completedResult.contract_url) && (
                        <Button
                          w="100%"
                          variant="outline"
                          borderColor="#16284a"
                          color="#16284a"
                          h="48px"
                          fontWeight="bold"
                          leftIcon={<Icon as={FaFilePdf} color="red.500" />}
                          onClick={() => {
                            window.open(completedResult.url || completedResult.contract_url, '_blank')
                          }}
                        >
                          Descargar Contrato de Locación (PDF)
                        </Button>
                      )}

                      <Button
                        w="100%"
                        bg="#16284a"
                        color="white"
                        h="48px"
                        fontWeight="bold"
                        _hover={{ bg: '#0f1c34' }}
                        rightIcon={<Icon as={FaArrowRight} />}
                        onClick={() => {
                          onClose()
                          navigate('/panel')
                        }}
                      >
                        Ir a Mi Panel de Cliente
                      </Button>
                    </VStack>
                  </VStack>
                ) : (
                  /* VISTA DE CONFIRMACIÓN ANTES DE PAGAR */
                  <Stack spacing={4}>
                    <Text fontSize="sm" color="#626584">
                      Verificá los detalles de tu contratación antes de confirmar el pago:
                    </Text>

                    {/* Datos del Cliente */}
                    <Box bg="#F8FAFC" p={4} borderRadius="md" border="1px solid #E2E8F0">
                      <HStack spacing={2} mb={2.5}>
                        <Icon as={FaUser} color="#1E3264" w={3.5} h={3.5} />
                        <Text fontSize="xs" fontWeight="bold" color="#1E3264" textTransform="uppercase" letterSpacing="0.5px">
                          Datos del Locatario
                        </Text>
                      </HStack>
                      <SimpleGrid columns={[1, 2]} spacing={2} fontSize="xs">
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Nombre:</strong> {values.name} {values.last_name}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>DNI:</strong> {values.dni}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Email:</strong> {values.email}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Celular:</strong> {values.cellphone}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Dirección:</strong> {values.address}, {values.city}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Factura / CUIT:</strong> {values.factura} ({values.cuit})</Text>
                      </SimpleGrid>
                    </Box>

                    {/* Detalles de la Unidad */}
                    <Box bg="#F8FAFC" p={4} borderRadius="md" border="1px solid #E2E8F0">
                      <HStack spacing={2} mb={2.5}>
                        <Icon as={FaBoxOpen} color="#1E3264" w={3.5} h={3.5} />
                        <Text fontSize="xs" fontWeight="bold" color="#1E3264" textTransform="uppercase" letterSpacing="0.5px">
                          Unidad y Período
                        </Text>
                      </HStack>
                      <SimpleGrid columns={[1, 2]} spacing={2} fontSize="xs">
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Tamaño:</strong> {values.size}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Duración:</strong> {values.time} días</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Fecha de Ingreso:</strong> {values.start ? (values.start instanceof Date ? values.start.toLocaleDateString('es-AR') : new Date(values.start).toLocaleDateString('es-AR')) : '-'}</Text>
                        <Text color="#626584"><strong style={{ color: '#1E3264' }}>Fecha de Finalización:</strong> {values.end ? (values.end instanceof Date ? values.end.toLocaleDateString('es-AR') : new Date(values.end).toLocaleDateString('es-AR')) : '-'}</Text>
                      </SimpleGrid>
                    </Box>

                    {/* Desglose de Pago */}
                    <Box bg="#F8FAFC" p={4} borderRadius="md" border="1px solid #E2E8F0">
                      <HStack spacing={2} mb={2.5}>
                        <Icon
                          as={paymentData.method === 'mercadopago' ? SiMercadopago : FaUniversity}
                          color="#1E3264"
                          w={4}
                          h={4}
                        />
                        <Text fontSize="xs" fontWeight="bold" color="#1E3264" textTransform="uppercase" letterSpacing="0.5px">
                          Medio de Pago Seleccionado
                        </Text>
                      </HStack>
                      <Text fontWeight="semibold" fontSize="sm" color="#1E3264" mb={2}>
                        {paymentData.method === 'mercadopago'
                          ? 'Mercado Pago (Tarjetas de crédito, débito o dinero en cuenta)'
                          : 'Transferencia Bancaria Directa (Banco Santander Río)'}
                      </Text>

                      <Divider my={2.5} borderColor="#E2E8F0" />

                      <Flex justify="space-between" fontSize="xs" color="#626584">
                        <Text>Subtotal neto:</Text>
                        <Text fontWeight="medium" color="#1E3264">${Number(values.price || 0).toLocaleString('es-AR')}</Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="xs" color="#626584" mt={1}>
                        <Text>IVA (21%):</Text>
                        <Text fontWeight="medium" color="#1E3264">${Math.round(Number(values.price || 0) * 0.21).toLocaleString('es-AR')}</Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="md" fontWeight="bold" color="#1E3264" pt={2} mt={1} borderTop="1px dashed #CBD5E1">
                        <Text>Total a abonar:</Text>
                        <Text fontSize="lg">${Math.round(Number(values.price || 0) * 1.21).toLocaleString('es-AR')}</Text>
                      </Flex>
                    </Box>

                    {/* Botón de Enviar */}
                    <Box pt={2}>
                      <Button
                        w="100%"
                        borderRadius="md"
                        textTransform="uppercase"
                        isLoading={sending}
                        disabled={sending || isSubmitSuccessful}
                        bg="#1E3264"
                        color="white"
                        cursor={!sending ? 'pointer' : 'default'}
                        _hover={{ bg: '#142347' }}
                        fontWeight="bold"
                        py="1.5em"
                        fontSize="md"
                        h="auto"
                        leftIcon={
                          paymentData.method === 'mercadopago' ? (
                            <Icon as={SiMercadopago} w={5} h={5} />
                          ) : (
                            <Icon as={FaUniversity} w={4} h={4} />
                          )
                        }
                        onClick={() => {
                          clearErrors('submit')
                          handleSubmit(onSubmit)()
                        }}
                      >
                        {buttonText}
                      </Button>

                      <Text color="red.500" textAlign="center" mt={2} fontSize="xs">
                        {errors.submit
                          ? 'Ocurrió un error. Por favor, intentalo nuevamente más tarde.'
                          : ' '}
                      </Text>
                    </Box>
                  </Stack>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : null}
      </Flex>
    </>
  )
}

export default AlquilarForm
