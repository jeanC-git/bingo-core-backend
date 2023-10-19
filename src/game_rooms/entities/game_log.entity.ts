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

    @ManyToOne(() => GameRoom, (game_room: GameRoom) => game_room.game_logs)
    game_room: GameRoom
}