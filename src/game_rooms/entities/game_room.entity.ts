import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { GameLog } from "./game_log.entity";

@Entity("game_rooms")
export class GameRoom {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    status_id: string

    @Column()
    max_player_allowed: number

    @Column()
    payers_joined_count: number

    @Column()
    balls_played: number

    @Column()
    duration: number

    @Column()
    startsAt: string

    @Column()
    finishesAt: string

    @Column()
    startedAt: string

    @Column()
    finishedAt: string

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @DeleteDateColumn()
    deletedAt: string

    @OneToMany(() => GameLog, (game_log: GameLog) => game_log.game_room)
    game_logs: GameLog[]
}
