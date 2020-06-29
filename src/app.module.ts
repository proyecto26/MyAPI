import { Logger, Module } from '@nestjs/common'

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
    AuthModule,
    UserModule,
    RoleModule,
    DocumentTypeModule
  ],
  controllers: [
    AuthController,
    AppController,
    UserController,
    RoleController,
    DocumentTypeController
  ],
  providers: [Logger, AppService],
})
export class AppModule {}
