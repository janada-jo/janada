import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

/** بطاقة عرض أنيقة مع حركة Fade-up هادئة */
export default function Card({ className, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border border-line bg-card shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}