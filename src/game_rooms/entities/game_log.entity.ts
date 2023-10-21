import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { GameRoom } from "./game_room.entity"

@Entity("game_logs")
export class GameLog {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    message: string

    @Column()
    extraData: string

    @Column("uuid")
    gameRoomId: string

    @ManyToOne(() => GameRoom, (gameRoom: GameRoom) => gameRoom.gameLogs)
    gameRoom: GameRoom

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @DeleteDateColumn()
    deletedAt: string
}