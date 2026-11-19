import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from '../domain/user';
import { UserOrm } from './user.orm-entity';

@Injectable()
export class UserTypeOrmRepository {
  constructor(@InjectRepository(UserOrm) private readonly repository: Repository<UserOrm>) {}

  async save(data: UserData): Promise<UserData> {
    return this.repository.save(this.repository.create(data));
  }

  async findByEmail(email: string): Promise<UserData | null> {
    return this.repository.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }
}
