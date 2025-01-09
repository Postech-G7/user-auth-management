import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {
    if (!UserModel) {
      throw new Error('UserModel is not defined');
    }
  }
  
  async create(createUserDto: CreateUserDto) {
    const user = await this.UserModel.create(createUserDto);
    return user.save();
  }

  async findAll() {
    const users = await this.UserModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);
    return user;
  }
  
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.UserModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }

}
