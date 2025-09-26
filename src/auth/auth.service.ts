import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/user/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; 
import { RefreshToken } from './entities/refresh_token.entity';
import { Payload } from './dto/payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository : Repository<Role>,
    @InjectRepository(RefreshToken) private readonly refreshTokenRepository : Repository<RefreshToken>,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto){
    const {username, password} = loginDto;

    const user = await this.userRepository.findOne({where: {username}, relations: ['role']});
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload : Payload = {
      id: user.id,
      username: user.username,
      role: user.role.name
    }
    const expires_in = 3600 * 1000 * 12; // 12 hours
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {expiresIn: expires_in});

    await this.refreshTokenRepository.save({user, token: refresh_token});

    return {
      expires_in,
      access_token,
      refresh_token,
      user
    };
  }

  async refresh(refresh_token: string){
    
    const token  = await this.refreshTokenRepository.findOne({where: {token: refresh_token}, relations: ['user', 'user.role']});
    if(!token){
      throw new Error("Token not found")
    }
    const user = token.user;
    const idToken = token.id;

    if(!user){
      throw new Error("User not found")
    }

    const payload : Payload = {
      id: user.id,
      username: user.username,
      role: user.role.name
    }
    const expires_in = 3600 * 1000 * 12; // 12 hours

    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = this.jwtService.sign(payload, {expiresIn: expires_in});

    await this.refreshTokenRepository.update(idToken, {token: new_refresh_token});

    return {
      expires_in,
      access_token,
      refresh_token: new_refresh_token,
      user
    };
  }

  async register(createAuthDto: CreateAuthDto) {

    const {username, password, email, role} = createAuthDto;
    const role_user = await this.roleRepository.findOneBy({name: role});

    if (!role_user) {
      throw new Error('Role not found');
    }

    const passHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.findOneBy({email, username});

    if (user) {
      throw new Error('User already exists');
    }

    const newUser = this.userRepository.create({
      username,
      password: passHash,
      email,
      role: role_user,
    });
    
    return this.userRepository.save(newUser);
  }

  async profile(user: User) {
    return this.userRepository.findOne({where: {id: user.id}, relations: ['role']});
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
