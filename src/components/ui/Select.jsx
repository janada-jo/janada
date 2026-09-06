import { cn } from '../../utils/cn'

/** قائمة منسدلة مخصصة مع دعم الأيقونة */
export default function Select({
  label,
  error,
  options,
  placeholder,
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
        <select
          id={id}
          className={cn(
            'w-full appearance-none rounded-xl border bg-card px-4 py-2.5 text-sm text-ink',
            'transition-all duration-200 focus:outline-none focus:ring-2',
            Icon ? 'ps-10' : '',
            'pe-10',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-line focus:border-maroon-400 focus:ring-maroon-100',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.25 8.23a.75.75 0 01.02-1.02z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  )
}