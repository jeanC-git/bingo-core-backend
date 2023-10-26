import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { HttpRequest } from './entities/http-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([HttpRequest]),
    ],
    exports: [TypeOrmModule]
})
export class CommonModule { }
