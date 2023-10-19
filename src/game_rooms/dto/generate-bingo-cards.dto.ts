import { IsNumber } from "class-validator";


export class GenerateBingoCardsDto {

    @IsNumber()
    quantity: number
}