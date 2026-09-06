import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

/**
 * زر قابل لإعادة الاستخدام مع دعم حالات التحميل والأيقونات
 * - يتحول إلى شريط تحميل عند إرسال النموذج
 * - يكبر قليلاً عند التمرير (Hover) مع حركة هادئة
 */
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  ...props
}) {
  const variants = {
    primary:
      'bg-maroon-800 text-white hover:bg-maroon-900 focus-visible:ring-maroon-800',
    outline:
      'border border-maroon-800 text-maroon-800 bg-transparent hover:bg-maroon-50 focus-visible:ring-maroon-800',
    ghost: 'text-maroon-800 bg-maroon-50 hover:bg-maroon-100 focus-visible:ring-maroon-800',
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold',
        'transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          جاري حفظ البيانات...
        </span>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          {children}
        </>
      )}
    </motion.button>
  )
}