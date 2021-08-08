import * as jwt from 'jsonwebtoken'

export const PROD_ENV = 'production'
export const DOMAIN = 'https://myapi-template.herokuapp.com'

export const AUTH_SECRET_TOKEN = 'my_secret_token';
export const AUTH_JWT_OPTIONS: jwt.SignOptions = {
  expiresIn: '1d'
};

export const DATABASE_URI = 'mongodb://localhost'
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION'

export { default as ERRORS } from './errors'
export * as DATABASE from './database'
