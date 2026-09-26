import React, { useState } from 'react'
import { useFormContext, SubmitHandler } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Flex,
  Stack,
  Box,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  InputProps,
} from '@chakra-ui/react'

import axios, { AxiosPromise } from 'axios'
import { getApiBaseUrl } from '../services/api'

const inputCommonProps: Partial<InputProps> = {
  variant: 'flushed',
  borderColor: 'gray',
  borderBottomWidth: '1px',
  focusBorderColor: 'primary',
  _disabled: { color: 'gray' },
}


type FormFields = {
  name: string
  email: string
  message: string
}

const sendMessage = (data: FormFields): AxiosPromise => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('email', data.email)
  formData.append('message', data.message)

  return axios({
    method: 'post',
    url: `${getApiBaseUrl()}/contacto`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const ContactForm: React.FC = (): JSX.Element => {
  console.log(process.env.GATSBY_CONTACTO_ENDPOINT)
  const [sending, setSending] = useState(false)

  const { formState, register, handleSubmit, setError, clearErrors } = useFormContext()
  const { errors, isSubmitSuccessful } = formState

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setSending(true)

    try {
      await sendMessage(data)
      setSending(false)
    } catch {
      setError('submit', { type: 'manual' })
      setSending(false)
    }
  }

  const buttonText = (() => {
    if (sending) {
      return 'Enviando'
    }
    if (isSubmitSuccessful) {
      return '¡Enviado!'
    }
    return 'Enviar'
  })()

  return (
    <Box w="100%">
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        flexDir="column"
        flexWrap="nowrap"
        w="480px"
        maxW="calc(100% - 4rem)"
        m="4rem auto"
        spacing="3rem"
      >
        <FormControl id="name" isInvalid={errors.name}>
          <Input
            {...inputCommonProps}
            type="text"
            placeholder="Nombre"
            aria-label="Nombre"
            disabled={isSubmitSuccessful}
            {...register('name', { required: true })}
          />
          <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
        </FormControl>

        <FormControl id="email" isInvalid={errors.email}>
          <Input
            {...inputCommonProps}
            type="text"
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
            aria-label="Mensaje"
            placeholder="Mensaje"
            resize="none"
            lineHeight={10}
            minRows={1}
            overflow="hidden"
            w="100%"
            disabled={isSubmitSuccessful}
            {...register('message', { required: true })}
          />
          <FormErrorMessage>Este campo es obligatorio</FormErrorMessage>
        </FormControl>

        <Flex px="2rem">
          <Input
            type="submit"
            borderRadius="none"
            textTransform="uppercase"
            disabled={sending || isSubmitSuccessful}
            value={buttonText}
            bg={sending ? 'lightGray' : isSubmitSuccessful ? 'green' : 'primary'}
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
      </Stack>
    </Box>
  )
}

export default ContactForm
