import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { catchError, map } from 'rxjs/operators';
import { HttpRequest } from '../../http-request/entities/http-request.entity';
import { throwError } from 'rxjs';
import { ConfigService } from "@nestjs/config";
import { handleExceptions } from '../utils';

const CommonErrors: number[] = [
    400, 404, 401
];

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
            userId: req.user || 'no-user',
            reqParams: JSON.stringify(req.params),
            reqBody: JSON.stringify(req.body),
            ip: req.ip ?? 'no-ip',
            url: req.originalUrl ?? 'no-url',
        }

        const httpRequest = this.httpRequestRepository.create(customReqBody);
        await this.httpRequestRepository.save(httpRequest);

        req.identifier = httpRequest.id;

        return next
            .handle()
            .pipe(
                map(
                    data =>
                        this.updateResponseRequest(httpRequest, data, context)),
                catchError(
                    err =>
                        this.storeError(httpRequest, err)
                    // throwError(async () => await this.storeError(httpRequest, err))
                ),
            );
    }


    async updateResponseRequest(httpRequest: HttpRequest, data: any, context: ExecutionContext) {
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

    async storeError(httpRequest: HttpRequest, error: any) {

        httpRequest.resBody = JSON.stringify(error.response || 'no-body');
        httpRequest.resStatusCode = error.status || 'no-response-code';
        httpRequest.endsExecutionAt = Date.now().toString();
        httpRequest.executionTime = (+httpRequest.endsExecutionAt - +httpRequest.startsExecutionAt);

        await this.httpRequestRepository.save(httpRequest);

        handleExceptions(error);
    }

}