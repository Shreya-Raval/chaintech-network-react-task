import { ShoppingCart, Check, Star, StarHalf } from 'lucide-react'

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const {
    title,
    price,
    thumbnail,
    category,
    rating,
    discountPercentage,
  } = product

  const showDiscount = discountPercentage > 10

  // Render star rating
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={13} className="fill-amber-400 text-amber-400" />
      )
    }
    if (hasHalf) {
      stars.push(
        <StarHalf key="half" size={13} className="fill-amber-400 text-amber-400" />
      )
    }
    const empty = 5 - fullStars - (hasHalf ? 1 : 0)
    for (let i = 0; i < empty; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={13} className="text-slate-600" />
      )
    }
    return stars
  }

  return (
    <div className="group bg-dark-surface border border-slate-700/50 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-slate-600/50 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-slate-800/50 overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-accent/90 text-dark-bg text-xs font-semibold backdrop-blur-sm">
          {category}
        </span>
        {/* Discount badge */}
        {showDiscount && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-500/90 text-white text-xs font-bold backdrop-blur-sm">
            -{Math.round(discountPercentage)}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-snug min-h-[2.5rem]">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">{renderStars(rating)}</div>
          <span className="text-xs text-slate-500">{rating.toFixed(1)}</span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-white">${price.toFixed(2)}</span>
            {showDiscount && (
              <span className="text-xs text-slate-500 line-through">
                ${(price / (1 - discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => !isInCart && onAddToCart(product)}
            disabled={isInCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isInCart
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-primary/15 text-primary-300 border border-primary/30 hover:bg-primary/25 hover:border-primary/50 active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={14} strokeWidth={3} />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
