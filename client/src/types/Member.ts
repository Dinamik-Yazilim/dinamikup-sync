import { Organization } from "./Organization"

export interface Member {
  _id?: string
  organization?:Organization
  username?: string
  name?: string
  role?: string
  passive?: boolean
}