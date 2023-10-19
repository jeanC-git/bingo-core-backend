import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameRoomsModule } from './game_rooms/game_rooms.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import * as process from "process";

@Module({
    imports: [

        ConfigModule.forRoot(),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            ssl: true,
            autoLoadEntities: true,
            synchronize: true,
            // logging: true
        }),

        GameRoomsModule,

        AuthModule,

        CommonModule
    ],
})
export class AppModule {
}
