import React from 'react'

import { Divider} from '@chakra-ui/layout'
import { Grid, Stack, Box, Text, Tooltip, StackProps } from '@chakra-ui/react'
import usePricesList2 from '../hooks/usePriceList2'
import PromoTooltip from './PromoTooltip'
import IvaTooltip from './IvaTooltip'

const PriceList2: React.FC<StackProps> = ({ ...props }) => {
  const prices2 = usePricesList2()

  return (
    <Stack
      direction={['column', 'column', 'row']}
      mt="2rem"
      mb="2rem"
      spacing={['1rem', '1rem', '0.5rem']}
      align={['center', 'center', 'stretch']}
      {...props}
    >
      {prices2.map((price2) => (
        <>
          <Grid
            w="50%"
            align="center"
            position="relative"
            justify="start"
            templateColumns="1"
            templateRows="auto 1fr auto"
            key={price2.key}
            flex="1"
            bg="white"
            boxShadow="md"
            py="1"
            overflow="visible"
          >
            <PromoTooltip price={price2} />
            <Box>
              <Text>{price2.text} </Text>
              <Divider display={['block', 'block', 'block']} marginBottom="1rem" color="primary" />
            </Box>
            <Box>
              <Text
                color="primary"
                fontSize="2xl"
                py="1"
                fontWeight="semiBold"
                textTransform="uppercase"
              >
                ${price2.price}
              </Text>
              <IvaTooltip price={price2}></IvaTooltip>
            </Box>
            <Box alignSelf="start">
              {price2.key !== 1 ? (
                <Text fontSize="sm" opacity="0.75" color="text" justifySelf="center" marginTop="1.8rem">
                  ${Math.ceil(price2.price / price2.key)} por día
                </Text>
              ) : null}
            </Box>
          </Grid>
          {price2.promo ? (
            <Box display={['block', 'block', 'none']} w="100%" pb="0.5rem" />
          ) : null}
        </>
      ))}
    </Stack>
  )
}

export default PriceList2