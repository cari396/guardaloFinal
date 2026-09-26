import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Text,
  Input,
  SimpleGrid,
  HStack,
  VStack,
  Icon,
  useToast,
  Button,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { FaUniversity, FaCopy, FaCheck, FaShieldAlt } from 'react-icons/fa'
import { SiMercadopago } from 'react-icons/si'

export interface PaymentMethodData {
  method: 'mercadopago' | 'transferencia'
  transferReference?: string
}

interface PaymentMethodSelectorProps {
  amount: number
  value: PaymentMethodData
  onChange: (data: PaymentMethodData) => void
  disabled?: boolean
  onMercadoPagoClick?: () => void
}

const BANK_INFO = {
  bankName: 'Banco Santander Río',
  holder: 'Guardalo S.R.L.',
  cuit: '30-71649281-9',
  cbu: '0720218820000001234567',
  alias: 'GUARDALO.BOXES',
  accountType: 'Cuenta Corriente en Pesos',
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  value,
  onChange,
  disabled = false,
}) => {
  const toast = useToast()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const currentMethod: 'mercadopago' | 'transferencia' =
    value.method === 'transferencia' ? 'transferencia' : 'mercadopago'

  const [transferRef, setTransferRef] = useState(value.transferReference || '')

  useEffect(() => {
    onChange({
      method: currentMethod,
      transferReference: transferRef,
    })
  }, [currentMethod, transferRef])

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField(label)
      toast({
        title: `${label} copiado`,
        description: `${text} copiado al portapapeles.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  return (
    <Box w="100%" py={1}>
      <Text fontWeight="semibold" fontSize="sm" color="#1E3264" mb={3}>
        Forma de pago:
      </Text>

      {/* Selector de métodos de pago sobrio y elegante */}
      <SimpleGrid columns={[1, 2]} spacing={3} mb={3}>
        {/* Opción 1: Mercado Pago */}
        <Box
          p={4}
          borderRadius="lg"
          border="1.5px solid"
          borderColor={currentMethod === 'mercadopago' ? '#1E3264' : '#E2E8F0'}
          bg={currentMethod === 'mercadopago' ? '#F8FAFC' : 'white'}
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{ borderColor: '#1E3264' }}
          onClick={() => onChange({ ...value, method: 'mercadopago' })}
          position="relative"
        >
          <Flex align="center" justify="space-between" mb={2}>
            <HStack spacing={2.5}>
              <Box color="#1E3264" display="flex" alignItems="center">
                <Icon as={SiMercadopago} w={5} h={5} />
              </Box>
              <Text fontWeight="bold" fontSize="sm" color="#1E3264">
                Mercado Pago
              </Text>
            </HStack>
            {/* Radio indicator */}
            <Flex
              w="18px"
              h="18px"
              borderRadius="full"
              border="2px solid"
              borderColor={currentMethod === 'mercadopago' ? '#1E3264' : '#CBD5E1'}
              align="center"
              justify="center"
            >
              {currentMethod === 'mercadopago' && (
                <Box w="8px" h="8px" borderRadius="full" bg="#1E3264" />
              )}
            </Flex>
          </Flex>
          <Text fontSize="xs" color="#64748B" lineHeight="1.4">
            Tarjetas de crédito, débito o saldo en cuenta con acreditación instantánea.
          </Text>
        </Box>

        {/* Opción 2: Transferencia Bancaria */}
        <Box
          p={4}
          borderRadius="lg"
          border="1.5px solid"
          borderColor={currentMethod === 'transferencia' ? '#1E3264' : '#E2E8F0'}
          bg={currentMethod === 'transferencia' ? '#F8FAFC' : 'white'}
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{ borderColor: '#1E3264' }}
          onClick={() => onChange({ ...value, method: 'transferencia' })}
          position="relative"
        >
          <Flex align="center" justify="space-between" mb={2}>
            <HStack spacing={2.5}>
              <Box color="#1E3264" display="flex" alignItems="center">
                <Icon as={FaUniversity} w={4} h={4} />
              </Box>
              <Text fontWeight="bold" fontSize="sm" color="#1E3264">
                Transferencia
              </Text>
            </HStack>
            {/* Radio indicator */}
            <Flex
              w="18px"
              h="18px"
              borderRadius="full"
              border="2px solid"
              borderColor={currentMethod === 'transferencia' ? '#1E3264' : '#CBD5E1'}
              align="center"
              justify="center"
            >
              {currentMethod === 'transferencia' && (
                <Box w="8px" h="8px" borderRadius="full" bg="#1E3264" />
              )}
            </Flex>
          </Flex>
          <Text fontSize="xs" color="#64748B" lineHeight="1.4">
            Directo desde tu banco o billetera digital al Banco Santander Río.
          </Text>
        </Box>
      </SimpleGrid>

      {/* Detalle contextual minimalista según la opción elegida */}
      {currentMethod === 'mercadopago' ? (
        <Box
          p={3.5}
          bg="#F8FAFC"
          borderRadius="md"
          border="1px solid #E2E8F0"
        >
          <HStack align="flex-start" spacing={2.5}>
            <Icon as={FaShieldAlt} color="#1E3264" mt={0.5} w={3.5} h={3.5} />
            <VStack align="flex-start" spacing={1.5}>
              <Text fontSize="xs" color="#475569">
                Al confirmar la operación, vas a ser redirigido a la pasarela segura de <strong>Mercado Pago</strong> para realizar el pago.
              </Text>
              <HStack spacing={2} wrap="wrap" pt={0.5}>
                {['Visa', 'Mastercard', 'AMEX', 'Débito', 'Dinero en cuenta'].map((brand) => (
                  <Text
                    key={brand}
                    fontSize="2xs"
                    px={2}
                    py={0.5}
                    bg="#EDF2F7"
                    color="#475569"
                    borderRadius="sm"
                    fontWeight="medium"
                  >
                    {brand}
                  </Text>
                ))}
              </HStack>
            </VStack>
          </HStack>
        </Box>
      ) : (
        <Box
          p={4}
          bg="#F8FAFC"
          borderRadius="md"
          border="1px solid #E2E8F0"
        >
          <Text fontSize="xs" fontWeight="bold" color="#1E3264" mb={2.5}>
            Datos bancarios para la transferencia:
          </Text>
          <VStack align="stretch" spacing={2} fontSize="xs" color="#334155" mb={3}>
            <Flex justify="space-between" align="center" borderBottom="1px solid #E2E8F0" pb={1.5}>
              <Text color="#64748B">Banco:</Text>
              <Text fontWeight="semibold">{BANK_INFO.bankName} ({BANK_INFO.accountType})</Text>
            </Flex>
            <Flex justify="space-between" align="center" borderBottom="1px solid #E2E8F0" pb={1.5}>
              <Text color="#64748B">Titular / CUIT:</Text>
              <Text fontWeight="semibold">{BANK_INFO.holder} · {BANK_INFO.cuit}</Text>
            </Flex>
            <Flex justify="space-between" align="center" borderBottom="1px solid #E2E8F0" pb={1.5}>
              <Box>
                <Text color="#64748B" fontSize="2xs">ALIAS:</Text>
                <Text fontWeight="bold" color="#1E3264" letterSpacing="0.5px">{BANK_INFO.alias}</Text>
              </Box>
              <Button
                size="xs"
                variant="outline"
                borderColor="#CBD5E1"
                color="#1E3264"
                _hover={{ bg: '#EDF2F7' }}
                leftIcon={<Icon as={copiedField === 'Alias' ? FaCheck : FaCopy} />}
                onClick={() => handleCopy(BANK_INFO.alias, 'Alias')}
              >
                {copiedField === 'Alias' ? 'Copiado' : 'Copiar'}
              </Button>
            </Flex>
            <Flex justify="space-between" align="center" pt={0.5}>
              <Box>
                <Text color="#64748B" fontSize="2xs">CBU:</Text>
                <Text fontFamily="mono" fontSize="2xs" fontWeight="bold">{BANK_INFO.cbu}</Text>
              </Box>
              <Button
                size="xs"
                variant="outline"
                borderColor="#CBD5E1"
                color="#1E3264"
                _hover={{ bg: '#EDF2F7' }}
                leftIcon={<Icon as={copiedField === 'CBU' ? FaCheck : FaCopy} />}
                onClick={() => handleCopy(BANK_INFO.cbu, 'CBU')}
              >
                {copiedField === 'CBU' ? 'Copiado' : 'Copiar'}
              </Button>
            </Flex>
          </VStack>

          <FormControl mt={2}>
            <FormLabel fontSize="2xs" fontWeight="bold" color="#64748B" mb={1} textTransform="uppercase">
              Número de comprobante / Referencia (opcional):
            </FormLabel>
            <Input
              size="sm"
              borderRadius="md"
              borderColor="#CBD5E1"
              focusBorderColor="#1E3264"
              bg="white"
              placeholder="Ej: 98471249 o últimos 6 dígitos"
              value={transferRef}
              onChange={(e) => setTransferRef(e.target.value)}
              disabled={disabled}
            />
          </FormControl>
        </Box>
      )}
    </Box>
  )
}

export default PaymentMethodSelector
