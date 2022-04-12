import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class GetUserDto implements User {
    @Exclude()
    hash: string;

    createdAt: Date;
    updatedAt: Date;
    id: number;
    email: string;
    name: string;

    constructor(partial: Partial<GetUserDto>) {
        Object.assign(this, partial);
    }
}
