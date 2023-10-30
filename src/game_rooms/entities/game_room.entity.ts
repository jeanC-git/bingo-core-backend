import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { GameLog } from './game_log.entity';
import { PickedBall } from './picked_ball.entity';
import { PlayerList } from './player_list.entity';
import { BingoCard } from './bingo_card.entity';

@Entity('game_rooms')
export class GameRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column({
    default: 5,
  })
  max_player_allowed: number;

  @Column({
    default: 0,
  })
  payers_joined_count: number;

  @Column({
    default: 0,
  })
  balls_played: number;

  // @Column()
  // duration: number

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startsAt: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finishesAt: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startedAt: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finishedAt: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;

  @Column({ default: 5 })
  numbers_of_plays: number;

  @OneToMany(() => BingoCard, (bingoCard: BingoCard) => bingoCard.gameRoom)
  bingoCards: BingoCard[];

  @OneToMany(() => GameLog, (game_log: GameLog) => game_log.gameRoom)
  gameLogs: GameLog[];

  @OneToMany(
    () => PickedBall,
    (picked_ball: PickedBall) => picked_ball.gameRoom,
  )
  pickedBalls: PickedBall[];

  @OneToMany(() => PlayerList, (playerList: PlayerList) => playerList.gameRoom)
  playerList: PlayerList[];

  public hasReachedMaxPlayersJoined(): boolean {
    return this.payers_joined_count === this.max_player_allowed;
  }

  public lastGame() {
    return this.balls_played === this.numbers_of_plays;
  }

  public isStarting() {
    return this.balls_played === 0;
  }

  public static getAvailableBalls(excludedBalls: PickedBall[]) {
    const totalNumbers = [];
    const excludedNumbers = excludedBalls.map(
      (pickedBall) => pickedBall.number,
    );

    for (let number = 0; number < 51; number++) {
      if (!excludedNumbers.includes(number)) {
        totalNumbers.push(number);
      }
    }

    return totalNumbers;
  }
}
