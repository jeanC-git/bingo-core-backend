import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Expose } from "class-transformer";
import { BingoCard } from "src/game_rooms/entities/bingo_card.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    name: string;

    @Column('text')
    surname: string;

    @Column('text')
    lastname: string;

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @DeleteDateColumn()
    deletedAt: string

    @OneToMany(() => BingoCard, (bingo_card: BingoCard) => bingo_card.user)
    bingo_card: BingoCard


    @Expose()
    get fullName(): string {
        return `${this.name}, ${this.surname} ${this.lastname}`;
    }
}
