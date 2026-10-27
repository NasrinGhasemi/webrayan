import { ROLE_PERMISSIONS } from '@/lib/constants/permissions'

export function hasPermission(userRole, permission) {
  if (!userRole) return false
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission)
}

export function getUserPermissions(userRole) {
  return ROLE_PERMISSIONS[userRole] || []
}
