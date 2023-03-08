import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

  ) {}

  async create(userData: CreateUserDto) {
    //이메일 중복 체크
    const existUser = await this.getByEmail(userData.email);
    if (!_.isNil(existUser)) {
      throw new ConflictException(`User already exists. email: ${userData.email}`);
    }
    //해시, salt 10번//login password 지워지는거
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
    
    return newUser;
  }
  //이건 아직 xx
  updateUser(email: string, nickname: string, password: string) {
    this.userRepository.update({ email }, { nickname, password });
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email, deleted_at: null },
      select: ['nickname'],
    });
  }

  async findOneByEmail(email: string) {
    console.log(email);

    return await this.userRepository.findOneBy({ email: email });
  }
  async findPassword(email: string){
    const a = await this.userRepository.findOne({where: { email, deleted_at: null },
      select: ['password'],});
      
    return a  
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ user_id: id });
  }
  //refreshToken update
  async update(id: number, updateUserDto: UpdateUserDto) {

    return await this.userRepository.update(id, updateUserDto);
  }

    // My page API
    async getUser(userId: number) {
      return await this.userRepository.findOne({
        where: { user_id:userId},
        select: ['email', 'name', 'nickname', 'address', 'phone_number', 'password']
      });
    }
  
      updateUserInfo(userId: number, nickname: string, address: string, phone_number: string, password: string) {
      this.userRepository.update({
        user_id:userId}, 
        { 
          nickname, 
          address, 
          phone_number, 
          password
        });
    }
  
    // deleteUser(userId: number, password: number) {
    //   if (this.userPassword.get(userId) !== password) {
    //     throw new UnauthorizedException(
    //       '입력된 비밀번호가 다릅니다.'
    //     );   
    //   }
    // }
}