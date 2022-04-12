import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { UpdateBookmarkDto } from './dto';

UseGuards(JwtGuard);
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get('all')
    async get(): Promise<Bookmark[]> {
        return this.bookmarkService.get();
    }

    @Patch(':id/update')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateBookmarkDto): Promise<Bookmark> {
        return this.bookmarkService.update(id, data);
    }

    @Delete(':id/delete')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Bookmark> {
        return this.bookmarkService.delete(id);
    }
}
