import { Connection, Repository } from 'typeorm'
import { Role } from '../../models/role'
import { DATABASE_CONNECTION, REPOSITORIES } from '../../constants'

export const roleProviders = [
  {
    provide: REPOSITORIES.ROLE,
    useFactory: (connection: Connection): Repository<Role> => connection.getRepository(Role),
    inject: [DATABASE_CONNECTION],
  }
]