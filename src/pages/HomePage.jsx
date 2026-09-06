import { useState } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import RegistrationForm from '../components/home/RegistrationForm'
import SuccessPage from '../components/home/SuccessPage'

/**
 * الصفحة الرئيسية
 * - Hero ترحيبي
 * - الفورم الكامل (يظهر عند التمرير)
 * - صفحة نجاح بعد الإرسال
 */
export default function HomePage() {
  const [submitted, setSubmitted] = useState(false)

  const handleFormSuccess = () => {
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddAnother = () => {
    setSubmitted(false)
    const formSection = document.getElementById('registration')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden bg-surface">
      <div id="registration" className="flex-1">
        <Hero
          onStart={() =>
            document
              .getElementById('registration')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        />

        {/* الجسم الرئيسي */}
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          {submitted ? (
            <SuccessPage onAddAnother={handleAddAnother} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <RegistrationForm onSuccess={handleFormSuccess} />
            </motion.div>
          )}
        </div>
      </div>

      {/* تذييل الصفحة */}
      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-xs text-gray-500">
            ديوان عائلة الجنادا - عشيرة الزيود
          </p>
          <p className="text-xs text-gray-400">
            جميع البيانات تُستخدم لأغراض ديوان العائلة فقط
          </p>
        </div>
      </footer>
    </div>
  )
}