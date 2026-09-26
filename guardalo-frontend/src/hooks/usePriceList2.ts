import { graphql, useStaticQuery } from 'gatsby'
import useDynamicPrices from './useDynamicPrices'

const usePricesList2 = (): Price[] => {
  const { data } = useStaticQuery<{ data: { prices2: Price[] } }>(graphql`
    query pricesListAndpricesListAndpricesListAndpricesList {
      data: preciosYaml {
        prices2 {
          key
          text
          price
          promo
          promo_long
        }
      }
    }
  `)

  return useDynamicPrices(data.prices2, 'Mediano')
}

export default usePricesList2