import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpRequest } from './entities/http-request.entity';

import { HttpRequestService } from './http-request.service';

import { HttpRequestController } from './http-request.controller';

@Module({
  controllers: [HttpRequestController],
  providers: [HttpRequestService],
  imports: [
    TypeOrmModule.forFeature([HttpRequest]),
  ]
})
export class HttpRequestModule { }
