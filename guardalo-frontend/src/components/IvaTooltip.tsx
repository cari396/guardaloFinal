import { Box, Tooltip, Text, useOutsideClick } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const IvaTooltip: React.FC<{ price: Price }> = ({ price }) => {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick({
    ref: ref,
    handler: () => setShow(false),
  })

  return price.price ? (
    <Box
      ref={ref}
      bg="primary"
      position="relative"
      marginTop="1.5rem"
      w="100%"
      bottom={['0', '0', '-4']}
      transform={['translate(0, 100%)', 'translate(0, 100%)', 'translate(0, -100%)']}
      onClick={() => setShow(!show)}
      cursor="pointer"
    >
      <Tooltip
        hasArrow
        placement="bottom"
        label= "Se deberá añadir el 21% al precio"
        color="text"
        bg="white"
        py="0.5"
        isOpen={show}
      >
        <Text color="white" textTransform="uppercase" mb="0.5rem">
          +iva
        </Text>
      </Tooltip>
    </Box>
  ) : null
}

export default IvaTooltip