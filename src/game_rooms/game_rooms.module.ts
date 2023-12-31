import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { GameRoomsService } from './game_rooms.service';
import { GameRoomsController } from './game_rooms.controller';

import { GameRoom, GameLog, PickedBall, BingoCard, PlayerList } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { WssClientModule } from 'src/wss-client/wss-client.module';
import { WssClientGateway } from 'src/wss-client/wss-client.gateway';
import { HttpRequest } from 'src/http-request/entities/http-request.entity';

@Module({
    controllers: [GameRoomsController],
    providers: [GameRoomsService],
    imports: [

        TypeOrmModule.forFeature([GameRoom, GameLog, PickedBall, BingoCard, PlayerList, HttpRequest]),

        AuthModule,

        WssClientModule,

        WssClientGateway

    ],
    exports: [

        GameRoomsService

    ]
})
export class GameRoomsModule {
}
