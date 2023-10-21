import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameRoomsService } from 'src/game_rooms/game_rooms.service';

@Injectable()
export class CronService {

    constructor(

        private readonly gameRoomService: GameRoomsService

    ) {

    }


    @Cron(CronExpression.EVERY_SECOND)
    checkGameRoomStatusCron() {
        // this.gameRoomService.checkGameRoomStatus()
    }

}
