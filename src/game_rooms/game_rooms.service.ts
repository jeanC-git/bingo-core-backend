import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { EvaluateBingoCardsDto, GenerateBingoCardsDto } from './dto';
import { BingoCard, GameLog, GameRoom, PickedBall, PlayerList } from './entities';
import { InjectRepository } from '@nestjs/typeorm';

import { WssClientGateway } from 'src/wss-client/wss-client.gateway';

import { handleExceptions } from 'src/common/utils';
import { User } from 'src/auth/entities/user.entity';
import { BingoCardFront } from './dto/evaluate-bingo-cards.dto';

@Injectable()
export class GameRoomsService {

  constructor(
    @InjectRepository(GameRoom)
    private readonly gameRoomRepository: Repository<GameRoom>,

    @InjectRepository(PickedBall)
    private readonly pickedBallRepository: Repository<PickedBall>,

    @InjectRepository(PlayerList)
    private readonly playerListRepository: Repository<PlayerList>,

    @InjectRepository(GameLog)
    private readonly gameLogRepository: Repository<GameLog>,

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

  async saveHistoryLog(gameRoom: GameRoom, message: string) {

    const gameLog = this.gameLogRepository.create({
      gameRoomId: gameRoom.id,
      message: message,
      extraData: JSON.stringify([])
    });

    await this.gameLogRepository.save(gameLog);
  }

  startGame(gameRoom: GameRoom) {
    this.updateStatusTo(gameRoom, 'GETTING_NEXT_BALL')
    this.broadcastStartGame(gameRoom);
  }

  async updateStatusTo(gameRoom: GameRoom, newStatus: string) {
    gameRoom.status = newStatus;
    await this.gameRoomRepository.save(gameRoom);
  }

  async handleStartGameRooms() {

    const gameRooms = await this.gameRoomRepository.find({
      where: {
        status: In(["WAITING_FOR_PLAYERS", "WAITING_NEXT_BALL"])
      }
    });

    if (gameRooms.length > 0) {
      gameRooms.forEach(async (gameRoom: GameRoom) => {

        this.startGame(gameRoom)

        if (gameRoom.isStarting()) {
          await this.saveHistoryLog(gameRoom, `Iniciando partida ...`);
        } else {

          await this.saveHistoryLog(gameRoom, `Iniciando próxima jugada ...`);
        }

      });
    }
  }

  async handleGetNextBall() {
    const gameRooms = await this.gameRoomRepository.find({
      where: {
        status: In(["GETTING_NEXT_BALL"])
      }
    });

    gameRooms.forEach(async (gameRoom: GameRoom) => {

      await this.saveHistoryLog(gameRoom, 'Obteniendo próximo número ...');

      setTimeout(async () => {
        const currentlyPickedBalls = await this.getCurrentlyPickedBalls(gameRoom);
        const availableBalls = GameRoom.getAvailableBalls(currentlyPickedBalls);

        if (availableBalls.length > 0) {

          const randomNumber = availableBalls[Math.floor(Math.random() * availableBalls.length)];

          const pickedBallData = this.pickedBallRepository.create({
            gameRoomId: gameRoom.id,
            label: `A${randomNumber}`,
            letter: 'A',
            number: randomNumber,
          });
          const pickedBallDB = await this.pickedBallRepository.save(pickedBallData);

          gameRoom.balls_played = gameRoom.balls_played + 1;
          await this.gameRoomRepository.save(gameRoom);
          await this.saveHistoryLog(gameRoom, `Número obtenido: ${pickedBallDB.number}`);

          if (gameRoom.lastGame()) {

            this.updateStatusTo(gameRoom, 'FINISHED_GAME_ROOM')
            this.broadcastFinishedGameRoom(gameRoom);
            await this.saveHistoryLog(gameRoom, `Partida finalizada ...`);

          } else {

            this.broadcastPickedBall(gameRoom, pickedBallDB);
            this.updateStatusTo(gameRoom, 'WAITING_NEXT_BALL')
            await this.saveHistoryLog(gameRoom, `Esperando próximo número ...`);
          }

        } else {

          await this.saveHistoryLog(gameRoom, 'No hay más bolitas disponibles, revisar los logs del juego.');
          this.updateStatusTo(gameRoom, 'FINISHED_GAME_ROOM')

        }


      }, 4000);
    });
  }

  broadcastFinishedGameRoom(gameRoom: GameRoom) {
    this.wssClientGateway.wss.emit(`GameRoomEventStatusUpdate:${gameRoom.id}`, { event: 'FINISHED_GAME_EVENT' });
  }

  broadcastPickedBall(gameRoom: GameRoom, pickedBall: PickedBall) {
    this.wssClientGateway.wss.emit(`GameRoomEventStatusUpdate:${gameRoom.id}`, { event: 'PICKED_BALL_EVENT', data: pickedBall });
  }

  broadcastStartGame(gameRoom: GameRoom) {
    this.wssClientGateway.wss.emit(`GameRoomEventStatusUpdate:${gameRoom.id}`, { event: 'GETTING_NEXT_BALL_EVENT' });
  }


  evaluateBingoCards(gameRoom: GameRoom, evaluateBingoCardsDto: EvaluateBingoCardsDto) {

    const { bingoCards } = evaluateBingoCardsDto;

    bingoCards.forEach((bingoCard: BingoCardFront) => {

      const score = this.evaluateBingoCard(bingoCard)


    });

    return {
      score: 1000
    };
  }

  evaluateBingoCard(bingoCard: BingoCardFront) {

  }
}
