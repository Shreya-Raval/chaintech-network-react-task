import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ShoppingBag,
  ArrowRight,
  Package,
  Sparkles,
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import toast from 'react-hot-toast'

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  // Track items being removed for animation
  const [removingIds, setRemovingIds] = useState(new Set())

  const handleRemove = (id) => {
    setRemovingIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      removeFromCart(id)
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 300)
  }

  const handleCheckout = () => {
    toast('Checkout coming soon! This is a demo.', {
      icon: '🚀',
    })
  }

  // ── Empty cart ──────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in-up">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-3xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 max-w-sm mb-8">
            Looks like you haven't added any products yet. Browse our collection to find something you love.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
          <p className="text-slate-400 text-sm mt-1">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Cart Items ───────────────────────────────── */}
        <div className="flex-1 space-y-3">
          {cartItems.map((item) => {
            const isRemoving = removingIds.has(item.id)
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 bg-dark-surface border border-slate-700/50 rounded-2xl transition-all duration-300 ${
                  isRemoving
                    ? 'opacity-0 translate-x-8 scale-95'
                    : 'opacity-100 translate-x-0 scale-100'
                }`}
              >
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-800/50 overflow-hidden shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-200 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 capitalize mt-0.5">
                    {item.category}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors active:scale-95"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors active:scale-95"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-bold text-white w-20 text-right shrink-0 hidden sm:block">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>

        {/* ── Order Summary ────────────────────────────── */}
        <div className="lg:w-80 xl:w-96 shrink-0">
          <div className="bg-dark-surface border border-slate-700/50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-5">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-3 mb-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-400 truncate max-w-[60%]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-slate-300 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-700/50 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-semibold text-white">Total</span>
              <span className="text-xl font-bold text-white">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
            >
              <Sparkles size={16} />
              Proceed to Checkout
            </button>

            {/* Continue shopping */}
            <Link
              to="/products"
              className="w-full mt-3 py-2.5 px-4 border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Package size={15} />
              Continue Shopping
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
