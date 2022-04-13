import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
    async register(data: AuthRegisterDto): Promise<User> {
        // generate the new user in the database
        const hash = await argon.hash(data.password);
        // save the new user in database
        try {
            const result = await this.prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    hash,
                },
            });
            delete result.hash;

            return result;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async login(data: AuthLoginDto): Promise<Tokens> {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        // if user dose not exist throw exception
        if (!user) throw new ForbiddenException('Access Denied');
        // compare password
        const pwMatches = await argon.verify(user.hash, data.password);
        // if password incorrect throw exception
        if (!pwMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.createToken(user.id, user.email);

        return tokens;
    }

    async refreshToken(user: User): Promise<Tokens> {
        const tokens = await this.createToken(user.id, user.email);

        return tokens;
    }

    async createToken(userId: number, email: string): Promise<Tokens> {
        const payload = {
            sub: userId,
            email,
        };

        const secret = this.config.get('JWT_SECRET');

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '1h',
                secret: secret,
            }),
            this.jwt.signAsync(payload, {
                expiresIn: '1d',
                secret: secret,
            }),
        ]);

        return { access_token: access_token, refresh_token: refresh_token };
    }
}
