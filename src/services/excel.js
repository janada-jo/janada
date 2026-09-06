import { SHEET_COLUMNS } from '../types'

/**
 * تصدير البيانات إلى ملف Excel (CSV متوافق مع Excel)
 */

/** تحويل سجلات العائلة إلى صفوف حسب أعمدة الجدول (بدون ID) */
const toRows = (members) =>
  members.map((m) => [
    m.registrationDate,
    m.fullName,
    m.nationalId,
    m.birthDate,
    m.maritalStatus,
    m.educationLevel,
    m.specialization,
    m.workNature,
    m.residence,
    m.phone,
    m.bloodType,
    m.isSocietyMember,
  ])

/** إنشاء محتوى CSV (مع BOM لدعم العربية في Excel) */
const makeCsv = (rows) => {
  const escape = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return rows.map((r) => r.map(escape).join(',')).join('\r\n')
}

/** تنزيل ملف Excel بصيغة CSV */
export const exportExcel = (members) => {
  const csv = '\uFEFF' + makeCsv([SHEET_COLUMNS, ...toRows(members)])
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ديوان-عائلة-الجنادا.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}