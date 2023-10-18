import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

import { JwtPayload } from './interfaces';
import { handleExceptions } from 'src/common/utils';

import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {
    }

    async login(loginDto: LoginDto) {
        const { password, email } = loginDto;

        const user = await this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true, name: true },
        });

        if (!user) throw new UnauthorizedException(`Credentials are not valid (user)`);

        if (!bcrypt.compareSync(password, user.password))
            throw new UnauthorizedException(`Credentials are not valid (password)`);

        delete user.password;

        return {
            ...user,
            token: this.generateJwt({ id: user.id }),
        };
    }

    async register(registerDto: RegisterDto) {
        try {

            const { password, ...userData } = registerDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });

            await this.userRepository.save(user);
            delete user.password;

            return {
                ...user,
                token: this.generateJwt({ id: user.id }),
            };

        } catch (error) {
            handleExceptions(error, `TicketsService.create`);

        }
    }

    generateJwt(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    checkStatus() {
        return {};
    }

}
