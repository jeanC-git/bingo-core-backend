import { IsArray, IsNotEmpty } from "class-validator";

export interface BingoCardFront {
    id: string,
    template: []
}

export class EvaluateBingoCardsDto {

    @IsArray()
    @IsNotEmpty()
    bingoCards: BingoCardFront[]
}