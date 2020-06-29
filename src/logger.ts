import { transports, format } from 'winston'
import { utilities, WinstonModuleOptions, WinstonModule } from 'nest-winston'
import { LoggerService } from '@nestjs/common'

export function createLogger (): LoggerService {
  const winstonOptions : WinstonModuleOptions = {
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          utilities.format.nestLike(),
        ),
        level: 'debug'
      }),
      new transports.File({
        format: format.combine(
          format.timestamp(),
          utilities.format.nestLike(),
        ),
        filename: 'errors.log',
        level: 'error'
      }),
      new transports.File({
        format: format.combine(
          format.timestamp(),
          utilities.format.nestLike(),
        ),
        filename: 'warnings.log',
        level: 'warning'
      }),
      new transports.File({
        format: format.combine(
          format.timestamp(),
          utilities.format.nestLike(),
        ),
        filename: 'critical.log',
        level: 'crit'
      })
    ]
  }

  return WinstonModule.createLogger(winstonOptions)
}