import * as jwt from 'jsonwebtoken'

export const PROD_ENV = 'production'
export const DOMAIN = 'https://my-production-api.domain'

export const AUTH_SECRET_TOKEN = 'my_secret_token';
export const AUTH_JWT_OPTIONS: jwt.SignOptions = {
  expiresIn: '1d'
};

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION'
export const REPOSITORIES = {
  USER: 'USER_REPOSITORY',
  ROLE: 'ROLE_REPOSITORY',
  DOCUMENT_TYPE: 'DOCUMENT_TYPE'
}

export { default as ERRORS } from './errors'
export * as POSTGRES from './postgres'
