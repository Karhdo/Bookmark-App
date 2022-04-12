import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    hash: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
