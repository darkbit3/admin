import { Navigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

export default function ProtectedRoute({ children }) {
  const isAuth = sessionStorage.getItem('admin_auth') === 'true'
  return isAuth ? children : <Navigate to={ROUTES.LOGIN} replace />
}
