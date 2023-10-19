import { InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const DBErrors: string[] = [
    "23505",
    "23503"
];


const configService = new ConfigService();
export const handleExceptions = (error: any, source = 'DB Handler') => {
    const appEnvironment = configService.get("APP_ENVIRONMENT");

    if (appEnvironment === "dev") {
        const logger = new Logger(source);

        logger.error(error);

        if (DBErrors.includes(error.code))
            throw new InternalServerErrorException(`${error.detail}`);
    }

    // if (error.status == 404) {
    //     throw new BadRequestException(`${error.message}`);
    // }

    throw new InternalServerErrorException("Unexpected error - Check logs");
}
