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
  ModalBody,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  UnorderedList,
  ListItem,
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
import { MdAirlineSeatIndividualSuite } from 'react-icons/md'
import { getApiBaseUrl } from '../services/api'


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

const sendMessage = (data: FormFields): AxiosPromise => {
  const s = new Date(data.start.toString()).setUTCHours(12, 0, 0, 0)
  const start = new Date(s).toLocaleDateString('es-AR')

  const e = new Date(data.end.toString()).setUTCHours(12, 0, 0, 0)
  const end = new Date(e).toLocaleDateString('es-AR')

  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('last_name', data.last_name)
  formData.append('dni', data.dni)
  formData.append('cellphone', data.cellphone)
  formData.append('phone', data.phone)
  formData.append('address', data.address)
  formData.append('city', data.city)
  formData.append('email', data.email)
  formData.append('message', data.message)
  formData.append('payment', data.payment)
  formData.append('cuit', data.cuit)
  formData.append('factura', data.factura)
  formData.append('tos', data.tos)
  formData.append('size',data.size)
  formData.append('time', data.time.toString())
  formData.append('start', start)
  formData.append('end', end)
  formData.append('price', data.price.toString())

  return axios({
    method: 'post',
    url: `${getApiBaseUrl()}/alquilar`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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

  const prices = usePricesList()
  const prices2 = usePricesList2()
  const prices3 = usePricesList3()
  const { setPdfUrl } = useGlobalState()

  useEffect(() => {
    if (!stepDisplayRef.current) {
      return
    }
    window.scrollTo({
      top: stepDisplayRef.current.offsetTop - headerHeight - 16,
      left: 0,
      behavior: 'smooth',
    })
  }, [step, setStep])

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

  const [selected, setSelected] = useState();
  
  /** Function that will set different values to state variable
   * based on which dropdown is selected
   */
  const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value);
    setValue('size', { ...register('size', { required: true }) });
  };
  let type ;
  /** This will be used to create set of options that user will see */
  let options;
  if (selected === "Tamaño pequeño") {
    type = "tamañoPequeño";
  } else if (selected === "Tamaño mediano") {
    type = "tamañoMediano";
  } else if (selected === "Tamaño grande") {
    type = "tamañoGrande";
  }
  if (type === "tamañoPequeño") {
    options = prices.map((price) => <option key={price.key} value={price.key}>Tamaño pequeño: {price.text} (${price.price} + IVA(21%))</option>)
  }else if(type === "tamañoMediano"){
    options =  options = prices2.map((price) => <option key={price.key} value={price.key}>Tamaño mediano: {price.text} (${price.price} + IVA(21%))</option>)
  }else if(type === "tamañoGrande"){
    options =  options = prices3.map((price) => <option key={price.key} value={price.key}>Tamaño grande: {price.text} (${price.price} + IVA(21%))</option>)
    }
  const watchFields = useWatch({ name: ['start', 'time', 'end','size'] })
  useEffect(() => {
    if (watchFields[1]) {
        const newPrice = prices2.find((i) => i.key === parseInt(watchFields[1]))?.price ?? ''
        setValue('price', newPrice)

      if (watchFields[0]) {
        const startDay = new Date(watchFields[0])
        const endDay = new Date(watchFields[0].setUTCHours(12, 0, 0, 0))
        endDay.setDate(startDay.getDate() + parseInt(watchFields[1]))
        endDay.setDate(endDay.getDate() - 1)
        setValue('end', endDay)
      }}
    if(watchFields[3]){
      if(watchFields[3] === 'Tamaño pequeño'){
        const newPrice2 = prices.find((i) => i.key === parseInt(watchFields[1]))?.price ?? ''
        setValue('price',newPrice2)
      }
      if(watchFields[3] === 'Tamaño mediano'){
        const newPrice3 = prices2.find((j) => j.key === parseInt(watchFields[1]))?.price ?? ''
        setValue('price',newPrice3)
      }
      if(watchFields[3] === 'Tamaño grande'){
        const newPrice4 = prices3.find((k) => k.key === parseInt(watchFields[1]))?.price ?? ''
        setValue('price',newPrice4)
      }
    }
    
    
  },[watchFields[0], watchFields[1]])

  useEffect(() => {
    setValues(getValues() as FormFields)
  }, [isOpen])

  const { errors, isSubmitSuccessful } = formState

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setSending(true)

    try {
      const response = await sendMessage(data)
      setSending(false)
      const contractUrl = response?.data?.url || response?.data?.contract_url
      if (contractUrl && typeof window !== 'undefined') {
        window.open(contractUrl, '_blank')
      }
      window.setTimeout(() => {
        setPdfUrl(contractUrl || '/panel')
      }, 800)
    } catch {
      setError('submit', { type: 'manual' })
      setSending(false)
    }
  }

  const buttonText = (() => {
    if (sending) {
      return 'Enviando solicitud'
    }
    if (isSubmitSuccessful) {
      return '¡Solicitud enviada!'
    }
    return 'Solicitar alquiler'
  })()

  return (
    <>
      <Flex
        w="100%"
        as="form"
        direction="column"
        wrap="nowrap"
        align="center"
        justifyContent="center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Text mb="2rem" ref={stepDisplayRef}>
          Paso {step + 1} de {stepsValidation.length}
        </Text>
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
                type="number"
                placeholder="Número de DNI"
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
                type="number"
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
              <Text>Tamaño del box:</Text>
               {/* <div>
                 <Text mb="1rem">Tamaño del box: </Text>
                <Select
                onChange={changeSelectOptionHandler}
                disabled={isSubmitSuccessful}
                //{...register('size', { required: true })}
                placeholder="Tamaño del box"
                aria-label='Tamaño del box'
                variant= 'flushed'
                borderColor= 'gray'
                borderBottomWidth= '1px'
                focusBorderColor= 'primary'
                >
                  <option>Tamaño pequeño</option>
                  <option>Tamaño mediano</option>
                  <option>Tamaño grande</option>
                </Select>
              </div>
              <div>
                <Text mt="1rem">Duracion del alquier</Text>
                <Select 
                {...inputCommonProps}
                {...register('time', { required: true })}>
                  {
                    options
                  }
                  
                </Select>
              </div> */}
              <Select
                {...inputCommonProps}
                placeholder="Tamaño del box"
                aria-label='Tamaño del box'
                disabled={isSubmitSuccessful}
                {...register('size',{ required:true})}
              >
                <option value="Tamaño pequeño">Tamaño pequeño</option>
                <option value="Tamaño mediano">Tamaño mediano</option>
                <option value="Tamaño grande">Tamaño grande</option>
              </Select>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>
            <FormControl id="time" isInvalid={errors.time}>
              <Text>Duración de alquiler:</Text>
              <Select
                {...inputCommonProps}
                placeholder="Tiempo de alquiler"
                aria-label="Tiempo de alquiler"
                disabled={isSubmitSuccessful}
                {...register('time', { required: true })}
              >
                {prices.map((price) => (
                  <option key={price.key} value={price.key} >
                    Tamaño pequeño: {price.text} (${price.price} +IVA (21%)) 
                  </option>
                ))}
                {prices2.map((price2) => (
                  <option key={price2.key} value={price2.key}>
                    Tamaño mediano: {price2.text} (${price2.price} + IVA (21%))
                  </option>
                ))}
                {prices3.map((price3) => (
                  <option key={price3.key} value={price3.key} >
                     Tamaño grande: {price3.text} (${price3.price} + IVA(21%))
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
                  highlightTo={watchFields[2]}
                  disabled={isSubmitSuccessful}
                />
              </Flex>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>
            <FormControl id="end">
              <Input readOnly type="hidden" defaultValue="" {...register('end')} />
            </FormControl>

            <Divider color="rgba(0, 0, 0, 0.2)" />

            <FormControl id="payment" isInvalid={errors.payment}>
              <Text>Medio de pago:</Text>
              <Select
                {...inputCommonProps}
                placeholder="Seleccionar medio de pago"
                aria-label="Medio de pago"
                disabled={isSubmitSuccessful}
                {...register('payment', { required: true })}
              >
                {paymentMethods.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              <Flex>
                <PaymentImages />
              </Flex>
              <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
            </FormControl>

            <FormControl id="factura" isInvalid={errors.factura}>
              <Text>Facturación:</Text>
              <Select
                {...inputCommonProps}
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
              <Text>
                A efectos de esta contratación, solicito la emisión de la factura al
                siguiente CUIT:{' '}
              </Text>
              <Input
                {...inputCommonProps}
                type="numero"
                placeholder="Número de CUIT"
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
                  onOpen()
                }
              } else {
                setStepError(true)
              }
            }}
          >
            Continuar
          </Button>
        </InputContainer>
        <Text color="red.500" textAlign="center">
          {stepError
            ? 'Para poder continuar, debés completar todos los campos obligatorios'
            : ' '}
        </Text>

        {values ? (
          <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent mx="1rem">
              <ModalHeader color="primary">Confirmación</ModalHeader>
              <ModalCloseButton color="primary" />
              <ModalBody color="text">
                <Stack spacing="2rem">
                  <Text>
                    Antes de confirmar el pedido, verificá que todos los datos sean
                    correctos:{' '}
                  </Text>

                  <Divider color="rgba(0, 0, 0, 0.2)" />

                  <UnorderedList px="2rem" styleType="none">
                    <ListItem>
                      <strong>Nombre:</strong> {values.name}
                    </ListItem>
                    <ListItem>
                      <strong>Apellido:</strong> {values.last_name}
                    </ListItem>
                    <ListItem>
                      <strong>DNI:</strong> {values.dni}
                    </ListItem>
                    <ListItem>
                      <strong>Celular:</strong> {values.cellphone}
                    </ListItem>
                    <ListItem>
                      <strong>Teléfono fijo:</strong> {values.phone}
                    </ListItem>
                    <ListItem>
                      <strong>Dirección:</strong> {values.address}
                    </ListItem>
                    <ListItem>
                      <strong>Ciudad:</strong> {values.city}
                    </ListItem>
                    <ListItem>
                      <strong>e-mail:</strong> {values.email}
                    </ListItem>
                    <ListItem>
                      <strong>Mensaje opcional:</strong> {values.message}
                    </ListItem>
                    <br />

                    <ListItem>
                      <strong>Tiempo de alquiler:</strong> {values.time} día/s
                    </ListItem>
                    <ListItem>
                      <strong>Precio:</strong> ${values.price} + IVA (21%)
                    </ListItem>
                    <ListItem>
                      <strong>Tamaño del box: </strong>{values.size}
                    </ListItem>
                    <ListItem>
                      <strong>Fecha de ingreso:</strong>{' '}
                      {values.start ? values.start.toLocaleDateString('es-AR') : null}
                    </ListItem>
                    <ListItem>
                      <strong>Fecha de finalización de alquiler:</strong>{' '}
                      {values.end ? values.end.toLocaleDateString('es-AR') : null}
                    </ListItem>

                    <br />

                    <ListItem>
                      <strong>Medio de pago:</strong> {values.payment}
                    </ListItem>
                    <ListItem>
                      <strong>Tipo de factura:</strong> {values.factura}
                    </ListItem>
                    <ListItem>
                      <strong>CUIT:</strong> {values.cuit}
                    </ListItem>
                  </UnorderedList>

                  <Divider color="rgba(0, 0, 0, 0.2)" />

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex px="2rem">
                      <Input
                        type="submit"
                        borderRadius="none"
                        textTransform="uppercase"
                        disabled={sending || isSubmitSuccessful}
                        value={buttonText}
                        bg={
                          sending ? 'lightGray' : isSubmitSuccessful ? 'green' : 'primary'
                        }
                        color={sending ? 'rgba(0, 0, 0, 0.5)' : 'white'}
                        cursor={!sending || !isSubmitSuccessful ? 'pointer' : 'default'}
                        fontWeight="bold"
                        border="none"
                        outline="none"
                        py="1em"
                        fontSize="xl"
                        h="auto"
                        onClick={() => clearErrors('submit')}
                      />
                    </Flex>
                    <Text color="red.500" textAlign="center">
                      {errors.submit
                        ? 'Ocurrió un error. Por favor, intentalo nuevamente más tarde.'
                        : ' '}
                    </Text>
                  </form>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : null}
      </Flex>
    </>
  )
}

export default AlquilarForm