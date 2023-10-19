import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

import { GameLog } from "./game_log.entity";
import { PickedBall } from "./picked_ball.entity";
import { PlayerList } from "./player_list.entity";
import { BingoCard } from "./bingo_card.entity";

@Entity("game_rooms")
export class GameRoom {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    status: string

    @Column({
        default: 25
    })
    max_player_allowed: number

    @Column({
        default: 0
    })
    payers_joined_count: number

    @Column({
        default: 0
    })
    balls_played: number

    // @Column()
    // duration: number

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    startsAt: string

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    finishesAt: string

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    startedAt: string

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    finishedAt: string

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @DeleteDateColumn()
    deletedAt: string


    @OneToMany(
        () => BingoCard,
        (bingoCard: BingoCard) => bingoCard.gameRoom)
    bingoCards: BingoCard[]

    @OneToMany(
        () => GameLog,
        (game_log: GameLog) => game_log.gameRoom)
    gameLogs: GameLog[]

    @OneToMany(
        () => PickedBall,
        (picked_ball: PickedBall) => picked_ball.gameRoom)
    pickedBalls: PickedBall[]

    @OneToMany(
        () => PlayerList,
        (playerList: PlayerList) => playerList.gameRoom)
    playerList: PlayerList[]








    public maxNumberPlayersReached(): boolean {
        return false
    }
}
