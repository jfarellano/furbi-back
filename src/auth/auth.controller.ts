import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.phone, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto) {
    return this.authService.register(registerDto.phone, registerDto.password, registerDto.name);    
  }
}
