import { Get } from '@nestjs/common/decorators/http';
import {Controller} from "@nestjs/common/decorators/core/controller.decorator"
import { AppService } from './app.service';


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



