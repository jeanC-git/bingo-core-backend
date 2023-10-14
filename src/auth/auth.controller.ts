import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Patch("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("/check-status")
  checkStatus() {
    return this.authService.checkStatus();
  }
}
