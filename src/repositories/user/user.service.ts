import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, IUser, UserDocument } from '../../models/user'
import { stringToJSON } from '../utils'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  preloadUser(user: User) {
    user.role = stringToJSON(user.role)
    user.documentType = stringToJSON(user.documentType)
    return user
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec()
  }

  async findByRoleIds(
    roles: number[],
    search: string,
    offset: number,
    limit: number
  ): Promise<IUser[]> {
    const searchString = new RegExp(search, 'ig')
    return this.userModel.aggregate()
    .project({
        fullname: { $concat: ['$firstName', ' ', '$lastName'] },
        reversedname: { $concat: ['$lastName', ' ', '$firstName'] },
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        address: 1,
        role: 1
    })
    .match({
      'role.id': { $in: roles },
      $or: [
        { fullname: searchString },
        { reversedname: searchString },
        { email: searchString },
        { phone: searchString },
        { address: searchString }
      ]
    })
    .skip(offset).limit(limit).exec()
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec()
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ id }).exec()
  }

  async addUser(user: IUser): Promise<User> {
    const newUser = this.preloadUser(user as User)
    const createdUser = new this.userModel(newUser)
    return createdUser.save()
  }

  async updateUser(user: IUser): Promise<User> {
    const newUser = this.preloadUser(user as User)
    return await this.userModel.findOneAndUpdate({ id: user.id }, newUser).exec()
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.deleteOne({ id }).exec()
  }

  async updatePassword(
    id: string,
    newPassword: string
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { $set: { password: newPassword } }).exec()
  }

  async countByDocumentTypeId(documentTypeId: number = null): Promise<number> {
    return this.userModel.countDocuments({ 'document.id': documentTypeId }).exec()
  }

  async addUsers(users: IUser[]): Promise<void> {
    await this.userModel.insertMany(users.map(this.preloadUser.bind(this)))
  }
}