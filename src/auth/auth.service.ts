import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from '@nestjs/jwt';

import { DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

import { JwtPayload } from './interfaces';

import { User } from "./entities/user.entity";
import { handleExceptions } from 'src/common/utils';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,

        private readonly dataSource: DataSource,

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
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const userDB = await this.validateEmailExistence(registerDto.email);

            if (userDB) {
                throw new BadRequestException("Email already registered.");
            }

            const { password, ...userData } = registerDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });

            await this.userRepository.save(user);
            delete user.password;

            await queryRunner.commitTransaction();

            return {
                ...user,
                token: this.generateJwt({ id: user.id }),
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            handleExceptions(error);
        } finally {
            await queryRunner.release();
        }
    }

    async validateEmailExistence(email: string) {
        const userDB = await this.userRepository.findOne({ where: { email } });

        return userDB;
    }

    generateJwt(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    checkStatus() {
        return {};
    }

}
