import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.validatePassword(phone, pass)

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, phone: user.phone, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(phone: string, pass: string, name: string): Promise<any> {
    //const user = await this.usersService.validatePassword(phone, pass)

    const user = this.usersService.create({
      phone: phone,
      password: pass,
      name: name
    });

    return {
      message: "user created!"
    };
  }
}
