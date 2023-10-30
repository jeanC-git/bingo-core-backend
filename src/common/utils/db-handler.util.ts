import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QueryFailedError } from "typeorm";

const DBErrors: string[] = [
    "23505",
    "23503"
];

const CommonErrors: number[] = [
    400, 404, 401
]

export const handleExceptions = (error: any) => {
    const configService = new ConfigService();

    const appEnvironment = configService.get("APP_ENVIRONMENT");

    if (appEnvironment === "dev") {

        if (error instanceof QueryFailedError)
            throw new InternalServerErrorException(`${error.message}`);

    }

    if (CommonErrors.includes(error.status)) {

        throw new BadRequestException(`${error.message}`);

    }

    throw new InternalServerErrorException("Unexpected error - Check logs");
}
