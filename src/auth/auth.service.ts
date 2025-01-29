import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async signUp(signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    const user = await this.userModel.create({
      name,
      email,
      password,
    });
    await user.save();

    const token = await this.jwtService.sign({ id: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string | number>('JWT_EXPIRES'),
      });

    return (
      {
        user,
        token,
      }
    );
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    const token = await this.jwtService.sign({ id: user.id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string | number>('JWT_EXPIRES'),
      });

    return (
      {
        user,
        token,
      }
    );
  }

}
