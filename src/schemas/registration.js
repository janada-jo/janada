import { z } from 'zod'

/**
 * أنظمة التحقق (Schemas) للحقول والأنواع
 * تعتمد على Zod لتوفير رسائل الخطأ العربية تلقائياً
 */

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: 'الاسم الرباعي قصير جداً' })
    .max(80, { message: 'الاسم طويل جداً' }),
  nationalId: z
    .string()
    .trim()
    .regex(/^\d{10}$/, { message: 'الرقم الوطني يجب أن يتكون من 10 أرقام' }),
  birthDate: z.string().min(1, { message: 'تاريخ الميلاد مطلوب' }),
  maritalStatus: z.string().min(1, { message: 'الحالة الاجتماعية مطلوبة' }),
  educationLevel: z.string().min(1, { message: 'المؤهل العلمي مطلوب' }),
  specialization: z.string().trim(),
  workNature: z.string().min(1, { message: 'طبيعة العمل مطلوبة' }),
  residence: z.string().trim().min(2, { message: 'مكان السكن مطلوب' }),
  phone: z
    .string()
    .trim()
    .regex(/^(07\d{8}|(\+?962|00962)7\d{8})$/, {
      message: 'أدخل رقم هاتف أردني صحيح (مثال: 07xxxxxxxx)',
    }),
  bloodType: z.string().min(1, { message: 'نوع الدم مطلوب' }),
  isSocietyMember: z.enum(['نعم', 'لا'], {
    message: 'هذا الحقل مطلوب',
  }),
})