import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { GameRoom } from "./game_room.entity"

@Entity("game_logs")
export class GameLog {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    message: string

    @Column()
    extraData: number

    @Column("uuid")
    gameRoomId: string

    @ManyToOne(() => GameRoom, (gameRoom: GameRoom) => gameRoom.gameLogs)
    gameRoom: GameRoom
}