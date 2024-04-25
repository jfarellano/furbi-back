import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto';

interface Team {
    name: string;
    color: string;
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {

    teams: Team[];
}
