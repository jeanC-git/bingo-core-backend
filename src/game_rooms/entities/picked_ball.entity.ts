import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { GameRoom } from "./game_room.entity"

@Entity("picked_balls")
export class PickedBall {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    label: string

    @Column()
    letter: string

    @Column()
    number: number

    @Column("uuid")
    gameRoomId: string

    @ManyToOne(() => GameRoom, (gameRoom: GameRoom) => gameRoom.pickedBalls)
    gameRoom: GameRoom
}