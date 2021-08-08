import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Role, RoleDocument } from '../../models/role'

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>
  ) { }

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find().exec()
  }

  async findOne(id: number): Promise<Role> {
    return this.roleModel.findOne({ id }).exec()
  }

  async addRole(role: Role): Promise<Role> {
    const createdRole = new this.roleModel(role)
    return createdRole.save()
  }

  async updateRole(role: Role): Promise<void> {
    await this.roleModel.findOneAndUpdate({ id: role.id }, role).exec()
  }

  async delete(roleId: number): Promise<void> {
    await this.roleModel.deleteOne({ id: roleId }).exec()
  }
}