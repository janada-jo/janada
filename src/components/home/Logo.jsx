import { motion } from 'framer-motion'
import logo from '../../assets/logo.svg'

/**
 * مكوّن الشعار.
 * إذا تعذر تحميل الصورة يتم إظهار شعار احتياطي.
 */
export default function Logo({ className = 'h-24 w-24' }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      title="شعار عائلة الجنادا"
    >
      <img
        src={logo}
        alt="شعار عائلة الجنادا"
        className="h-full w-full object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fallback = e.currentTarget.nextElementSibling
          if (fallback) fallback.style.display = 'flex'
        }}
      />

      <FallbackLogo className={className} />
    </div>
  )
}

/** شعار احتياطي */
function FallbackLogo({ className }) {
  return (
    <div
      className={`hidden h-full w-full items-center justify-center ${className}`}
      aria-label="شعار عائلة الجنادا"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full w-full items-center justify-center"
      >
        <svg
          viewBox="0 0 100 120"
          className="h-full w-auto drop-shadow-[0_4px_12px_rgba(109,16,32,0.25)]"
          role="img"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c2a3c" />
              <stop offset="100%" stopColor="#6D1020" />
            </linearGradient>
          </defs>

          <path
            d="M50 6 L90 20 V60 C90 86 72 104 50 114 C28 104 10 86 10 60 V20 Z"
            fill="url(#shieldGrad)"
            stroke="#C8A04D"
            strokeWidth="2.5"
          />

          <path
            d="M50 16 L50 100 M50 16 C42 30 32 34 22 34 M50 16 C58 30 68 34 78 34"
            fill="none"
            stroke="#C8A04D"
            strokeWidth="1.5"
            opacity="0.4"
          />

          <path
            d="M50 36 L57 52 L74 54 L61 66 L65 83 L50 74 L35 83 L39 66 L26 54 L43 52 Z"
            fill="#C8A04D"
            stroke="#F0DCA8"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </div>
  )
}