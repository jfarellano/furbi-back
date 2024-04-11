import { PartialType } from '@nestjs/mapped-types';
import { CreateClientFormDto } from './create-client-form.dto';

export class UpdateClientFormDto extends PartialType(CreateClientFormDto) {}
