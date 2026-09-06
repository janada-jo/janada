/**
 * أدوات تنسيق وتلخيص البيانات
 */

/** تنسيق تاريخ الإدخال (yyyy-mm-dd) إلى تنسيق عربي مقروء */
export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value + 'T00:00:00')
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/** تنسيق تاريخ طويل مع الوقت */
export const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** تحويل قيمة مشترك بالجمعية إلى نص عربي */
export const formatSociety = (value) => {
  if (value === 'نعم') return 'نعم'
  if (value === 'لا') return 'لا'
  return value || '—'
}

/** توليد معرّف فريد للصف */
export const generateId = () =>
  'M' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/** تاريخ اليوم الحالي بسلسلة */
export const getTodayISO = () => new Date().toISOString().slice(0, 10)
