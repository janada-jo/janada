import { useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
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
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { DROPDOWNS } from '../../types'
import { registrationSchema } from '../../schemas/registration'
import { validateNationalId, validatePhone } from '../../utils/validators'
import { submitRegistration } from '../../services/api'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'
import RadioGroup from '../ui/RadioGroup'
import Button from '../ui/Button'
import { SectionTitle, FormMessage } from '../ui/section'

/**
 * نموذج تسجيل أبناء عائلة الجنادا
 * - مقسّم إلى 5 أقسام واضحة
 * - تحقق مباشر أثناء الكتابة (الرقم الوطني + الهاتف)
 * - يمنع التكرار عبر الخادم (Apps Script)
 */
export default function RegistrationForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    defaultValues: {
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
    },
  })

  const [serverError, setServerError] = useState('')
  const phoneValue = useWatch({ control, name: 'phone' })

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
    <Card className="mx-auto max-w-3xl">
      <div className="p-5 sm:p-8">
        {/* ترويسة الفورم */}
        <div className="mb-8 border-b border-line pb-6">
          <div className="flex items-center gap-2 text-maroon-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-50">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold sm:text-2xl">
              سجل بيانات أبناء العائلة
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            يرجى تعبئة جميع الحقول المطلوبة بدقة وتأنٍّ، شكراً لتعاونكم.
          </p>
        </div>

        <FormMessage visible={!!serverError} success={false}>
          {serverError}
        </FormMessage>

        <form onSubmit={handleSubmit(submit)} noValidate className="mt-2 space-y-10">
          {/* القسم الأول: المعلومات الشخصية */}
          <section>
            <SectionTitle
              icon={User}
              title="المعلومات الشخصية"
              description="بيانات التعريف الأساسية الخاصة بالشخص"
            />
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

              <div>
                <Input
                  label="الرقم الوطني *"
                  placeholder="10 أرقام"
                  type="text"
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
              </div>

              <div>
                <Input
                  label="تاريخ الميلاد *"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  icon={CalendarDays}
                  error={errors.birthDate?.message}
                  {...register('birthDate')}
                />
              </div>

              <div>
                <Select
                  label="الحالة الاجتماعية *"
                  placeholder="اختر الحالة"
                  options={DROPDOWNS.maritalStatus}
                  icon={Heart}
                  error={errors.maritalStatus?.message}
                  {...register('maritalStatus')}
                />
              </div>
            </div>
          </section>

          {/* القسم الثاني: التعليم */}
          <section>
            <SectionTitle
              icon={GraduationCap}
              title="التعليم"
              description="المؤهل العلمي والتخصص"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Select
                  label="المؤهل العلمي *"
                  placeholder="اختر المؤهل"
                  options={DROPDOWNS.educationLevel}
                  icon={BookOpen}
                  error={errors.educationLevel?.message}
                  {...register('educationLevel')}
                />
              </div>
              <div>
                <Input
                  label="التخصص"
                  placeholder="مثال: هندسة برمجيات"
                  icon={GraduationCap}
                  error={errors.specialization?.message}
                  {...register('specialization')}
                />
              </div>
            </div>
          </section>

          {/* القسم الثالث: العمل */}
          <section>
            <SectionTitle
              icon={Briefcase}
              title="العمل"
              description="طبيعة العمل الحالية"
            />
            <div className="grid grid-cols-1 gap-5">
              <Select
                label="طبيعة العمل *"
                placeholder="اختر طبيعة العمل"
                options={DROPDOWNS.workNature}
                icon={Briefcase}
                error={errors.workNature?.message}
                {...register('workNature')}
              />
            </div>
          </section>

          {/* القسم الرابع: التواصل */}
          <section>
            <SectionTitle
              icon={MapPin}
              title="التواصل"
              description="بيانات الاتصال والسكن"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Input
                  label="مكان السكن *"
                  placeholder="المحافظة / المنطقة"
                  icon={MapPin}
                  error={errors.residence?.message}
                  {...register('residence')}
                />
              </div>
              <div>
                <Input
                  label="رقم الهاتف *"
                  placeholder="07xxxxxxxx"
                  type="tel"
                  inputMode="tel"
                  icon={Phone}
                  error={errors.phone?.message}
                  success={
                    !errors.phone && phoneValue?.length > 0
                      ? 'رقم صحيح'
                      : undefined
                  }
                  {...register('phone', {
                    validate: validatePhone,
                  })}
                />
              </div>
            </div>
          </section>

          {/* القسم الخامس: معلومات إضافية */}
          <section>
            <SectionTitle
              icon={Droplets}
              title="معلومات إضافية"
              description="بيانات إضافية لخدمة العائلة"
            />
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

          {/* ملاحظة الخصوصية */}
          <div className="flex items-start gap-2 rounded-xl bg-maroon-50/60 px-4 py-3 text-xs text-maroon-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              جميع البيانات التي تقدمها محمية وتُستخدم لأغراض ديوان عائلة الجنادا
              حصراً.
            </p>
          </div>

          {/* زر الإرسال */}
          <div className="flex justify-center">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-56"
            >
              {!isSubmitting && (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              إرسال البيانات
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}