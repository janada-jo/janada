/**
 * أدوات التحقق من صحة البيانات (Validators)
 */

/** التحقق من أن الرقم الوطني أردني صحيح (10 أرقام تبدأ بـ 0-9) */
export const validateNationalId = (value) => {
  const v = String(value ?? '').trim()
  if (!v) return 'الرقم الوطني مطلوب'
  if (!/^\d+$/.test(v)) return 'الرقم الوطني يجب أن يتكون من أرقام فقط'
  if (v.length !== 10) return 'الرقم الوطني يجب أن يتكون من 10 أرقام'
  return true
}

/**
 * التحقق من صحة رقم الهاتف الأردني.
 * - يبدأ بـ 07 أو +9627 أو 009627
 * - إجمالي 9 أرقام بعد المفتاح
 */
export const validatePhone = (value) => {
  const v = String(value ?? '').trim()
  if (!v) return 'رقم الهاتف مطلوب'

  const patterns = [
    /^07\d{8}$/,
    /^\+9627\d{8}$/,
    /^009627\d{8}$/,
    /^9627\d{8}$/,
  ]

  if (!patterns.some((p) => p.test(v.replace(/\s+/g, ''))))
    return 'أدخل رقم هاتف أردني صحيح (مثال: 07xxxxxxxx)'

  return true
}

/** التحقق من البيانات الأساسية في النموذج */
export const validateRequired = (value) => {
  if (!value || !String(value).trim()) return 'هذا الحقل مطلوب'
  return true
}

/**
 * توحيد شكل الرقم الوطني لإزالة الفراغات والرموز الغير رقمية
 */
export const normalizeNationalId = (value) => String(value ?? '').replace(/\D/g, '')

/**
 * توحيد شكل رقم الهاتف بحذف الفراغات
 */
export const normalizePhone = (value) => String(value ?? '').replace(/\s+/g, '')
