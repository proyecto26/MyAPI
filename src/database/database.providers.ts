import { createConnection, Connection } from 'typeorm'

import { DATABASE_CONNECTION } from '../constants'
import * as config from './ormconfig'

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory(): Promise<Connection> {
      return createConnection(config)
    }
  }
]