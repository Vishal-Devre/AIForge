import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'

export const SUPERUSER_EMAIL = 'vishaldevre898@gmail.com'

export function useRole() {
  const { user } = useAuth()

  const isSuperuserEmail = user?.email?.toLowerCase() === SUPERUSER_EMAIL.toLowerCase()
  const isAdmin = user?.is_superuser === true || user?.role === 'ADMIN' || user?.role === 'SUPERUSER' || isSuperuserEmail

  return {
    role: (isAdmin ? 'ADMIN' : user?.role || 'CUSTOMER') as UserRole,
    isAdmin,
    isCustomer: !isAdmin,
  }
}

export function useIsAdmin() {
  const { isAdmin } = useRole()
  return isAdmin
}
