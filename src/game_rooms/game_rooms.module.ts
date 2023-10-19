import { Module } from '@nestjs/common';
import { GameRoomsService } from './game_rooms.service';
import { GameRoomsController } from './game_rooms.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameRoom } from "./entities/game_room.entity";
import { GameLog } from './entities/game_log.entity';

@Module({
    controllers: [GameRoomsController],
    providers: [GameRoomsService],
    imports: [
        TypeOrmModule.forFeature([GameRoom, GameLog])
    ]
})
export class GameRoomsModule {
}
