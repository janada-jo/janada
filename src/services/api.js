import axios from 'axios'

/**
 * نقطة الوصول إلى Google Apps Script.
 * عدد الطلبات المسموح بها من المستعرض محدود، لذلك يتجنّب الكود
 * الـ preflight (OPTIONS) باستخدام نص عادي خفيف.
 */
const SCRIPT_URL =
  import.meta.env.VITE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbzs3a5jL08k_gcs2Jfc6Fx9p6Xlphv2ejQbgnaeS_duCOl9yYJrIYSZerIMMam5CULt/exec'

/** قاعدة عنوان الـ API (للوصول من عدة ملفات) */
export const API_BASE = SCRIPT_URL

const client = axios.create({
  baseURL: SCRIPT_URL,
  timeout: 25000,
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
})

/**
 * إرسال طلب إلى الـ API العام.
 * يستخدم POST مع `text/plain` لتجنّب CORS preflight.
 */
const post = async (action, payload) => {
  try {
    const { data } = await client.post(
      '',
      JSON.stringify({ action, ...payload })
    )
    // حالة عدم النجاح معنوية تُرمى كخطأ ليتم التعامل معها بالرسالة العربية
    if (data && data.success === false) {
      const err = new Error(data.message || 'حدث خطأ غير متوقع')
      err.status = data.status
      err.payload = data
      throw err
    }
    return data
  } catch (error) {
    if (error.status || error.payload) throw error
    const err = new Error(
      'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت وحاول مجدداً'
    )
    err.original = error
    throw err
  }
}

/**
 * تسجيل فرد جديد في Google Sheets
 * - يرفض الطلب إذا كان الرقم الوطني مسجلاً مسبقاً (يعالجها الخادم)
 */
export const submitRegistration = (form) =>
  post('add', {
    payload: form,
  })

/**
 * الحصول على جميع السجلات - يستخدم فقط داخل لوحة التحكم
 * @param {string} adminKey كلمة مرور الإدارة
 */
export const getMembers = (adminKey) =>
  post('readAll', {
    adminKey,
  })

/**
 * حذف سجل بواسطة معرّفه
 * @param {string} adminKey كلمة مرور الإدارة
 * @param {string} id معرّف السجل
 */
export const deleteMember = (adminKey, id) =>
  post('delete', { adminKey, id })

/**
 * تحديث سجل موجود بالكامل
 * @param {string} adminKey كلمة مرور الإدارة
 * @param {object} updateRow بيانات كاملة + id
 */
export const updateMember = (adminKey, updateRow) =>
  post('update', { adminKey, row: updateRow })
