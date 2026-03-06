import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5 font-sora">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-dark-surface border rounded-lg text-slate-200 placeholder-slate-500 font-sora text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
          error ? 'border-red-500' : 'border-slate-600'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400 font-sora">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
