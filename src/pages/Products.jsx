import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, SlidersHorizontal, ChevronDown, AlertCircle, RefreshCw, PackageSearch } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ui/ProductCard'

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
]

const Products = () => {
  const {
    products,
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
    hasMore,
    loadMore,
    retry,
  } = useProducts()

  const { addToCart, isInCart } = useCart()
  const [searchInput, setSearchInput] = useState('')
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)

  // Debounced search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setSearch])

  // IntersectionObserver for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
        loadMore()
      }
    },
    [hasMore, loading, loadingMore, loadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    observerRef.current = new IntersectionObserver(handleObserver, { rootMargin: '200px' })
    observerRef.current.observe(sentinel)
    return () => { if (observerRef.current) observerRef.current.disconnect() }
  }, [handleObserver])

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Products</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Browse our curated collection of premium products
        </p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none w-full sm:w-48 pl-9 pr-9 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            !category
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const slug = typeof cat === 'string' ? cat : cat.slug
          const name = typeof cat === 'string' ? cat : cat.name
          return (
            <button
              key={slug}
              onClick={() => setCategory(slug)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${
                category === slug
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-500 dark:text-red-400" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium">Something went wrong</p>
          <p className="text-slate-500 text-sm mt-1 max-w-sm">{error}</p>
          <button
            onClick={retry}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-primary/10 dark:bg-primary/15 text-primary-600 dark:text-primary-400 border border-primary/20 dark:border-primary/30 rounded-xl text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/25 transition-colors"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800/70" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-100 dark:bg-slate-800/70 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/70 rounded-lg w-1/2" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-slate-100 dark:bg-slate-800/70 rounded-full" />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 bg-slate-100 dark:bg-slate-800/70 rounded-lg w-16" />
                  <div className="h-8 bg-slate-100 dark:bg-slate-800/70 rounded-xl w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <PackageSearch size={28} className="text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium">No products found</p>
          <p className="text-slate-500 text-sm mt-1">
            {search
              ? `No results for "${search}". Try a different search term.`
              : 'Try selecting a different category or clearing filters.'}
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isInCart={isInCart(product.id)}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading more spinner */}
      {loadingMore && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Loading more products...</span>
        </div>
      )}

      {/* End of results */}
      {!loading && !hasMore && products.length > 0 && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 py-4">
          You've reached the end — {products.length} products displayed
        </p>
      )}
    </div>
  )
}

export default Products
