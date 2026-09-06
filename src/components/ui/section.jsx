import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'

/** عنوان قسم داخل الفورم مع شريط ذهبي جانبي */
export function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-maroon-50 text-maroon-800">
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
      </span>
      <div>
        <h3 className="text-base font-bold text-maroon-800">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  )
}

/** رسالة خطأ/نجاح قابلة للانحلال عند الحاجة */
export function FormMessage({ visible, success = false, children }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn(
            'rounded-xl border px-4 py-3 text-sm font-medium',
            success
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}