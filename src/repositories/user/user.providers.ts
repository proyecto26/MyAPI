import { Connection, Repository } from 'typeorm'

import { User } from '../../models/user'
import { DATABASE_CONNECTION, REPOSITORIES } from '../../constants'

export const userProviders = [
  {
    provide: REPOSITORIES.USER,
    useFactory: (connection: Connection): Repository<User> => connection.getRepository(User),
    inject: [DATABASE_CONNECTION],
  }
]