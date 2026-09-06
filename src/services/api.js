import axios from 'axios'

/**
 * نقطة الوصول إلى Google Apps Script.
 *
 * ملاحظة مهمة حول CORS:
 * - يُستخدم POST مع `Content-Type: text/plain` حتى لا يرسل المتصفح طلب
 *   فحص مسبق (preflight) لأن Apps Script لا يدعمه.
 * - يجب أن يكون نشر الخدمة بإعداد access = ANYONE_ANONYMOUS حتى تُرجع
 *   Google ترويسة Access-Control-Allow-Origin (راجع appsscript.json).
 * - بعد أي تعديل على Code.gs يجب إصدار إصدار جديد من النشر:
 *   Deploy > Manage deployments > Edit > Version > New version.
 */
const SCRIPT_URL =
  import.meta.env.VITE_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbw7jvBOePbRCon6PYoNsA4kDZiI4gGwatmVbNJaiIQ1vLSBz_kKYxCPvXhtBun2Y6fc/exec";

/** قاعدة عنوان الـ API (للوصول من عدة ملفات) */
export const API_BASE = SCRIPT_URL

const client = axios.create({
  baseURL: SCRIPT_URL,
  timeout: 25000,
  // نص عادي لتجنّب CORS preflight
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
})

/** خطأ اتصال/استجابة غير متوقعة برسالة عربية واضحة */
const networkError = (detail) => {
  const err = new Error(
    'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت وحاول مجدداً'
  )
  err.original = new Error(detail || '')
  return err
}

/** تحويل الاستجابة إلى كائن، حتى لو جاءت نصاً (صفحة خطأ من Google) */
const toObject = (body) => {
  if (body && typeof body === 'object') return body

  const trimmed = String(body ?? '').trim()
  if (!trimmed) throw networkError('الاستجابة فارغة من الخادم')

  try {
    return JSON.parse(trimmed)
  } catch {
    throw networkError('استجابة غير JSON من الخادم: ' + trimmed.slice(0, 120))
  }
}

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

    const body = toObject(data)

    if (body.success === undefined) {
      throw networkError('استجابة غير متوقعة من الخادم')
    }

    // حالة عدم النجاح المعنوية تُرمى كخطأ ليتم التعامل معها بالرسالة العربية
    if (body.success === false) {
      const err = new Error(body.message || 'حدث خطأ غير متوقع')
      err.status = body.status
      err.payload = body
      throw err
    }

    return body
  } catch (error) {
    if (error.status || error.payload) throw error
    throw networkError(error.message)
  }
}

/**
 * تسجيل فرد جديد في Google Sheets
 * - يرفض الخادم الطلب إذا كان الرقم الوطني مسجلاً مسبقاً (رمز 409)
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
  post('read', {
    adminKey,
  })

/**
 * حذف سجل بواسطة الرقم الوطني (المفتاح الوحيد في الجدول)
 * @param {string} adminKey كلمة مرور الإدارة
 * @param {string} nationalId الرقم الوطني للسجل
 */
export const deleteMember = (adminKey, nationalId) =>
  post('delete', { adminKey, nationalId })

/**
 * تحديث سجل موجود بالكامل
 * @param {string} adminKey كلمة مرور الإدارة
 * @param {object} row بيانات كاملة (يجب أن تتضمن nationalId)
 * @param {string} originalNationalId الرقم الوطني الأصلي قبل التعديل
 */
export const updateMember = (adminKey, row, originalNationalId) =>
  post('update', { adminKey, row, originalNationalId })