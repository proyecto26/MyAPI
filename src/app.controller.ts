import { Controller, Get, Render, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiTags,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiServiceUnavailableResponse
} from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check API status' })
  @ApiOkResponse({ description: 'The service is operating correctly' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({ description: 'Communication error with the server' })
  @ApiServiceUnavailableResponse({ description: 'The service is not available' })
  @HttpCode(HttpStatus.OK)
  @Get('api/help')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getHelp(): void {}

  @Get()
  @Render('home')
  @ApiExcludeEndpoint()
  getHome(): { message: string } {
    return {
      message: this.appService.getHello()
    }
  }
}
