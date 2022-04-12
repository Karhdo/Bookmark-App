import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() data: AuthRegisterDto): Promise<User> {
        return this.authService.register(data);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() data: AuthLoginDto): Promise<Tokens> {
        return this.authService.login(data);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetUser() user: User): Promise<void> {
        return this.authService.logout(user.id);
    }
}
