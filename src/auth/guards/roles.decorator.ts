import { SetMetadata, CustomDecorator } from '@nestjs/common'

import { DefaultRole } from '../../models/role'

export const Roles = (...roles: DefaultRole[]): CustomDecorator<string> => {
  return SetMetadata('roles', roles)
}
