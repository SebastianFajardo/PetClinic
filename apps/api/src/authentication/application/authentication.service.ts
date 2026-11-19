import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { compare, hash } from 'bcryptjs';
import { UserData, toAuthenticatedUser } from '../domain/user';
import { UserTypeOrmRepository } from '../infrastructure/user.typeorm-repository';

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  constructor(private readonly users: UserTypeOrmRepository, private readonly jwt: JwtService) {}

  async register(input: RegisterUser) {
    const email = input.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('The email address is already registered');
    }
    const now = new Date();
    const user: UserData = {
      id: randomUUID(),
      name: input.name.trim(),
      email,
      passwordHash: await hash(input.password, 12),
      role: 'assistant',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    return this.createSession(await this.users.save(user));
  }

  async login(emailInput: string, password: string) {
    const user = await this.users.findByEmail(emailInput.trim().toLowerCase());
    if (!user || !user.isActive || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.createSession(user);
  }

  private async createSession(user: UserData) {
    const identity = toAuthenticatedUser(user);
    const accessToken = await this.jwt.signAsync({
      sub: identity.id,
      email: identity.email,
      name: identity.name,
      role: identity.role,
    });
    return { accessToken, user: identity };
  }
}
