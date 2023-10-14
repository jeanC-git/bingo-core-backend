import { Injectable } from '@nestjs/common';
import { CreateGameRoomDto } from './dto/create-game_room.dto';
import { UpdateGameRoomDto } from './dto/update-game_room.dto';

@Injectable()
export class GameRoomsService {
  create(createGameRoomDto: CreateGameRoomDto) {
    return 'This action adds a new gameRoom';
  }

  findAll() {
    return `This action returns all gameRooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameRoom`;
  }

  update(id: number, updateGameRoomDto: UpdateGameRoomDto) {
    return `This action updates a #${id} gameRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameRoom`;
  }
}
