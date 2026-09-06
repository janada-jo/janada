import { useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Lock,
  Search,
  FileSpreadsheet,
  Pencil,
  Trash2,
  X,
  Save,
  AlertTriangle,
  LogOut,
  ShieldCheck,
  Loader2,
  UserPlus,
  RefreshCw,
  Users,
  User,
  Hash,
  CalendarDays,
  Heart,
  GraduationCap,
  BookOpen,
  Briefcase,
  MapPin,
  Phone,
  Droplets,
} from 'lucide-react'
import {
  getMembers,
  deleteMember,
  updateMember,
  submitRegistration,
} from '../services/api'
import { exportExcel } from '../services/excel'
import { formatDate } from '../utils/formatters'
import { validateNationalId, validatePhone } from '../utils/validators'
import { DROPDOWNS, EMPTY_FORM } from '../types'
import { registrationSchema } from '../schemas/registration'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import RadioGroup from '../components/ui/RadioGroup'
import { SectionTitle, FormMessage } from '../components/ui/section'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

/**
 * صفحة إدارة الديوان
 * - شاشة كلمة مرور
 * - بطاقة إحصائيات (عدد المسجلين)
 * - جدول البيانات مع بحث + إضافة + تعديل + حذف + تحديث + تصدير Excel
 */
export default function AdminPage() {
  // حالة كلمة المرور
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // بيانات الجدول
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // تعديل / حذف / إضافة
  const [editing, setEditing] = useState(null)
  const [editingOriginalId, setEditingOriginalId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [adding, setAdding] = useState(false)

  /** تسجيل الدخول بكلمة المرور */
  const handleLogin = (e) => {
    e.preventDefault()
    if (!ADMIN_PASSWORD) {
      setLoginError('لم يتم ضبط كلمة مرور الإدارة في ملف .env')
      return
    }
    if (password !== ADMIN_PASSWORD) {
      setLoginError('كلمة المرور غير صحيحة')
      return
    }
    setAuthed(true)
    loadData()
  }

  /** جلب البيانات من Google Sheets */
  const loadData = () => {
    setLoading(true)
    setError('')
    getMembers(ADMIN_PASSWORD)
      .then((res) => {
        if (res?.success) {
          // استبعاد أي عنصر ليس سجلّاً صالحاً حتى لا يُقرأ m.fullName من undefined
          const rows = Array.isArray(res.data)
            ? res.data.filter(
                (m) => m && typeof m === 'object' && typeof m.fullName === 'string'
              )
            : []
          setMembers(rows)
        } else {
          setError(res?.message || 'تعذر تحميل البيانات')
        }
      })
      .catch((err) => setError(err?.message || 'تعذر تحميل البيانات'))
      .finally(() => setLoading(false))
  }

  /** حذف سجل بالرقم الوطني */
  const handleDelete = (nationalId) => {
    setError('')
    deleteMember(ADMIN_PASSWORD, nationalId)
      .then(() =>
        setMembers((prev) => prev.filter((m) => m.nationalId !== nationalId))
      )
      .catch((err) => setError(err?.message || 'تعذر حذف البيانات'))
      .finally(() => setDeleting(null))
  }

  /** فتح نافذة التعديل مع حفظ الرقم الوطني الأصلي */
  const openEdit = (member) => {
    setEditingOriginalId(member.nationalId)
    setEditing({ ...member })
  }

  /** حفظ تعديل */
  const handleSaveEdit = () => {
    setError('')
    updateMember(ADMIN_PASSWORD, editing, editingOriginalId)
      .then(() =>
        setMembers((prev) =>
          prev.map((m) =>
            m.nationalId === editingOriginalId ? editing : m
          )
        )
      )
      .catch((err) => setError(err?.message || 'تعذر تحديث البيانات'))
      .finally(() => {
        setEditing(null)
        setEditingOriginalId(null)
      })
  }

  /** نجاح إضافة سجل جديد */
  const handleAdded = () => {
    setAdding(false)
    loadData()
  }

  // تصفية النتائج حسب البحث (بالاسم أو الرقم الوطني)
  const term = search.trim().toLowerCase()
  const filtered = term
    ? members.filter(
        (m) =>
          m.fullName?.toLowerCase().includes(term) ||
          m.nationalId?.includes(term)
      )
    : members

  /** الخروج إلى شاشة كلمة المرور */
  const handleLogout = () => {
    setAuthed(false)
    setPassword('')
    setMembers([])
  }

  // ===================== شاشة كلمة المرور =====================
  if (!authed) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-maroon-900 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon-50">
                <ShieldCheck className="h-8 w-8 text-maroon-800" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-maroon-800">
                لوحة إدارة الديوان
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                أدخل كلمة المرور للوصول إلى البيانات
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="كلمة المرور"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setLoginError('')
                }}
                placeholder="••••••••"
                icon={Lock}
                error={loginError}
                autoFocus
              />
              <Button type="submit" className="w-full">
                دخول
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ===================== لوحة البيانات =====================
  return (
    <div className="min-h-svh bg-surface">
      {/* الشريط العلوي */}
      <header className="bg-maroon-800 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold">لوحة إدارة ديوان عائلة الجنادا</h1>
            <p className="text-xs text-white/70">عشيرة الزيود - سجل الأبناء</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="!border-white/60 !text-white hover:!bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* بطاقة إحصائيات: عدد المسجلين */}
        <div
          className="mb-5 flex items-center gap-4 rounded-2xl p-5 text-white shadow-soft"
          style={{
            backgroundImage:
              'linear-gradient(120deg, #581425 0%, #6D1020 55%, #751a2b 100%)',
          }}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-500/20 ring-1 ring-gold-500/40">
            <Users className="h-7 w-7 text-gold-400" />
          </div>
          <div>
            <p className="text-sm text-white/80">عدد المسجلين في الديوان</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-gold-300">
                {members.length}
              </span>
              <span className="text-sm text-white/70">سجل</span>
            </p>
          </div>
          <div className="ms-auto hidden h-12 w-px bg-white/15 sm:block" />
          <p className="ms-auto hidden max-w-52 text-end text-xs leading-relaxed text-white/60 sm:block">
            سجل أبناء عائلة الجنادا - عشيرة الزيود
          </p>
        </div>

        <Card className="p-4 sm:p-5">
          {/* شريط البحث والإجراءات */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو الرقم الوطني..."
                className="w-full rounded-xl border border-line bg-card py-2.5 ps-10 pe-4 text-sm text-ink transition-all duration-200 focus:border-maroon-400 focus:outline-none focus:ring-2 focus:ring-maroon-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="me-1 text-xs text-gray-500">
                {members.length} سجل
                {term ? ' (نتيجة البحث)' : ''}
              </span>
              <Button
                variant="outline"
                onClick={loadData}
                disabled={loading}
                title="تحديث البيانات"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
                تحديث
              </Button>
              <Button onClick={() => setAdding(true)} disabled={loading}>
                <UserPlus className="h-4 w-4" />
                إضافة سجل
              </Button>
              <Button
                variant="outline"
                onClick={() => exportExcel(filtered)}
                disabled={!filtered.length}
              >
                <FileSpreadsheet className="h-4 w-4" />
                تصدير Excel
              </Button>
            </div>
          </div>

          {/* الجدول */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-9 w-9 animate-spin text-maroon-800" />
              <p className="mt-3 text-sm text-gray-500">جاري تحميل البيانات...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">
                {term ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد بيانات مسجلة بعد'}
              </p>
            </div>
          ) : (
            <div className="thin-scrollbar mt-4 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-line bg-maroon-50/60 text-xs text-maroon-800">
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">الاسم الرباعي</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">الرقم الوطني</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">تاريخ الميلاد</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">الحالة</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">المهنة</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">مكان السكن</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">رقم الهاتف</th>
                    <th className="whitespace-nowrap px-3 py-3 font-semibold">الجمعية</th>
                    <th className="whitespace-nowrap px-3 py-3 text-center font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr
                      key={m.nationalId}
                      className="border-b border-line transition-colors hover:bg-maroon-50/40"
                    >
                      <td className="whitespace-nowrap px-3 py-3 font-medium">{m.fullName}</td>
                      <td className="whitespace-nowrap px-3 py-3" dir="ltr">{m.nationalId}</td>
                      <td className="whitespace-nowrap px-3 py-3">{formatDate(m.birthDate)}</td>
                      <td className="whitespace-nowrap px-3 py-3">{m.maritalStatus}</td>
                      <td className="whitespace-nowrap px-3 py-3">{m.workNature}</td>
                      <td className="whitespace-nowrap px-3 py-3">{m.residence}</td>
                      <td className="whitespace-nowrap px-3 py-3" dir="ltr">{m.phone}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            m.isSocietyMember === 'نعم'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {m.isSocietyMember}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(m)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-maroon-50 hover:text-maroon-800"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleting(m)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* نافذة التعديل */}
      {editing && (
        <EditModal
          member={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* نافذة تأكيد الحذف */}
      {deleting && (
        <DeleteConfirm
          member={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => handleDelete(deleting.nationalId)}
        />
      )}

      {/* نافذة إضافة سجل جديد */}
      {adding && (
        <AddModal onClose={() => setAdding(false)} onSuccess={handleAdded} />
      )}
    </div>
  )
}

/** نافذة تعديل بيانات فرد */
function EditModal({ member, onChange, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="thin-scrollbar max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-maroon-800">تعديل البيانات</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="الاسم الرباعي"
            value={member.fullName}
            onChange={(e) => onChange({ ...member, fullName: e.target.value })}
          />
          <Input
            label="الرقم الوطني"
            value={member.nationalId}
            onChange={(e) => onChange({ ...member, nationalId: e.target.value })}
            dir="ltr"
          />
          <Input
            label="تاريخ الميلاد"
            type="date"
            value={member.birthDate}
            onChange={(e) => onChange({ ...member, birthDate: e.target.value })}
          />
          <Select
            label="الحالة الاجتماعية"
            value={member.maritalStatus}
            onChange={(e) => onChange({ ...member, maritalStatus: e.target.value })}
            options={DROPDOWNS.maritalStatus}
          />
          <Select
            label="المؤهل العلمي"
            value={member.educationLevel}
            onChange={(e) => onChange({ ...member, educationLevel: e.target.value })}
            options={DROPDOWNS.educationLevel}
          />
          <Input
            label="التخصص"
            value={member.specialization}
            onChange={(e) => onChange({ ...member, specialization: e.target.value })}
          />
          <Select
            label="طبيعة العمل"
            value={member.workNature}
            onChange={(e) => onChange({ ...member, workNature: e.target.value })}
            options={DROPDOWNS.workNature}
          />
          <Input
            label="مكان السكن"
            value={member.residence}
            onChange={(e) => onChange({ ...member, residence: e.target.value })}
          />
          <Input
            label="رقم الهاتف"
            value={member.phone}
            onChange={(e) => onChange({ ...member, phone: e.target.value })}
            dir="ltr"
          />
          <Select
            label="نوع الدم"
            value={member.bloodType}
            onChange={(e) => onChange({ ...member, bloodType: e.target.value })}
            options={DROPDOWNS.bloodType}
          />
          <Select
            label="مشترك بالجمعية"
            value={member.isSocietyMember}
            onChange={(e) => onChange({ ...member, isSocietyMember: e.target.value })}
            options={[
              { value: 'نعم', label: 'نعم' },
              { value: 'لا', label: 'لا' },
            ]}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={onSave} icon={Save}>
            حفظ التعديلات
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/** نافذة تأكيد الحذف */
function DeleteConfirm({ member, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-ink">تأكيد الحذف</h2>
        <p className="mt-2 text-sm text-gray-500">
          هل أنت متأكد من حذف بيانات
          <span className="font-semibold text-ink"> {member?.fullName} </span>؟
          لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={onConfirm} className="!bg-red-600 hover:!bg-red-700">
            نعم، احذف
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/** نافذة إضافة سجل جديد - نفس حقول نموذج التسجيل مع نفس التحقق */
function AddModal({ onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    defaultValues: { ...EMPTY_FORM },
  })

  const [serverError, setServerError] = useState('')
  const phoneValue = useWatch({ control, name: 'phone' })

  /** إضافة السجل من خلال نفس خدمة الإضافة (يمنع التكرار في الخادم) */
  const submit = async (values) => {
    setServerError('')
    try {
      await submitRegistration(values)
      onSuccess()
    } catch (err) {
      setServerError(err?.message || 'حدث خطأ غير متوقع، حاول مجدداً')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="thin-scrollbar max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-maroon-800">إضافة سجل جديد</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <FormMessage visible={!!serverError} success={false}>
          {serverError}
        </FormMessage>

        <form onSubmit={handleSubmit(submit)} noValidate className="mt-4 space-y-6">
          {/* المعلومات الشخصية */}
          <section>
            <SectionTitle icon={User} title="المعلومات الشخصية" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="الاسم الرباعي *"
                  placeholder="الاسم الكامل للرباعي"
                  icon={User}
                  error={errors.fullName?.message}
                  {...register('fullName', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[0-9]/g, '')
                    },
                  })}
                />
              </div>
              <Input
                label="الرقم الوطني *"
                placeholder="10 أرقام"
                inputMode="numeric"
                maxLength={10}
                icon={Hash}
                error={errors.nationalId?.message}
                {...register('nationalId', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '')
                  },
                  validate: validateNationalId,
                })}
              />
              <Input
                label="تاريخ الميلاد *"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                icon={CalendarDays}
                error={errors.birthDate?.message}
                {...register('birthDate')}
              />
              <Select
                label="الحالة الاجتماعية *"
                placeholder="اختر الحالة"
                options={DROPDOWNS.maritalStatus}
                icon={Heart}
                error={errors.maritalStatus?.message}
                {...register('maritalStatus')}
              />
            </div>
          </section>

          {/* التعليم والعمل */}
          <section>
            <SectionTitle icon={GraduationCap} title="التعليم والعمل" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Select
                label="المؤهل العلمي *"
                placeholder="اختر المؤهل"
                options={DROPDOWNS.educationLevel}
                icon={BookOpen}
                error={errors.educationLevel?.message}
                {...register('educationLevel')}
              />
              <Input
                label="التخصص"
                placeholder="مثال: هندسة برمجيات"
                icon={GraduationCap}
                error={errors.specialization?.message}
                {...register('specialization')}
              />
              <div className="sm:col-span-2">
                <Select
                  label="طبيعة العمل *"
                  placeholder="اختر طبيعة العمل"
                  options={DROPDOWNS.workNature}
                  icon={Briefcase}
                  error={errors.workNature?.message}
                  {...register('workNature')}
                />
              </div>
            </div>
          </section>

          {/* التواصل */}
          <section>
            <SectionTitle icon={MapPin} title="التواصل" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="مكان السكن *"
                placeholder="المحافظة / المنطقة"
                icon={MapPin}
                error={errors.residence?.message}
                {...register('residence')}
              />
              <Input
                label="رقم الهاتف *"
                placeholder="07xxxxxxxx"
                type="tel"
                inputMode="tel"
                icon={Phone}
                error={errors.phone?.message}
                success={
                  !errors.phone && phoneValue?.length > 0 ? 'رقم صحيح' : undefined
                }
                {...register('phone', {
                  validate: validatePhone,
                })}
              />
            </div>
          </section>

          {/* معلومات إضافية */}
          <section>
            <SectionTitle icon={Droplets} title="معلومات إضافية" />
            <div className="flex flex-col gap-6">
              <div className="sm:max-w-xs">
                <Select
                  label="نوع الدم *"
                  placeholder="اختر نوع الدم"
                  options={DROPDOWNS.bloodType}
                  icon={Droplets}
                  error={errors.bloodType?.message}
                  {...register('bloodType')}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  مشترك بالجمعية *
                </label>
                <Controller
                  name="isSocietyMember"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'نعم', label: 'نعم' },
                        { value: 'لا', label: 'لا' },
                      ]}
                      error={errors.isSocietyMember?.message}
                    />
                  )}
                />
              </div>
            </div>
          </section>

          <div className="mt-2 flex items-center justify-end gap-2 border-t border-line pt-4">
            <Button variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              icon={UserPlus}
            >
              إضافة السجل
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}