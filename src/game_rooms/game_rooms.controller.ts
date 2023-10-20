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
  @Auth()
  @UseGuards(AuthGuard())
  async getCurrentlyPickedBalls(@Param('gameRoomId', ParseGameRoomPipe) gameRoom: GameRoom) {
    const pickedBalls = await this.gameRoomsService.getCurrentlyPickedBalls(gameRoom);
    return success(pickedBalls);
  }

  @Post(':gameRoomId/generate-bingo-cards')
  @Auth()
  @UseGuards(AuthGuard())
  async generateBingoCards(
    @GetUser() user: User,
    @Param('gameRoomId', ParseGameRoomPipe) gameRoom: GameRoom,
    @Body() generateBingoCardsDto: GenerateBingoCardsDto) {
    const bingoCards = await this.gameRoomsService.generateBingoCards(generateBingoCardsDto, user, gameRoom);

    return success(bingoCards);
  }

  @Post(':gameRooomId/evaluate-bingo-cards')
  evaluateBingoCards(
    @Param('gameRoomId', ParseGameRoomPipe) gameRoom: GameRoom,
    @Body() evaluateBingoCardsDto: EvaluateBingoCardsDto) {
    return this.gameRoomsService.evaluateBingoCards();
  }

}
