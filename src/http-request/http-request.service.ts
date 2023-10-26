import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HttpRequest } from './entities/http-request.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class HttpRequestService {

  constructor(
    @InjectRepository(HttpRequest)
    private readonly httpRequestRepository: Repository<HttpRequest>,
  ) { }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.httpRequestRepository.createQueryBuilder("http_requests");

    queryBuilder
      .orderBy("http_requests.createdAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
}