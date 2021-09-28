import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { Hash } from 'src/utils/Hash';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll(params?: FilterUsersDto) {
    if (params) {
      const filters: FilterQuery<User> = {};
      const { limit, offset } = params;
      return this.userModel.find(filters).skip(offset).limit(limit).exec();
    }
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found.`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    const hashPassword = Hash.make(newModel.password);
    newModel.password = hashPassword;
    const model = await newModel.save();
    const { password, ...rta } = model.toJSON();
    return rta;
  }

  update(id: string, changes: UpdateUserDto) {
    const user = this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found.`);
    }
    return user;
  }

  remove(id: string) {
    const user = this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found.`);
    }
    return this.userModel.findByIdAndDelete(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
