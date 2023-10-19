import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { GameRoomsService } from './game_rooms.service';
import { GameRoomsController } from './game_rooms.controller';

import { GameRoom, GameLog, PickedBall, BingoCard, PlayerList } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [GameRoomsController],
    providers: [GameRoomsService],
    imports: [

        TypeOrmModule.forFeature([GameRoom, GameLog, PickedBall, BingoCard, PlayerList]),

        AuthModule

    ]
})
export class GameRoomsModule {
}
