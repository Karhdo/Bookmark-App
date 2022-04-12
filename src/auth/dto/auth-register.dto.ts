import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class AuthRegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;
}
