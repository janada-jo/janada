import { cn } from '../../utils/cn'

/** حقل نصي مخصص مع تلميح ولون خطأ/نجاح */
export default function Input({
  label,
  error,
  hint,
  success,
  icon: Icon,
  className,
  id,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-400"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          className={cn(
            'w-full rounded-xl border bg-card px-4 py-2.5 text-sm text-ink placeholder:text-gray-400',
            'transition-all duration-200 focus:outline-none focus:ring-2',
            Icon && 'ps-10',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : success
                ? 'border-green-400 focus:border-green-500 focus:ring-green-100'
                : 'border-line focus:border-maroon-400 focus:ring-maroon-100',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
      {!error && success && (
        <p className="mt-1.5 text-xs font-medium text-green-600">{success}</p>
      )}
      {!error && !success && hint && (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  )
}