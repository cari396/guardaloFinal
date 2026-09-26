import React from 'react'
import { Image, Flex } from '@chakra-ui/react'

import visa from '../images/payment/visa.svg'
import visaDebito from '../images/payment/visa_debito.svg'
import mastercard from '../images/payment/mastercard.svg'
import mastercardDebito from '../images/payment/mastercard_debito.svg'
import mercadopago from '../images/payment/mercado_pago.svg'

const images = [
  {
    name: 'MercadoPago',
    src: mercadopago,
  },
  {
    name: 'Visa',
    src: visa,
  },

  {
    name: 'Visa débito',
    src: visaDebito,
  },
  {
    name: 'Mastercard',
    src: mastercard,
  },

  {
    name: 'Mastercard débito',
    src: mastercardDebito,
  },
  {
    name:'Cabal credito',
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Nuevo_logo_cabal.gif'
    },
    {
    name: 'Cabal debito',
    src: 'https://www.viumi.com.ar/images/debcabal.png'
    },
    {
    name: 'Tarjeta maestro',
    src: 'https://s3-eu-west-1.amazonaws.com/rankia/images/valoraciones/0023/4410/maestro_foro.png?1461935189',
    }
 
]

const PaymentImages: React.FC = () => (
  <Flex direction="row" mt="2rem" mb="1rem" alignItems="flex-start" wrap="wrap">
    {images.map((i) => (
      <Image key={i.name} src={i.src} alt={`Logo de {i.name}`} height="32px" mr="1rem" />
    ))}
  </Flex>
)

export default PaymentImages
