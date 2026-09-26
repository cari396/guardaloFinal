import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  Badge,
  Icon,
  Divider,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { FiCheckCircle, FiCalendar, FiBox, FiCreditCard, FiArrowRight, FiClock, FiCheck } from 'react-icons/fi'
import { SiMercadopago } from 'react-icons/si'
import { FaUniversity } from 'react-icons/fa'
import { navigate } from 'gatsby'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, boxApi, priceApi } from '../services/api'
import PaymentMethodSelector, { PaymentMethodData } from './PaymentMethodSelector'
import Link from './Link'

interface BoxOption {
  id: string
  boxNumber: string
  size: string
  expiresAt: string
}

interface DurationOption {
  days: number
  label: string
  price: number
  badge?: string
  bonusDays?: number
}

const getDurationOptionsForSize = (size?: string, dynamicPrices?: any[]): DurationOption[] => {
  const isPequeno = size && (size.includes('Pequeño') || size.includes('pequeño') || size.includes('8.3'))
  const isGrande = size && (size.includes('Grande') || size.includes('grande') || size.includes('20.5'))

  const baseOptions: DurationOption[] = isPequeno
    ? [
        { days: 1, label: '1 Día', price: 3650 },
        { days: 3, label: '3 Días', price: 6090 },
        { days: 7, label: '7 Días', price: 13700 },
        { days: 15, label: '15 Días', price: 22850 },
        { days: 30, label: '30 Días', price: 36500 },
        { days: 90, label: '90 Días', price: 109500, badge: '¡PROMO +10 DÍAS!', bonusDays: 10 },
        { days: 180, label: '180 Días', price: 219000, badge: '¡PROMO +30 DÍAS!', bonusDays: 30 },
        { days: 365, label: '1 Año (365 Días)', price: 410000, badge: 'MEJOR PRECIO', bonusDays: 60 },
      ]
    : isGrande
    ? [
        { days: 1, label: '1 Día', price: 9000 },
        { days: 3, label: '3 Días', price: 15000 },
        { days: 7, label: '7 Días', price: 33750 },
        { days: 15, label: '15 Días', price: 56250 },
        { days: 30, label: '30 Días', price: 90000 },
        { days: 90, label: '90 Días', price: 270000, badge: '¡PROMO +10 DÍAS!', bonusDays: 10 },
        { days: 180, label: '180 Días', price: 540000, badge: '¡PROMO +30 DÍAS!', bonusDays: 30 },
        { days: 365, label: '1 Año (365 Días)', price: 990000, badge: 'MEJOR PRECIO', bonusDays: 60 },
      ]
    : [
        // Mediano (default)
        { days: 1, label: '1 Día', price: 6000 },
        { days: 3, label: '3 Días', price: 10000 },
        { days: 7, label: '7 Días', price: 22500 },
        { days: 15, label: '15 Días', price: 26250 },
        { days: 30, label: '30 Días', price: 60000 },
        { days: 90, label: '90 Días', price: 180000, badge: '¡PROMO +10 DÍAS!', bonusDays: 10 },
        { days: 180, label: '180 Días', price: 360000, badge: '¡PROMO +30 DÍAS!', bonusDays: 30 },
        { days: 365, label: '1 Año (365 Días)', price: 680000, badge: 'MEJOR PRECIO', bonusDays: 60 },
      ]

  if (!dynamicPrices || dynamicPrices.length === 0) {
    return baseOptions
  }

  const targetCategory = isPequeno ? 'pequeño' : isGrande ? 'grande' : 'mediano'
  const relevantPrices = dynamicPrices.filter((p) =>
    (p.size_category || '').toLowerCase().includes(targetCategory)
  )

  if (relevantPrices.length === 0) {
    return baseOptions
  }

  return baseOptions.map((opt) => {
    const match = relevantPrices.find((p) => {
      const numMatch = (p.period || '').match(/\d+/)
      return numMatch ? parseInt(numMatch[0]) === opt.days : false
    })
    if (match && match.amount) {
      return {
        ...opt,
        price: parseFloat(match.amount),
        badge: match.promo_text ? match.promo_text.toUpperCase() : opt.badge,
      }
    }
    return opt
  })
}

const DEFAULT_USER_BOXES: BoxOption[] = [
  {
    id: 'box-16',
    boxNumber: 'BOX 16',
    size: 'Mediano: 13.75m² (2.75x5m)',
    expiresAt: '22 de diciembre',
  },
  {
    id: 'box-17',
    boxNumber: 'BOX 17',
    size: 'Pequeño: 8.3m² (1.66x5m)',
    expiresAt: '22 de diciembre',
  },
]

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const calculateNewExpiration = (daysToAdd: number) => {
  const target = new Date()
  target.setDate(target.getDate() + daysToAdd)
  return `${target.getDate()} de ${MONTH_NAMES[target.getMonth()]} de ${target.getFullYear()}`
}

const RenovarBoxForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()

  const [boxes, setBoxes] = useState<BoxOption[]>(DEFAULT_USER_BOXES)
  const [selectedBoxNumber, setSelectedBoxNumber] = useState<string>('BOX 16')
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(
    getDurationOptionsForSize('Mediano')[4] || getDurationOptionsForSize('Mediano')[0]
  )
  const [paymentData, setPaymentData] = useState<PaymentMethodData>({
    method: 'mercadopago',
    transferReference: '',
  })
  const [loadingBoxes, setLoadingBoxes] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Guest lookup fields
  const [guestBoxNumber, setGuestBoxNumber] = useState<string>('')
  const [guestEmail, setGuestEmail] = useState<string>('')

  // Success state
  const [successData, setSuccessData] = useState<{
    boxNumber: string
    newExpiresAt: string
    code: string
    amount: number
    initPoint?: string
    isTransfer?: boolean
    authCode?: string
    cardBrand?: string
    lastFour?: string
  } | null>(null)

  // Attempt to fetch boxes from backend if user is authenticated
  useEffect(() => {
    const isDemoUser =
      user?.email === 'juan.lopez@ejemplo.com' || user?.email === 'juan@guardalo.com.ar'

    if (isAuthenticated) {
      setLoadingBoxes(true)
      boxApi
        .getMyBoxes()
        .then((res) => {
          if (res.data && res.data.boxes && res.data.boxes.length > 0) {
            const mapped = res.data.boxes.map((b: any) => ({
              id: String(b.id),
              boxNumber: b.box_number,
              size: b.size,
              expiresAt: b.expires_at,
            }))
            setBoxes(mapped)
            setSelectedBoxNumber(mapped[0].boxNumber)
          } else {
            setBoxes(isDemoUser ? DEFAULT_USER_BOXES : [])
          }
        })
        .catch(() => {
          // Graceful fallback to DEFAULT_USER_BOXES only for demo user
          setBoxes(isDemoUser ? DEFAULT_USER_BOXES : [])
        })
        .finally(() => setLoadingBoxes(false))
    }
  }, [isAuthenticated, user?.email])

  const [dynamicPrices, setDynamicPrices] = useState<any[]>([])

  // Load active prices from backend to stay in sync with admin updates safely
  useEffect(() => {
    try {
      const fetcher = (priceApi as any)?.getAll || (priceApi as any)?.getPrices
      if (typeof fetcher === 'function') {
        fetcher()
          .then((res: any) => {
            if (res?.data?.prices && Array.isArray(res.data.prices) && res.data.prices.length > 0) {
              setDynamicPrices(res.data.prices)
            }
          })
          .catch(() => {})
      }
    } catch (e) {
      console.warn('Error loading dynamic prices:', e)
    }
  }, [])

  const selectedBox =
    boxes.find((b) => b.boxNumber === selectedBoxNumber) ||
    boxes[0] || {
      id: 'custom',
      boxNumber: guestBoxNumber || 'BOX 16',
      size: 'Mediano: 13.75m² (2.75x5m)',
      expiresAt: '22 de diciembre',
    }

  const currentDurationOptions = useMemo(() => {
    return getDurationOptionsForSize(selectedBox?.size, dynamicPrices)
  }, [selectedBox?.size, dynamicPrices])

  useEffect(() => {
    if (currentDurationOptions && currentDurationOptions.length > 0) {
      const matching =
        currentDurationOptions.find((o) => o.days === selectedDuration?.days) ||
        currentDurationOptions[4] ||
        currentDurationOptions[0]
      if (matching) {
        setSelectedDuration(matching)
      }
    }
  }, [currentDurationOptions])

  const activeDuration: DurationOption =
    selectedDuration ||
    (currentDurationOptions && currentDurationOptions[4]) ||
    (currentDurationOptions && currentDurationOptions[0]) || {
      days: 30,
      label: '30 Días',
      price: 60000,
    }

  const newExpirationDate = calculateNewExpiration(
    (activeDuration.days || 30) + (activeDuration.bonusDays || 0)
  )

  const handleRenovar = async () => {
    setSubmitting(true)
    const boxToRenew = isAuthenticated ? selectedBox.boxNumber : guestBoxNumber || 'BOX 16'
    const emailToUse = user ? user.email : guestEmail || 'juan.lopez@ejemplo.com'

    try {
      const payload: Record<string, any> = {
        box_number: boxToRenew,
        email: emailToUse,
        days: activeDuration.days,
        price: activeDuration.price,
        payment:
          paymentData.method === 'mercadopago'
            ? 'Mercado Pago'
            : 'Transferencia Bancaria',
      }

      if (paymentData.method === 'transferencia') {
        payload.transfer_reference = paymentData.transferReference
      }

      const token = typeof window !== 'undefined'
        ? localStorage.getItem('guardalo_token') || localStorage.getItem('guardalo_auth_token')
        : null
      const headers: Record<string, string> = {}
      if (token) {
        payload.auth_token = token
        headers['Authorization'] = `Bearer ${token}`
      }

      let requestBody: any = payload
      if (paymentData.receiptFile) {
        const formData = new FormData()
        Object.keys(payload).forEach((k) => {
          if (payload[k] !== undefined && payload[k] !== null) {
            formData.append(k, String(payload[k]))
          }
        })
        formData.append('receipt_file', paymentData.receiptFile)
        requestBody = formData
      } else {
        headers['Content-Type'] = 'application/json'
      }

      const response = await axios.post(`${API_BASE_URL}/renovar`, requestBody, { headers })

      if (response.data && response.data.success) {
        const mpInitPoint = response.data.mercadopago?.init_point
        if (mpInitPoint && typeof window !== 'undefined') {
          window.open(mpInitPoint, '_blank')
        }

        setSuccessData({
          boxNumber: boxToRenew,
          newExpiresAt: response.data.new_expires_at || newExpirationDate,
          code: response.data.operation?.code || '#REN-' + Math.floor(1000 + Math.random() * 9000),
          amount: activeDuration.price,
          initPoint: mpInitPoint,
          isTransfer: paymentData.method === 'transferencia',
          authCode: response.data.card?.authorization_code,
          cardBrand: response.data.card?.card_brand,
          lastFour: response.data.card?.card_last_four,
        })
        toast({
          title: '¡Renovación confirmada!',
          description: `El ${boxToRenew} fue renovado correctamente.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        throw new Error(response.data?.message || 'Respuesta inválida')
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Ocurrió un error al procesar la renovación.'
      toast({
        title: 'Error al procesar la renovación',
        description: errMsg,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Success view
  if (successData) {
    return (
      <Box
        maxW="640px"
        mx="auto"
        bg="white"
        p={[6, 10]}
        borderRadius="xl"
        border="1px solid #d1fae5"
        boxShadow="xl"
        textAlign="center"
      >
        <Flex
          w="72px"
          h="72px"
          bg="green.100"
          color="green.600"
          borderRadius="full"
          align="center"
          justify="center"
          mx="auto"
          mb={4}
        >
          <Icon as={FiCheckCircle} w={10} h={10} />
        </Flex>

        <Heading as="h2" size="lg" color="#16284a" mb={2}>
          ¡Renovación Exitosa!
        </Heading>
        <Text color="gray.600" fontSize="md" mb={6}>
          Tu solicitud fue procesada y registrada en el sistema.
        </Text>

        <Box
          bg="#f8fafc"
          p={6}
          borderRadius="lg"
          border="1px solid #e2e8f0"
          textAlign="left"
          mb={6}
        >
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                Unidad
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="#16284a">
                {successData.boxNumber}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                Código de Operación
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="blue.600">
                {successData.code}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                Nuevo Vencimiento
              </Text>
              <Text fontSize="md" fontWeight="bold" color="green.600">
                {successData.newExpiresAt}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                Monto Abonado
              </Text>
              <Text fontSize="md" fontWeight="bold" color="#16284a">
                $ {successData.amount.toLocaleString('es-AR')}
              </Text>
            </Box>
            {successData.authCode && (
              <Box gridColumn="span 2">
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
                  Comprobante de Autorización
                </Text>
                <Text fontSize="xs" fontWeight="bold" fontFamily="monospace" color="green.700">
                  {successData.authCode} · {successData.cardBrand} (**** {successData.lastFour})
                </Text>
              </Box>
            )}
          </SimpleGrid>
        </Box>

        {successData.initPoint && (
          <Button
            w="100%"
            bg="#009ee3"
            color="white"
            h="48px"
            mb={4}
            _hover={{ bg: '#0084be' }}
            leftIcon={<Icon as={SiMercadopago} />}
            onClick={() => window.open(successData.initPoint, '_blank')}
          >
            Abrir pasarela de Mercado Pago para abonar
          </Button>
        )}

        {successData.isTransfer && (
          <Box bg="green.50" p={4} borderRadius="lg" border="1px solid #bbf7d0" mb={4} textAlign="left">
            <Text fontSize="xs" fontWeight="bold" color="green.800" mb={1}>
              Datos para transferir el pago de tu renovación:
            </Text>
            <Text fontSize="xs" color="gray.700">
              Banco Santander Río · Cuenta Corriente en Pesos<br />
              <strong>CBU:</strong> 0720218820000001234567<br />
              <strong>Alias:</strong> GUARDALO.BOXES<br />
              <strong>Referencia:</strong> {successData.code}
            </Text>
          </Box>
        )}

        <HStack spacing={4} justify="center">
          <Button
            bg="#16284a"
            color="white"
            _hover={{ bg: '#101d36' }}
            px={8}
            h="48px"
            fontWeight="bold"
            onClick={() => navigate('/panel')}
          >
            Ir a Mis Boxes en el Panel
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            h="48px"
            onClick={() => {
              setSuccessData(null)
            }}
          >
            Renovar otra unidad
          </Button>
        </HStack>
      </Box>
    )
  }

  return (
    <Box maxW="800px" mx="auto" w="100%">
      {/* 1. Header con estado del usuario */}
      {user ? (
        <Box
          bg="blue.50"
          border="1px solid #bfdbfe"
          p={4}
          borderRadius="lg"
          mb={8}
          boxShadow="sm"
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
            <HStack spacing={3}>
              <Box bg="blue.600" color="white" p={2} borderRadius="full">
                <FiBox />
              </Box>
              <Box>
                <Text fontWeight="bold" color="#16284a" fontSize="sm">
                  {user.name} · <Badge colorScheme="green">Cuenta Verificada</Badge>
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {user.dni ? (
                    <>
                      DNI: <strong>{user.dni}</strong> ·{' '}
                    </>
                  ) : null}
                  {user.cuit ? (
                    <>
                      CUIT: <strong>{user.cuit}</strong> ·{' '}
                    </>
                  ) : null}
                  {user.city || 'Chivilcoy'} ({user.email})
                </Text>
              </Box>
            </HStack>
            <Link
              to="/panel"
              color="blue.700"
              fontSize="xs"
              fontWeight="bold"
              textDecoration="underline"
            >
              Ver mis boxes en el panel →
            </Link>
          </Flex>
        </Box>
      ) : (
        <Box
          bg="amber.50"
          border="1px solid #fde68a"
          p={4}
          borderRadius="lg"
          mb={8}
          textAlign="center"
        >
          <Text fontSize="sm" color="amber.900" mb={2}>
            ¿Ya tenés cuenta en Guardalo.com? Iniciá sesión para renovar en 1 click sin escribir tus datos.
          </Text>
          <Button
            size="sm"
            bg="#16284a"
            color="white"
            _hover={{ bg: '#101d36' }}
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>
        </Box>
      )}

      {/* 2. Paso 1: Elegir el Box */}
      <Box mb={8}>
        <HStack mb={4} spacing={3} align="center">
          <Flex
            w="28px"
            h="28px"
            bg="#16284a"
            color="white"
            borderRadius="full"
            align="center"
            justify="center"
            fontWeight="bold"
            fontSize="sm"
          >
            1
          </Flex>
          <Heading as="h3" size="md" color="#16284a">
            Elegí la unidad a renovar
          </Heading>
        </HStack>

        {user ? (
          boxes.length === 0 ? (
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              border="1px dashed #cbd5e1"
              textAlign="center"
            >
              <Box color="gray.400" fontSize="36px" mb={2} display="flex" justifyContent="center">
                <FiBox />
              </Box>
              <Heading as="h4" size="sm" color="#16284a" mb={2}>
                No tenés ningún box registrado para renovar
              </Heading>
              <Text color="gray.500" fontSize="sm" mb={4}>
                Para comenzar, solicitá el alquiler de tu primer espacio de guardado inteligente.
              </Text>
              <Button
                bg="#16284a"
                color="white"
                _hover={{ bg: '#101d36' }}
                onClick={() => navigate('/alquilar')}
              >
                Alquilar un nuevo box
              </Button>
            </Box>
          ) : (
            <SimpleGrid columns={[1, 2]} spacing={4}>
              {boxes.map((box) => {
                const isSelected = selectedBoxNumber === box.boxNumber
                return (
                  <Box
                    key={box.id}
                    onClick={() => setSelectedBoxNumber(box.boxNumber)}
                    cursor="pointer"
                    p={5}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={isSelected ? '#16284a' : '#e2e8f0'}
                    bg={isSelected ? '#f0f5ff' : 'white'}
                    boxShadow={isSelected ? 'md' : 'sm'}
                    transition="all 0.2s"
                    _hover={{ borderColor: '#16284a', transform: 'translateY(-2px)' }}
                    position="relative"
                  >
                    {isSelected && (
                      <Box
                        position="absolute"
                        top={3}
                        right={3}
                        bg="#16284a"
                        color="white"
                        borderRadius="full"
                        p={1}
                      >
                        <FiCheck size={14} />
                      </Box>
                    )}
                    <Text fontSize="xl" fontWeight="bold" color="#16284a" mb={1}>
                      {box.boxNumber}
                    </Text>
                    <Text fontSize="xs" color="gray.600" mb={3}>
                      {box.size}
                    </Text>
                    <HStack spacing={2} color="gray.700" fontSize="xs">
                      <FiCalendar color="#16284a" />
                      <Text>
                        Vencimiento actual: <strong>{box.expiresAt}</strong>
                      </Text>
                    </HStack>
                  </Box>
                )
              })}
            </SimpleGrid>
          )
        ) : (
          <Stack spacing={4} bg="white" p={6} borderRadius="lg" border="1px solid #e2e8f0">
            <Text fontSize="sm" color="gray.600">
              Ingresá los datos de tu alquiler actual para renovar:
            </Text>
            <SimpleGrid columns={[1, 2]} spacing={4}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={1}>
                  Número de Box (ej: BOX 16)
                </Text>
                <Input
                  placeholder="BOX 16"
                  value={guestBoxNumber}
                  onChange={(e) => setGuestBoxNumber(e.target.value)}
                />
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={1}>
                  Email con el que alquilaste
                </Text>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </Box>
            </SimpleGrid>
          </Stack>
        )}
      </Box>

      {/* 3. Paso 2: Elegir el Plazo de Renovación */}
      <Box mb={8}>
        <HStack mb={4} spacing={3} align="center">
          <Flex
            w="28px"
            h="28px"
            bg="#16284a"
            color="white"
            borderRadius="full"
            align="center"
            justify="center"
            fontWeight="bold"
            fontSize="sm"
          >
            2
          </Flex>
          <Heading as="h3" size="md" color="#16284a">
            Elegí por cuánto tiempo querés renovar
          </Heading>
        </HStack>

        <SimpleGrid columns={[2, 2, 4]} spacing={3} mb={4}>
          {currentDurationOptions.map((opt) => {
            const isSelected = activeDuration.days === opt.days
            return (
              <Box
                key={opt.days}
                onClick={() => setSelectedDuration(opt)}
                cursor="pointer"
                p={4}
                borderRadius="xl"
                border="2px solid"
                borderColor={isSelected ? '#16284a' : '#e2e8f0'}
                bg={isSelected ? '#f0f5ff' : 'white'}
                boxShadow={isSelected ? 'md' : 'none'}
                transition="all 0.2s"
                _hover={{ borderColor: '#16284a' }}
                position="relative"
                textAlign="center"
              >
                {opt.badge && (
                  <Badge
                    position="absolute"
                    top={-2.5}
                    right={2}
                    bg="#ff4000"
                    color="white"
                    fontSize="9px"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                  >
                    {opt.badge}
                  </Badge>
                )}
                <Text fontSize="sm" fontWeight="bold" color="#16284a" mb={1}>
                  {opt.label}
                </Text>
                <Text fontSize="xl" fontWeight="black" color="#16284a">
                  ${opt.price.toLocaleString('es-AR')}
                </Text>
                {opt.bonusDays && (
                  <Text fontSize="10px" color="green.600" fontWeight="bold" mt={1}>
                    +{opt.bonusDays} días adicionales sin cargo
                  </Text>
                )}
              </Box>
            )
          })}
        </SimpleGrid>

        {/* Live Calculation Banner */}
        <Box bg="#f8fafc" p={4} borderRadius="lg" border="1px dashed #cbd5e1">
          <Flex
            direction={['column', 'row']}
            align={['flex-start', 'center']}
            justify="space-between"
            gap={3}
          >
            <HStack spacing={2}>
              <FiClock color="#16284a" />
              <Text fontSize="sm" color="gray.600">
                Nuevo vencimiento estimado:
              </Text>
            </HStack>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="md">
              {newExpirationDate}
            </Badge>
          </Flex>
        </Box>
      </Box>

      {/* 4. Paso 3: Medio de Pago */}
      <Box mb={8}>
        <HStack mb={4} spacing={3} align="center">
          <Flex
            w="28px"
            h="28px"
            bg="#16284a"
            color="white"
            borderRadius="full"
            align="center"
            justify="center"
            fontWeight="bold"
            fontSize="sm"
          >
            3
          </Flex>
          <Heading as="h3" size="md" color="#16284a">
            Medio de pago
          </Heading>
        </HStack>

        <PaymentMethodSelector
          amount={activeDuration.price}
          value={paymentData}
          onChange={setPaymentData}
          onMercadoPagoClick={handleRenovar}
          disabled={submitting}
        />
      </Box>

      {/* 5. Resumen y Botón de Confirmación */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        border="1px solid #e2e8f0"
        boxShadow="lg"
      >
        <Flex
          direction={['column', 'row']}
          align={['flex-start', 'center']}
          justify="space-between"
          gap={4}
          mb={4}
        >
          <Box>
            <Text fontSize="xs" color="#626584" textTransform="uppercase" fontWeight="bold">
              Total a pagar por la renovación (IVA inc.)
            </Text>
            <Text fontSize="3xl" fontWeight="black" color="#1E3264">
              ${Math.round(activeDuration.price * 1.21).toLocaleString('es-AR')}
            </Text>
            <Text fontSize="xs" color="#626584">
              Subtotal: ${activeDuration.price.toLocaleString('es-AR')} + IVA 21% · Box <strong>{selectedBox.boxNumber}</strong> ({activeDuration.label})
            </Text>
          </Box>

          <Button
            bg="#1E3264"
            color="white"
            h="54px"
            px={8}
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="wider"
            _hover={{
              bg: '#142347',
              transform: 'translateY(-1px)',
            }}
            boxShadow="sm"
            isLoading={submitting}
            loadingText="Procesando renovación..."
            onClick={handleRenovar}
            w={['100%', 'auto']}
            leftIcon={
              paymentData.method === 'mercadopago' ? (
                <Icon as={SiMercadopago} w={5} h={5} />
              ) : (
                <Icon as={FaUniversity} w={4} h={4} />
              )
            }
          >
            {paymentData.method === 'mercadopago'
              ? `PAGAR $${Math.round(activeDuration.price * 1.21).toLocaleString('es-AR')} CON MERCADO PAGO`
              : 'CONFIRMAR RENOVACIÓN POR TRANSFERENCIA'}
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default RenovarBoxForm
