import { encryptPassword } from '../../../auth'
import { IUser, UserStatus } from '../../../models/user'
import { passportDocumentType } from '../documentType/data'
import { adminRole } from '../role/data'

export const users: IUser[] = [
  {
    id: '1234',
    email: 'jdnichollsc@hotmail.com',
    firstName: 'Juan David',
    lastName: 'Nicholls Cardona',
    documentType: passportDocumentType,
    role: adminRole,
    status: UserStatus.Active
  }
]

export default async function(): Promise<IUser[]> {
  const encryptedPassword = await encryptPassword('1111')
  return users.map(user => ({
    ...user,
    password: encryptedPassword
  }))
}
