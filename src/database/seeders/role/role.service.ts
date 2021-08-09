import { Injectable } from '@nestjs/common';
import { Role } from '../../../models/role';
import { RoleService } from '../../../repositories';
import loadRoles from './data';
/**
 * Service dealing with role based operations.
 *
 * @class
 */
@Injectable()
export class RoleSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {RoleService} roleService
   */
  constructor(private readonly roleService: RoleService) {}

  /**
   * Seed all roles.
   *
   * @function
   */
  async create(): Promise<Role[]> {
    const roles = await loadRoles()
    return Promise.all(roles.map(async (role) => {
      return await this.roleService.findOne(role.id)
        .then(dbRole => {
          // We check if a role already exists.
          // If it does don't create a new one.
          if (dbRole) {
            return Promise.resolve(null)
          }
          return this.roleService.addRole(role)
        })
    }))
  }
}
