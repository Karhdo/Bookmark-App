import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Bookmark, Folder, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { CreateFolderDto } from 'src/folder/dto';
import { UpdateUserDto, GetUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('all')
    async get(): Promise<User[]> {
        return plainToInstance(GetUserDto, await this.userService.get());
    }

    @Delete(':id/delete')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return plainToInstance(GetUserDto, this.userService.delete(id));
    }

    @Get('me')
    async getCurrent(@GetUser() user: User): Promise<any> {
        return plainToInstance(GetUserDto, this.userService.getCurrent(user.id));
    }

    @Patch('me/update')
    async updateCurrent(@GetUser() user: User, @Body() data: UpdateUserDto): Promise<any> {
        return plainToInstance(GetUserDto, this.userService.updateCurrent(user.id, data));
    }

    @Post('me/folders/store')
    async createFolderByCurrent(@GetUser() user: User, @Body() data: CreateFolderDto): Promise<Folder> {
        return this.userService.createFolderByCurrent(user.id, data);
    }

    @Get('me/folders/all')
    async getFolderByCurrent(@GetUser() user: User): Promise<Folder[]> {
        return this.userService.getFolderByCurrent(user.id);
    }

    @Get('me/folders/:id/bookmarks')
    async getBookmarkByCurrent(
        @Param('id', ParseIntPipe) folderId: number,
        @GetUser() user: User,
    ): Promise<Bookmark[]> {
        return this.userService.getBookmarkByCurrent(folderId, user.id);
    }
}
