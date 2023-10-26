import { Controller, Get, Query } from '@nestjs/common';
import { HttpRequestService } from './http-request.service';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';


@Controller('http-requests')
export class HttpRequestController {
  constructor(
    private readonly httpRequestService: HttpRequestService
  ) { }


  @Get()
  findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ) {

    return this.httpRequestService.findAll(pageOptionsDto);
  }


}
