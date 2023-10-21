import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { GameRoomsModule } from 'src/game_rooms/game_rooms.module';

@Module({
  controllers: [CronController],
  providers: [CronService],

  imports: [

    GameRoomsModule

  ]
})
export class CronModule { }
