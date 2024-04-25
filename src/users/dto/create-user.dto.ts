import { IsEmail, IsNotEmpty, IsMobilePhone } from "class-validator";

export class CreateUserDto {
  @IsMobilePhone()
  phone: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  name: string
}
