import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
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

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @DeleteDateColumn()
    deletedAt: string

    @ManyToOne(() => GameRoom, (gameRoom: GameRoom) => gameRoom.pickedBalls)
    gameRoom: GameRoom
}