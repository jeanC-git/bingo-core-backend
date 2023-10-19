import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { GameRoomsService } from '../game_rooms.service';

@Injectable()
export class ParseGameRoomPipe implements PipeTransform {
    constructor(

        private readonly gameRoomService: GameRoomsService,

    ) { }
    async transform(value: any) {

        const gameRoom = await this.gameRoomService.findOne(value);

        if (!gameRoom) throw new NotFoundException(`GameRoom with ID "${value}" not found.`);

        return gameRoom;
    }
}
