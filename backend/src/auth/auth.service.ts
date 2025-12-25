import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Convert Mongoose document to plain object
    const userObj = (user as UserDocument).toObject();
    const { password: _, ...result } = userObj;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user._id.toString());

    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.USER,
    });

    // Convert Mongoose document to plain object
    const userObj = (user as UserDocument).toObject();
    const { password: _, ...result } = userObj;

    return {
      message: 'User registered successfully',
      user: result,
    };
  }
}

