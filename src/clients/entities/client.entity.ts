import { ClientForm } from 'src/client-forms/entities/client-form.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => ClientForm, (clientForm) => clientForm.client)
  clientForm: ClientForm
}
