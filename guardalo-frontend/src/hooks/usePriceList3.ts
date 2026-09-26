import { graphql, useStaticQuery } from 'gatsby'
import useDynamicPrices from './useDynamicPrices'

const usePricesList3 = (): Price[] => {
  const { data } = useStaticQuery<{ data: { prices3: Price[] } }>(graphql`
  query pricesListAndpricesListAndpricesListAndPricesListAndpricesListAndpricesListAndPricesListAndpricesListAndpricesListAndPricesListAndpricesListAndpricesList {
      data: preciosYaml {
        prices3 {
          key
          text
          price
          promo
          promo_long
        }
      }
    }
  `)

  return useDynamicPrices(data.prices3, 'Grande')
}

export default usePricesList3