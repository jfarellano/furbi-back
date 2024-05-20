import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
    // Check that phone is not already in use
    let newUserPhone = phone.replace(" ", ""); // remove spaces before saving to DB
    const exists = await this.usersService.findOneByPhone(newUserPhone);
    if(exists != null){
      throw new HttpException('User not created.', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersService.create({
      phone: newUserPhone,
      password: pass,
      name: name
    });

    return {
      message: "user created!"
    };
  }
}
