import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column('varchar')
  fullName: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

@Column('text', { array: true, default: ['user'] })
roles: string[];
}
