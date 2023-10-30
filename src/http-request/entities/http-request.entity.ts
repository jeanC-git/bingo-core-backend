import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('http_requests')
export class HttpRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @Column({ nullable: true })
  userId: string;

  @Column('json')
  reqParams: string;

  @Column('json')
  reqBody: string;

  @Column({ type: 'json', nullable: true })
  resBody: string;

  @Column({ nullable: true })
  resStatusCode: string;

  @Column()
  httpMethod: string;

  @Column()
  url: string;

  @Column({ default: null })
  startsExecutionAt: string;

  @Column({ default: null })
  endsExecutionAt: string;

  @Column({ default: null })
  executionTime: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
