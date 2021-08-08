import { MongooseModuleOptions } from '@nestjs/mongoose'
import { DATABASE_CONNECTION, DATABASE_URI } from '../constants'

const config = {
  dbName: process.env.DB_NAME || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
}

const connectionOptions: MongooseModuleOptions = {
  uri: DATABASE_URI,
  bufferCommands: false,
  /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
  dbName: config.dbName,
  /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
  user: config.user,
  /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
  pass: config.password,
  /** Set to false to disable automatic index creation for all models associated with this connection. */
  autoIndex: false,
  /** True by default. Set to `false` to make `findOneAndUpdate()` and `findOneAndRemove()` use native `findOneAndUpdate()` rather than `findAndModify()`. */
  useFindAndModify: false,
  /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
  autoCreate: true,
  /** False by default. If `true`, this connection will use `createIndex()` instead of `ensureIndex()` for automatic index builds via `Model.init()`. */
  useCreateIndex: false,
  retryAttempts: 3,
  retryDelay: 1000,
  connectionName: DATABASE_CONNECTION,
}

export = connectionOptions
