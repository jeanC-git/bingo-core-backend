import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { map } from 'rxjs/operators';
import { HttpRequest } from '../../http-request/entities/http-request.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(
        @InjectRepository(HttpRequest)
        private readonly httpRequestRepository: Repository<HttpRequest>,
    ) { }


    async intercept(context: ExecutionContext, next: CallHandler) {
        const startsExecutionAt = Date.now();
        const req = context.switchToHttp().getRequest();

        const customReqBody = {
            startsExecutionAt: startsExecutionAt.toString(),
            httpMethod: req.method ?? 'unidentified-method',
            reqParams: JSON.stringify(req.params),
            reqBody: JSON.stringify(req.body),
            ip: req.ip ?? 'no-ip',
            url: req.originalUrl ?? 'no-url',
        }

        const httpRequest = this.httpRequestRepository.create(customReqBody);
        await this.httpRequestRepository.save(httpRequest);

        return next
            .handle()
            .pipe(
                map(data => this.updateResponseRequest(httpRequest, data, context))
            );
    }


    updateResponseRequest = async (httpRequest: HttpRequest, data: any, context: ExecutionContext) => {
        const res = context.switchToHttp().getResponse();

        if (res.statusCode) {

            httpRequest.resBody = JSON.stringify(data);
            httpRequest.resStatusCode = res.statusCode;
            httpRequest.endsExecutionAt = Date.now().toString();
            httpRequest.executionTime = (+httpRequest.endsExecutionAt - +httpRequest.startsExecutionAt);

            await this.httpRequestRepository.save(httpRequest);
        }



        return data;
    }
}