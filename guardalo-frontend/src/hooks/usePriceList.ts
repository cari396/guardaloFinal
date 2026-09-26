import { graphql, useStaticQuery } from 'gatsby'
import useDynamicPrices from './useDynamicPrices'

const usePricesList = (): Price[] => {
  const { data } = useStaticQuery<{ data: { prices: Price[] } }>(graphql`
    query pricesList {
      data: preciosYaml {
        prices {
          key
          text
          price
          promo
          promo_long
        }
      }
    }
  `)

  return useDynamicPrices(data.prices, 'Pequeño')
}

export default usePricesList
