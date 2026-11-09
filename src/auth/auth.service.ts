import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { timestamp } from 'rxjs';
import { time } from 'node:console';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ) {}


  async  create(createAuthDto: CreateUserDto) {
    
    try {

     
      console.log(createAuthDto);
      let user = await this.userRepository.create(createAuthDto);

       return await this.userRepository.save(user);
      
    } catch (error) {
    
      this.checkError(error);
    }


  }


  checkError(error: any) {


    if (error.code === '23505') {
    
      throw new ConflictException({
        message: 'User with this email already exists',
        field: 'email',
        statusCode: 409,
        timestamp: new Date().toISOString(),
      });
    }
  
  }

}
