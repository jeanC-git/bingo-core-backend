import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
// import {WinstonModule} from "nest-winston";
// import {format, transports} from "winston";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // logger: WinstonModule.createLogger({
        //     transports: [
        //         // let's log errors into its own file
        //         new transports.File({
        //             filename: `logs/error.log`,
        //             level: 'error',
        //             format: format.combine(format.timestamp(), format.json()),
        //         }),
        //         // logging all level
        //         // new transports.File({
        //         //     filename: `logs/combined.log`,
        //         //     format: format.combine(format.timestamp(), format.json()),
        //         // }),
        //         // we also want to see logs in our console
        //         new transports.Console({
        //             format: format.combine(
        //                 format.cli(),
        //                 format.splat(),
        //                 format.timestamp(),
        //                 format.printf((info) => {
        //                     return `${info.timestamp} ${info.level}: ${info.message}`;
        //                 }),
        //             ),
        //         }),
        //     ],
        // }),
    });

    app.setGlobalPrefix("/api");
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    // await app.listen(3000);
    await app.listen(process.env.PORT, "0.0.0.0");

}

bootstrap();
