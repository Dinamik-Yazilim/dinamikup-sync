import { Organization } from "./Organization"

export interface MemberType {
  _id?: string
  organization:Organization
  username?: string
  name?: string
  role?: string
  passive?: boolean
}