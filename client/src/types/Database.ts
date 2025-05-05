import { MemberType } from './MemberType'
import { Settings } from './Settings'

export interface Database {
  _id?: string
  owner?: string
  identifier?: string
  name?: string
  team?: Team[]
  dbHost?: string
  dbName?: string
  passive?: boolean
  settings?: Settings
}

export interface Team {
  teamMember?: MemberType
  permissions?: any
}
