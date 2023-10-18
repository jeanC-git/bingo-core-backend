import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Auth } from './decorators';

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("/check-status")
  @Auth()
  checkStatus() {
    return this.authService.checkStatus();
  }
}
