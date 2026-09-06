import { motion } from 'framer-motion'
import { CheckCircle2, UserPlus } from 'lucide-react'
import Button from '../ui/Button'

/**
 * صفحة النجاح بعد إتمام التعبئة
 * - علامة صح متحركة
 * - نص شكر
 * - زر لإضافة شخص آخر
 */
export default function SuccessPage({ onAddAnother }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center sm:py-24">
      {/* علامة النجاح المتحركة */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
        >
          <CheckCircle2 className="h-12 w-12 text-green-500" strokeWidth={2.2} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-2xl font-extrabold text-maroon-800 sm:text-3xl"
      >
        تم إرسال البيانات بنجاح
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 text-base text-gray-600"
      >
        شكراً لكم على تعبئة البيانات. سيتم التواصل معك عند الحاجة.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button onClick={onAddAnother} icon={UserPlus} className="px-6 py-3">
          إضافة شخص آخر
        </Button>
      </motion.div>
    </div>
  )
}