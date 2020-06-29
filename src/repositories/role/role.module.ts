import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database'
import { roleProviders } from './role.providers'
import { RoleService } from './role.service'

@Module({
  imports: [DatabaseModule],
  providers: [
    ...roleProviders,
    RoleService,
  ],
  exports: [RoleService]
})
export class RoleModule {}