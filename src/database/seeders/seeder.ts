import { Injectable, Logger } from '@nestjs/common'
import { DocumentTypeSeederService } from './documentType/documentType.service'
import { RoleSeederService } from './role/role.service'
import { UserSeederService } from './user/user.service'

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly userSeederService: UserSeederService,
    private readonly roleSeederService: RoleSeederService,
    private readonly documentTypeSeederService: DocumentTypeSeederService,
  ) {}

  async seed(): Promise<void> {
    await this.users()
      .then(() => {
        this.logger.debug('Successfuly completed seeding users...')
        return this.roles()
      })
      .then(() => {
        this.logger.debug('Successfuly completed seeding roles...')
        return this.documentTypes()
      })
      .then(() => {
        this.logger.debug('Successfuly completed seeding document types...')
      })
      .catch(error => {
        this.logger.error('Failed seeding users...')
        return Promise.reject(error)
      })
  }

  async users(): Promise<boolean> {
    return this.userSeederService.create()
      .then(createdUsers => {
        this.logger.verbose(
          'No. of users created : ' +
            // Remove all null values and return only created users.
            createdUsers.filter(
              nullValueOrCreated => nullValueOrCreated,
            ).length,
        );
        return Promise.resolve(true)
      })
  }

  async roles(): Promise<boolean> {
    return this.roleSeederService.create()
      .then(createdRoles => {
        this.logger.verbose(
          'No. of roles created : ' +
            // Remove all null values and return only created roles.
            createdRoles.filter(
              nullValueOrCreated => nullValueOrCreated,
            ).length,
        );
        return Promise.resolve(true)
      })
  }

  async documentTypes(): Promise<boolean> {
    return this.documentTypeSeederService.create()
      .then(createdDocumentTypes => {
        this.logger.verbose(
          'No. of document types created : ' +
            // Remove all null values and return only created document types.
            createdDocumentTypes.filter(
              nullValueOrCreated => nullValueOrCreated,
            ).length,
        );
        return Promise.resolve(true)
      })
  }
}