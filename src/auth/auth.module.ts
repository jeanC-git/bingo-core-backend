import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from '@nestjs/passport';


import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from "./entities/user.entity";

import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpRequest } from 'src/common/entities/http-request.entity';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        ConfigModule,

        TypeOrmModule.forFeature([User, HttpRequest]),

        PassportModule.register({ defaultStrategy: 'jwt', }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {

                // console.log(`configService ${configService.get('JWT_SECRET')}`);
                // console.log(`JWT SECRET ${process.env.JWT_SECRET}`);

                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '2h'
                    }
                }
            },
        }),
    ],
    exports: [
        TypeOrmModule,

        JwtStrategy,

        PassportModule,

        JwtModule,

        AuthService
    ]
})
export class AuthModule {
}
