import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello world, this is my awesome API! 🤘'
  }
}
