import { Box, Tooltip, Text, useOutsideClick } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const PromoTooltip: React.FC<{ price: Price }> = ({ price }) => {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick({
    ref: ref,
    handler: () => setShow(false),
  })

  return price.promo ? (
    <Box
      ref={ref}
      bg="primary"
      position="absolute"
      w="100%"
      bottom={['0', '0', 'unset']}
      transform={['translate(0, 100%)', 'translate(0, 100%)', 'translate(0, -100%)']}
      onClick={() => setShow(!show)}
      cursor="pointer"
    >
      <Tooltip
        hasArrow
        placement="top"
        label={price.promo_long}
        color="text"
        bg="white"
        py="0.5"
        isOpen={show}
      >
        <Text color="white" textTransform="uppercase">
          {price.promo}
        </Text>
      </Tooltip>
    </Box>
  ) : null
}

export default PromoTooltip
