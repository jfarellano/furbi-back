import { IsArray, IsJSON, IsNotEmpty, IsUUID } from "class-validator"

export class CreateTeamDto {
    @IsUUID()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    color: string;
}
