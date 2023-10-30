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

    @Column("uuid")
    userId: string

    @ManyToOne(() => GameRoom, (game_room: GameRoom) => game_room.bingoCards)
    gameRoom: GameRoom

    @ManyToOne(() => User, (user: User) => user.bingo_card)
    user: User

    static async generateBingoCard() {

        const bingoCard = [];
        const template = [];
        const maxNumber = 50;

        for (let i = 0; i < 5; i++) {

            const partial = [];

            do {

                const element = Math.floor(Math.random() * (maxNumber - 0)) + 0;

                if (bingoCard.length === 2 && partial.length === 2) {
                    partial.push(null);
                    continue;
                }

                if (!partial.find(el => el === element)) {
                    partial.push(element);
                    continue;
                }

            } while (partial.length < 5);

            bingoCard.push(partial);
            template.push([0, 0, 0, 0, 0]);

        }

        return { bingoCard, template };

    }

    evaluate() {

    }
}