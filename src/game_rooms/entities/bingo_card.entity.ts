import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { GameRoom } from "./game_room.entity"
import { User } from "src/auth/entities/user.entity"


@Entity("bingo_cards")
export class BingoCard {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("json")
    json_data: string

    @Column("uuid")
    gameRoomId: string

    @ManyToOne(() => GameRoom, (game_room: GameRoom) => game_room.bingoCards)
    gameRoom: GameRoom

    @ManyToOne(() => User, (user: User) => user.bingo_card)
    user: User
}