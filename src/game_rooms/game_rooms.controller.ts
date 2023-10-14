import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameRoomsService } from './game_rooms.service';
import { CreateGameRoomDto } from './dto/create-game_room.dto';
import { UpdateGameRoomDto } from './dto/update-game_room.dto';

@Controller('game-rooms')
export class GameRoomsController {
  constructor(private readonly gameRoomsService: GameRoomsService) {}

  @Post()
  create(@Body() createGameRoomDto: CreateGameRoomDto) {
    return this.gameRoomsService.create(createGameRoomDto);
  }

  @Get()
  findAll() {
    return this.gameRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameRoomDto: UpdateGameRoomDto) {
    return this.gameRoomsService.update(+id, updateGameRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameRoomsService.remove(+id);
  }
}
