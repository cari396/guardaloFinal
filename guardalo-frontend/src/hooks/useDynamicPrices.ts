import { useEffect, useState } from 'react'
import { priceApi } from '../services/api'

interface ApiPrice {
  id: number
  period: string
  amount: string | number
  promo_text: string | null
  size_category: string | null
  sort_order: number
}

const CACHE_KEY = 'guardalo_prices_cache'

/**
 * Normalizes period text for comparison (e.g. "1 día" vs "1 DÍA")
 */
function normalizeText(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract numeric days from a string or key (e.g. "30 días" -> 30, key 100 -> 90)
 */
function extractDays(val: string | number): number | null {
  if (typeof val === 'number') {
    if (val === 100) return 90
    if (val === 210) return 180
    return val
  }
  const match = (val || '').match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Merges static Gatsby prices with dynamic prices from Laravel API.
 */
function mergePrices(
  defaultPrices: Price[],
  apiPrices: ApiPrice[],
  sizeCategory: 'Pequeño' | 'Mediano' | 'Grande'
): Price[] {
  if (!apiPrices || apiPrices.length === 0) return defaultPrices

  // Filter apiPrices for this size category
  const targetCategory = normalizeText(sizeCategory)
  const filteredApi = apiPrices.filter((ap) => {
    if (!ap.size_category) return true
    const cat = normalizeText(ap.size_category)
    return cat.includes(targetCategory)
  })

  if (filteredApi.length === 0) return defaultPrices

  return defaultPrices.map((defPrice) => {
    const defNorm = normalizeText(defPrice.text)
    const defDays = extractDays(defPrice.key) || extractDays(defPrice.text)

    // Match with API price by:
    // 1. Number of days (e.g. 30 === 30)
    // 2. Normalized string startsWith / exact match
    const match = filteredApi.find((ap) => {
      const apiDays = extractDays(ap.period)
      if (defDays && apiDays && defDays === apiDays) {
        return true
      }
      const apiNorm = normalizeText(ap.period)
      return apiNorm === defNorm || apiNorm.startsWith(defNorm) || defNorm.startsWith(apiNorm)
    })

    if (match) {
      return {
        ...defPrice,
        price: Number(match.amount),
        promo: match.promo_text || defPrice.promo,
      }
    }
    return defPrice
  })
}

export function useDynamicPrices(
  defaultPrices: Price[],
  sizeCategory: 'Pequeño' | 'Mediano' | 'Grande'
): Price[] {
  const [prices, setPrices] = useState<Price[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed: ApiPrice[] = JSON.parse(cached)
          return mergePrices(defaultPrices, parsed, sizeCategory)
        }
      } catch (e) {
        // Fallback to default
      }
    }
    return defaultPrices
  })

  useEffect(() => {
    let isMounted = true

    const fetchPrices = () => {
      priceApi
        .getPrices()
        .then((res) => {
          if (!isMounted) return
          if (res.data && res.data.prices && res.data.prices.length > 0) {
            const apiList: ApiPrice[] = res.data.prices
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(apiList))
              } catch (e) {}
            }
            setPrices(mergePrices(defaultPrices, apiList, sizeCategory))
          }
        })
        .catch(() => {})
    }

    fetchPrices()

    // Listen for custom event when admin edits a price
    const handleUpdate = () => {
      fetchPrices()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('prices_updated', handleUpdate)
    }

    return () => {
      isMounted = false
      if (typeof window !== 'undefined') {
        window.removeEventListener('prices_updated', handleUpdate)
      }
    }
  }, [defaultPrices, sizeCategory])

  return prices
}

export default useDynamicPrices
