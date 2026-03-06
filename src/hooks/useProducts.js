import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = 'https://dummyjson.com/products'
const LIMIT = 12

const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('default')
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const abortRef = useRef(null)

  const hasMore = skip + LIMIT < total

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`)
        const data = await res.json()
        // API returns array of { slug, name, url } objects
        setCategories(data)
      } catch {
        // Silently fail — categories are non-critical
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Build URL based on filters
  const buildUrl = useCallback((currentSkip) => {
    if (search.trim()) {
      return `${API_BASE}/search?q=${encodeURIComponent(search.trim())}&limit=${LIMIT}&skip=${currentSkip}`
    }
    if (category) {
      return `${API_BASE}/category/${encodeURIComponent(category)}?limit=${LIMIT}&skip=${currentSkip}`
    }
    return `${API_BASE}?limit=${LIMIT}&skip=${currentSkip}`
  }, [search, category])

  // Sort products client-side
  const sortProducts = useCallback((productsList) => {
    const sorted = [...productsList]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        return sorted
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        return sorted
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        return sorted
      default:
        return sorted
    }
  }, [sort])

  // Fetch products (initial or reset)
  const fetchProducts = useCallback(async () => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setSkip(0)

    try {
      const url = buildUrl(0)
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch products')
        setProducts([])
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [buildUrl])

  // Load more (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextSkip = skip + LIMIT

    try {
      const url = buildUrl(nextSkip)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProducts((prev) => [...prev, ...(data.products || [])])
      setSkip(nextSkip)
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load more products')
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, skip, buildUrl])

  // Retry on error
  const retry = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

  // Re-fetch when search or category changes
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Get sorted products
  const sortedProducts = sortProducts(products)

  return {
    products: sortedProducts,
    loading,
    loadingMore,
    error,
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort,
    categories,
    categoriesLoading,
    hasMore,
    loadMore,
    retry,
  }
}

export default useProducts
