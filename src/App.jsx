import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      {/* الصفحة الرئيسية (نموذج التسجيل) */}
      <Route path="/" element={<HomePage />} />

      {/* صفحة الإدارة المخفية - بكلمة مرور */}
      <Route path="/admin" element={<AdminPage />} />

      {/* أي مسار غير معروف -> الرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App