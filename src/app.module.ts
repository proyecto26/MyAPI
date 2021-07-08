import { Logger, Module, HttpModule } from '@nestjs/common'

import { AuthModule } from './auth'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import {
  UserModule,
  RoleModule,
  DocumentTypeModule
} from './repositories'
import {
  AuthController,
  UserController,
  RoleController,
  DocumentTypeController
} from './controllers'

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UserModule,
    RoleModule,
    DocumentTypeModule
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    RoleController,
    DocumentTypeController
  ],
  providers: [Logger, AppService],
})
export class AppModule {}
