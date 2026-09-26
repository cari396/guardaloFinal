import React from 'react'

import { Divider} from '@chakra-ui/layout'
import { Grid, Stack, Box, Text, Tooltip, StackProps } from '@chakra-ui/react'
import usePricesList from '../hooks/usePriceList'
import PromoTooltip from './PromoTooltip'
import IvaTooltip from './IvaTooltip'

const PriceList: React.FC<StackProps> = ({ ...props }) => {
  const prices = usePricesList()

  return (
    <Stack
      direction={['column', 'column', 'row']}
      mt="1rem"
      mb="2rem"
      spacing={['1rem', '1rem', '0.5rem']}
      align={['center', 'center', 'stretch']}
      {...props}
    >
      {prices.map((price) => (
        <>
          <Grid
            w="50%"
            align="center"
            position="relative"
            justify="start"
            templateColumns="1"
            templateRows="auto 1fr auto"
            key={price.key}
            flex="1"
            bg="white"
            boxShadow="md"
            py="1"
            overflow="visible"
          >
            <PromoTooltip price={price} />
            <Box>
              <Text>{price.text}</Text>
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
                ${price.price}
              </Text>
              <IvaTooltip price={price}></IvaTooltip>
            </Box>
            <Box alignSelf="start">
              {price.key !== 1 ? (
                <Text fontSize="0.9rem" opacity="0.75" color="text" justifySelf="center" marginTop="1.8rem">
                  ${Math.ceil(price.price / price.key)} por día
                </Text>
              ) : null}
            </Box>
          </Grid>
          {price.promo ? (
            <Box display={['block', 'block', 'none']} w="100%" pb="0.5rem" />
          ) : null}
        </>
      ))}
    </Stack>
  )
}

export default PriceList
