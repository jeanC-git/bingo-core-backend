import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { GameRoom } from "./game_room.entity"
import { User } from "src/auth/entities/user.entity"


@Entity("player_list")
export class PlayerList {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    status: string

    @Column("uuid")
    gameRoomId: string

    @ManyToOne(() => GameRoom, (game_room: GameRoom) => game_room.playerList)
    gameRoom: GameRoom

    @ManyToOne(() => User, (user: User) => user.id)
    user: User
}