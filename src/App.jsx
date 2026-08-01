import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './config/routes'
import ProtectedRoute from './components/ProtectedRoute'
import SessionProvider from './components/SessionProvider'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Manage from './pages/Manage'
import ForgotPassword from './pages/ForgotPassword'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* Protected routes — wrapped with session timeout */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <SessionProvider>
                <Dashboard />
              </SessionProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.MANAGE}
          element={
            <ProtectedRoute>
              <SessionProvider>
                <Manage />
              </SessionProvider>
            </ProtectedRoute>
          }
        />

        {/* Catch-all → login */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
