import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameRoomsService } from 'src/game_rooms/game_rooms.service';

@Injectable()
export class CronService {

    constructor(

        private readonly gameRoomService: GameRoomsService

    ) {

    }


    @Cron(CronExpression.EVERY_5_SECONDS)
    startGameRoomsCron() {

        const logger = new Logger('CronService');
        logger.log(`Se ejecuta el cron startGameRoomsCron`);

        this.gameRoomService.handleStartGameRooms()
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    getNextBallCron() {
        const logger = new Logger('CronService');
        logger.log(`Se ejecuta el cron getNextBallCron`);

        this.gameRoomService.handleGetNextBall()
    }

}
