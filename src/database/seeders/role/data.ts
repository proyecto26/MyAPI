import { DefaultRole, Role } from '../../../models/role'

export const userRole = new Role({ id: DefaultRole.User, name: 'User' })

export const adminRole = new Role({ id: DefaultRole.Admin, name: 'Admin' })

export const roles: Role[] = [
  adminRole,
  userRole
]

export default async function(): Promise<Role[]> {
  return roles
}
