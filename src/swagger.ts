import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { PROD_ENV } from './constants'

export function setupSwagger (app: INestApplication): void {
  const url = process.env.NODE_ENV === PROD_ENV ? 'https' : 'http'
  const options = new DocumentBuilder()
    .setTitle('MyAPI')
    .setDescription('A template to create awesome APIs easily ⚡️')
    .setVersion('1.0')
    .addTag('Endpoints')
    .setContact('Juan David Nicholls', 'https://github.com/proyecto26/MyAPI', 'jdnichollsc@hotmail.com')
    .addBearerAuth()
    .addServer(`${url}://`)
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
}
