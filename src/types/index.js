/**
 * الأنواع والثوابت الأساسية للنظام
 */

/** خيارات الحقول التي تُعرض كقوائم منسدلة أو أزرار اختيار */
export const DROPDOWNS = {
  maritalStatus: [
    { value: 'أعزب', label: 'أعزب' },
    { value: 'متزوج', label: 'متزوج' },
    { value: 'مطلق', label: 'مطلق' },
    { value: 'أرمل', label: 'أرمل' },
  ],
  educationLevel: [
    { value: 'دكتوراه', label: 'دكتوراه' },
    { value: 'ماجستير', label: 'ماجستير' },
    { value: 'بكالوريوس', label: 'بكالوريوس' },
    { value: 'دبلوم', label: 'دبلوم' },
    { value: 'توجيهي', label: 'توجيهي' },
    { value: 'أقل من توجيهي', label: 'أقل من توجيهي' },
  ],
  workNature: [
    { value: 'موظف حكومي', label: 'موظف حكومي' },
    { value: 'قطاع خاص', label: 'قطاع خاص' },
    { value: 'عسكري', label: 'عسكري' },
    { value: 'طالب', label: 'طالب' },
    { value: 'أعمال حرة', label: 'أعمال حرة' },
    { value: 'متقاعد', label: 'متقاعد' },
    { value: 'لا يعمل', label: 'لا يعمل' },
  ],
  bloodType: [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ],
}

/**
 * بنية البيانات المُرسلة عند تسجيل فرد جديد
 * - تتطابق مع ترتيب أعمدة Google Sheets (بدون عمود ID)
 */
export const SHEET_COLUMNS = [
  'تاريخ التسجيل',
  'الاسم الرباعي',
  'الرقم الوطني',
  'تاريخ الميلاد',
  'الحالة الاجتماعية',
  'المؤهل العلمي',
  'التخصص',
  'طبيعة العمل',
  'مكان السكن',
  'رقم الهاتف',
  'نوع الدم',
  'مشترك بالجمعية',
]

/** أساس النموذج الذي يُدخله المستخدم */
export const EMPTY_FORM = {
  fullName: '',
  nationalId: '',
  birthDate: '',
  maritalStatus: '',
  educationLevel: '',
  specialization: '',
  workNature: '',
  residence: '',
  phone: '',
  bloodType: '',
  isSocietyMember: '',
}

/**
 * الاستجابة القياسية من Google Apps Script
 * success: true | false
 * message: نص عربي للعرض
 * data: أي بيانات (سجل، قائمة، معرف...)
 * status: رمز الخطأ عند الفشل
 */
export const SCRIPT_RESPONSE_SHAPE = {
  success: false,
  message: '',
  data: null,
  status: 200,
}

/** خريطة رسائل خطأ الحقول للعرض بالعربية */
export const FIELD_LABELS = {
  fullName: 'الاسم الرباعي',
  nationalId: 'الرقم الوطني',
  birthDate: 'تاريخ الميلاد',
  maritalStatus: 'الحالة الاجتماعية',
  educationLevel: 'المؤهل العلمي',
  specialization: 'التخصص',
  workNature: 'طبيعة العمل',
  residence: 'مكان السكن',
  phone: 'رقم الهاتف',
  bloodType: 'نوع الدم',
  isSocietyMember: 'مشترك بالجمعية',
}