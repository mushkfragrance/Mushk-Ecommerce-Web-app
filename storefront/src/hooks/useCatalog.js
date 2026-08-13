import { useCallback, useEffect, useState } from 'react'
import { storeApi, getErrorMessage } from '../lib/services'
import { normalizeProduct } from '../lib/normalize'
import { products as mockProducts } from '../data/products'

export function useProducts(params = {}, { enabled = true } = {}) {
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('api')

  const key = JSON.stringify(params)

  const load = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await storeApi.products(params)
      setProducts((data.data || []).map(normalizeProduct))
      setMeta(data.meta || null)
      setSource('api')
    } catch (err) {
      // Fallback keeps demos usable if API is down
      setSource('mock')
      setError(getErrorMessage(err))
      setProducts(mockProducts.map(normalizeProduct))
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [enabled, key])

  useEffect(() => {
    load()
  }, [load])

  return { products, meta, loading, error, source, reload: load }
}

export function useProductBySlug(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return undefined
    let alive = true
    setLoading(true)
    storeApi
      .productBySlug(slug)
      .then(({ data }) => {
        if (alive) setProduct(normalizeProduct(data.data))
      })
      .catch(async (err) => {
        const fallback = mockProducts.find((p) => p.slug === slug)
        if (alive) {
          setProduct(fallback ? normalizeProduct(fallback) : null)
          setError(getErrorMessage(err))
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [slug])

  return { product, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    storeApi
      .categories()
      .then(({ data }) => {
        if (data.data?.length) {
          setCategories(
            data.data.map((c) => ({
              ...c,
              id: c._id || c.id,
            })),
          )
        }
      })
      .catch(() => {})
  }, [])
  return categories
}

export function useHomepageMedia() {
  const [homepage, setHomepage] = useState({
    shopAllImage: '',
    bestSellersImage: '',
    showBestSellersSection: false,
    showNewArrivalsSection: false,
    showFeaturedSection: false,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    storeApi
      .homepage()
      .then(({ data }) => {
        if (!alive) return
        setHomepage({
          shopAllImage: data.data?.homepage?.shopAllImage || '',
          bestSellersImage: data.data?.homepage?.bestSellersImage || '',
          showBestSellersSection: Boolean(data.data?.homepage?.showBestSellersSection),
          showNewArrivalsSection: Boolean(data.data?.homepage?.showNewArrivalsSection),
          showFeaturedSection: Boolean(data.data?.homepage?.showFeaturedSection),
          ...data.data?.homepage,
        })
        setCategories(
          (data.data?.categories || []).map((c) => ({
            ...c,
            id: c._id || c.id,
          })),
        )
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return { homepage, categories, loading }
}
