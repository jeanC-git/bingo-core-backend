import { IsArray, IsNotEmpty } from "class-validator";


export class EvaluateBingoCardsDto {

    @IsArray()
    @IsNotEmpty()
    bingoCards: string[]
}