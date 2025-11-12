import { Organization } from "./Organization"

export interface Member {
  _id?: string
  organization?: Organization | null
  username?: string
  name?: string
  role?: string
  passive?: boolean
}

export function getRoleList(): any[] {
  return [
    { _id: 'user', name: 'Kullanıcı' },
    { _id: 'owner', name: 'Owner' },
    { _id: 'purchase', name: 'Satın Alma' },
    { _id: 'sales', name: 'Satış' },
    { _id: 'admin', name: 'Yönetici' },
  ]
}


export function getAdminRoleList(): any[] {
  return [
    { _id: 'sysuser', name: 'Sys User' },
    { _id: 'sysadmin', name: 'Sys Admin' },
  ]
}