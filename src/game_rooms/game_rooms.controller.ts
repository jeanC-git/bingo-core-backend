import { Controller, Get, Post, Body, Param, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GameRoomsService } from './game_rooms.service';

import { Auth, GetUser } from 'src/auth/decorators';
import { GameRoom } from './entities';
import { EvaluateBingoCardsDto, GenerateBingoCardsDto } from './dto';
import { ParseGameRoomPipe } from './pipes/parse-game_room.pipe';

import { success } from 'src/common/utils/api-response.util';
import { User } from 'src/auth/entities/user.entity';

@Controller('game-rooms')
export class GameRoomsController {
  constructor(private readonly gameRoomsService: GameRoomsService) { }


  @Get('join-game')
  @Auth()
  @UseGuards(AuthGuard())
  async joinGame(
    @GetUser() user: User
  ) {
    const gameRoom = await this.gameRoomsService.joinGame(user);
    return success(gameRoom);
  }

  @Get(':gameRoomId/currently-picked-balls')
  async getCurrentlyPickedBalls(@Param('gameRoomId', ParseGameRoomPipe) gameRoom: GameRoom) {
    const pickedBalls = await this.gameRoomsService.getCurrentlyPickedBalls(gameRoom);
    return success(pickedBalls);
  }

  @Post('generate-bingo-cards')
  generateBingoCards(@Body() generateBingoCardsDto: GenerateBingoCardsDto) {
    return this.gameRoomsService.generateBingoCards(generateBingoCardsDto);
  }

  @Post(':gameRooomId/evaluate-bingo-cards')
  evaluateBingoCards(
    @Param('gameRoomId', ParseGameRoomPipe) gameRoom: GameRoom,
    @Body() evaluateBingoCardsDto: EvaluateBingoCardsDto) {
    return this.gameRoomsService.evaluateBingoCards();
  }

}
