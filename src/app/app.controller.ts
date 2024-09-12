import { Controller, Get,  } from '@nestjs/common/decorators/';
import { AppService } from './app.service';
import { ValidationPipe, UsePipes } from '@nestjs/common';


@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}



