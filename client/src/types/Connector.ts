export interface Connector {
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