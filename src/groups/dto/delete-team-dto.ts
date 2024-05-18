import { IsArray, IsJSON, IsNotEmpty, IsUUID } from "class-validator"

export class DeleteTeamDto {
    @IsUUID()
    id: string;
}
