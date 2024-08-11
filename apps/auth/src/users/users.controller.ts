import { Body, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.Dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async createUser(@Body() request: CreateUserDto) {
    return this.userService.createUser(request);
  }
}
