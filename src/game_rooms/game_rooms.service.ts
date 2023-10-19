import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { GenerateBingoCardsDto } from './dto';
import { GameRoom, PickedBall } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { createDateFromFormat, handleExceptions } from 'src/common/utils';

@Injectable()
export class GameRoomsService {

  constructor(
    @InjectRepository(GameRoom)
    private readonly gameRoomRepository: Repository<GameRoom>,

    @InjectRepository(PickedBall)
    private readonly pickedBallRepository: Repository<PickedBall>,
  ) {

  }

  async findOne(id: string) {
    const gameRoom = await this.gameRoomRepository.findOneBy({ id });

    if (!gameRoom) throw new NotFoundException(`GameRoom with ID: ${id} not found.`);

    return gameRoom;
  }

  async joinGame() {
    try {

      console.log(createDateFromFormat(new Date()));

      const gameRoomData = {
        status: "waiting_for_players"
      };
      const gameRoom = this.gameRoomRepository.create(gameRoomData);

      await this.gameRoomRepository.save(gameRoom);

      if (gameRoom.maxNumberPlayersReached()) {
        // TODO: Launch to WS START_GAME_EVENT
      }

      return gameRoom;

    } catch (error) {
      handleExceptions(error, `GameRoomService.joinGame`);
    }
  }

  async getCurrentlyPickedBalls(gameRoom: GameRoom): Promise<PickedBall[]> {
    const pickedBalls = await this.pickedBallRepository.find({
      select: ['id', 'letter', 'label', 'number'],
      where: { gameRoomId: gameRoom.id }
    });

    return pickedBalls;
  }

  generateBingoCards(generateBingoCards: GenerateBingoCardsDto) {

  }

  evaluateBingoCards() {

  }


}
