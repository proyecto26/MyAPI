import { Injectable } from '@nestjs/common';
import { User } from '../../../models/user';
import { UserService } from '../../../repositories';
import loadUsers from './data';
/**
 * Service dealing with user based operations.
 *
 * @class
 */
@Injectable()
export class UserSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {UserService} userService
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Seed all users.
   *
   * @function
   */
  async create(): Promise<User[]> {
    const users = await loadUsers()
    return Promise.all(users.map(async (user) => {
      return await this.userService.findOne(user.id)
        .then(dbUser => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbUser) {
            return Promise.resolve(null)
          }
          return this.userService.addUser(user)
        })
    }))
  }
}
