import { motion } from 'framer-motion'
import { ArrowDown, Users } from 'lucide-react'
import Logo from './Logo'

/**
 * القسم الترحيبي في الصفحة الرئيسية
 * - شعار العائلة (يُستبدل من assets/logo.svg)
 * - العنوان والترحيب
 * - زر يمرّر بانسيابية إلى الفورم
 */
export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden">
      {/* خلفية زخرفية ناعمة */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-surface"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-maroon-50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 end-10 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-14 pt-16 text-center sm:pt-24">
        {/* الشعار */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo className="h-24 w-24 sm:h-28 sm:w-28" />
        </motion.div>

        {/* العنوان */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-3xl font-extrabold leading-tight text-maroon-800 sm:text-4xl"
        >
          ديوان عائلة الجنادا
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-2 text-lg font-semibold text-gold-600"
        >
          عشيرة الزيود
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-6 w-14 border-t-2 border-gold-500"
        />

        {/* الترحيب */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-7 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg"
        >
          <p>مرحبًا بكم في سجل أبناء عائلة الجنادا.</p>
          <p>
            يهدف هذا النظام إلى إنشاء قاعدة بيانات حديثة ومنظمة لأبناء العائلة
            بما يسهم في تسهيل التواصل وتنظيم المعلومات ودعم أنشطة الديوان.
          </p>
          <p className="rounded-xl bg-gold-400/10 px-4 py-3 text-sm text-gold-700 sm:text-base">
            نرجو تعبئة البيانات بدقة، مع العلم أن جميع المعلومات ستستخدم لأغراض
            ديوان العائلة فقط.
          </p>
        </motion.div>

        {/* زر البدء */}
        <motion.button
          onClick={onStart}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-9 inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-8 py-3.5 text-base font-bold text-white shadow-gold transition-colors duration-200 hover:bg-maroon-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800 focus-visible:ring-offset-2"
        >
          <Users className="h-5 w-5" aria-hidden="true" />
          ابدأ التسجيل
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>
    </section>
  )
}