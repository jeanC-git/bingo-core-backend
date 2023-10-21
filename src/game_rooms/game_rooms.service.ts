import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { GenerateBingoCardsDto } from './dto';
import { BingoCard, GameRoom, PickedBall, PlayerList } from './entities';
import { InjectRepository } from '@nestjs/typeorm';

// import { WssClientService } from 'src/wss-client/wss-client.service';
import { WssClientGateway } from 'src/wss-client/wss-client.gateway';

import { handleExceptions } from 'src/common/utils';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class GameRoomsService {

  constructor(
    @InjectRepository(GameRoom)
    private readonly gameRoomRepository: Repository<GameRoom>,

    @InjectRepository(PickedBall)
    private readonly pickedBallRepository: Repository<PickedBall>,

    @InjectRepository(PlayerList)
    private readonly playerListRepository: Repository<PlayerList>,

    @InjectRepository(BingoCard)
    private readonly bingoCardRepository: Repository<BingoCard>,

    private readonly wssClientGateway: WssClientGateway,

  ) {

  }

  async findOne(id: string) {
    const gameRoom = await this.gameRoomRepository.findOneBy({ id });

    if (!gameRoom) throw new NotFoundException(`GameRoom with ID: ${id} not found.`);

    return gameRoom;
  }

  async joinGame(user: User) {
    try {
      const gameRoomData = {
        status: "WAITING_FOR_PLAYERS"
      };
      const gameRoom = this.gameRoomRepository.create(gameRoomData);
      await this.gameRoomRepository.save(gameRoom);

      const playerListData = {
        gameRoomId: gameRoom.id,
        userId: user.id,
        status: 'added'
      };
      const playerList = this.playerListRepository.create(playerListData)
      await this.playerListRepository.save(playerList)

      if (gameRoom.hasReachedMaxPlayersJoined()) {
        this.startGame(gameRoom)
      }

      return {
        id: gameRoom.id
      };

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

  async generateBingoCards(generateBingoCards: GenerateBingoCardsDto, user: User, gameRoom: GameRoom) {

    const { quantity } = generateBingoCards;

    const bingoCards = [];

    for (let index = 0; index < quantity; index++) {

      const { bingoCard, template } = await BingoCard.generateBingoCard();

      const bingoCardDB = this.bingoCardRepository.create({
        gameRoomId: gameRoom.id,
        userId: user.id,
        json_data: JSON.stringify({ bingoCard, template })
      });

      await this.bingoCardRepository.save(bingoCardDB);

      bingoCards.push({ id: bingoCardDB.id, bingoCard, template });

    }


    return bingoCards;
  }

  evaluateBingoCards() {

  }


  startGame(gameRoom: GameRoom) {
    this.updateStatusTo(gameRoom, 'GETTING_NEXT_BALL')
    this.wssClientGateway.wss.emit('GameRoomEventStatusUpdate', { someData: 'some-data' });
  }


  async updateStatusTo(gameRoom: GameRoom, newStatus: string) {
    gameRoom.status = newStatus;
    await this.gameRoomRepository.save(gameRoom);
  }

}
