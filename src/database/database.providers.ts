

import { MongooseModule } from '@nestjs/mongoose'
import * as config from './config'

export const databaseProviders = [
  MongooseModule.forRootAsync({
    useFactory: () => (config)
  })
]