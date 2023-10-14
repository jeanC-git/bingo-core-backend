import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn} from "typeorm";

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
    starts_at: string

    @Column()
    finishes_at: string

    @Column()
    started_at: string

    @Column()
    finished_at: string

    @CreateDateColumn()
    created_at: string

    @UpdateDateColumn()
    updated_at: string

    @DeleteDateColumn()
    deleted_at: string
}
