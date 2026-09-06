import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

/** أزرار الخيارات (Radio) بنمط مريح للجوال (كبّارة) */
export default function RadioGroup({
  name: _name,
  value,
  onChange,
  options,
  error,
  disabled = false,
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <motion.button
              key={opt.value}
              type="button"
              disabled={disabled}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800 focus-visible:ring-offset-2',
                selected
                  ? 'border-maroon-800 bg-maroon-800 text-white shadow-sm'
                  : 'border-line bg-card hover:border-maroon-300 hover:bg-maroon-50',
                error && !selected && 'border-red-300',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border',
                  selected ? 'border-white bg-white/20' : 'border-maroon-300'
                )}
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
              {opt.label}
            </motion.button>
          )
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  )
}