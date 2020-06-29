import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { AUTH_SECRET_TOKEN } from '../constants'
import { AuthPayload } from '../models/auth'

/**
 * JwtStrategy is passport JWT strategy.
 * 
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_SECRET_TOKEN,
    })
  }

  /**
   * validate returns jwt payload.
   * @param payload - Payload with the info of the user
   * 
   * @returns
   * @memberof JwtStrategy
   */
  validate(payload: AuthPayload): AuthPayload {
    return payload
  }
}