import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bycrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.Dto';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(request: CreateUserDto) {
    await this.validateCreateUserRequest(request);
    const user = await this.userRepository.create({
      ...request,
      password: await bycrypt.hash(request.password, 10),
    });
    return user;
  }

  private async validateCreateUserRequest(request: CreateUserDto) {
    let user: User;

    try {
      user = await this.userRepository.findOne({
        email: request.email,
      });
    } catch (err) {
      if (user) {
        throw new UnprocessableEntityException('Email already exists.');
      }
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    const passwordIsValid = await bycrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.userRepository.findOne(getUserArgs);
  }
}
