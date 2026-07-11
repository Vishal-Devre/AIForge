import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'

export function useRole() {
  const { user } = useAuth()

  // Default to CUSTOMER if user is not loaded or role is missing
  const role: UserRole = user?.role || 'CUSTOMER'
  const isAdmin = user?.is_superuser === true

  return {
    role,
    isAdmin,
    isCustomer: !isAdmin,
  }
}

export function useIsAdmin() {
  const { isAdmin } = useRole()
  return isAdmin
}
