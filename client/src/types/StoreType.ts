import { ManagerType } from './ManagerType'

export interface StoreType {
  _id?: string
  owner?: ManagerType
  identifier?: string
  name?: string
  team?: TeamType[]
  dbHost?: string
  dbName?: string
  domain?: string
  logo?: string
  slogan?: string
  description?: string
  passive?: boolean
  connector?: ConnectorType
}

export interface TeamType {
  teamMember?: ManagerType
  permissions?: any
}

export interface ConnectorType {
  clientId?: string
  clientPass?: string
  connectionType?: string | undefined | 'mssql' | 'mysql' | 'pg' | 'fs' | 'excel' | 'rest'
  mssql?: {
    server?: string
    port?: number
    user?: string
    password?: string
    database?: string
    dialect?: string
    dialectOptions?: {
      instanceName?: string
    }
    options?: {
      encrypt?: boolean
      trustServerCertificate?: boolean
    },
    mainApp?: string
  }
  mysql?: {
    host?: string
    port?: number
    user?: string
    password?: string
    database?: string
  },
  pg?: {
    host?: string
    port?: number
    user?: string
    password?: string
    database?: string
  }
  fs?: {
    filePath?: string
    encoding?: string | 'base64' | undefined
  },
  excel: {
    filePath?: string
  }
}