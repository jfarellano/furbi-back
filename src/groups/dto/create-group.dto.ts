import { IsArray, IsJSON, IsNotEmpty } from "class-validator"

export class CreateGroupDto {
    @IsNotEmpty()
    name: string;
}
