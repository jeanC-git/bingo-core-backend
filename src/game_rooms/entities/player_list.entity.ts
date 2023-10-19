import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { GameRoom } from "./game_room.entity"


@Entity("player_list")
export class PlayerList {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    status: string

    @Column("uuid")
    userId: string

    @Column("uuid")
    gameRoomId: string

    @ManyToOne(() => GameRoom, (game_room: GameRoom) => game_room.playerList)
    gameRoom: GameRoom
}