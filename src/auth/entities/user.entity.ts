import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Expose} from "class-transformer";

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
    created_at:string

    @UpdateDateColumn()
    updated_at:string

    @DeleteDateColumn()
    deleted_at:string


    @Expose()
    get fullName(): string {
        return `${this.name}, ${this.surname} ${this.lastname}`;
    }
}
