import { Settings } from './Settings'

export interface Database {
  _id?: string
  owner?: string
  identifier?: string
  name?: string
  team?: []
  dbHost?: string
  dbName?: string
  passive?: boolean
  settings?: Settings
}

