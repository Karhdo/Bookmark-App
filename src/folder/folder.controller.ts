import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';
import { Bookmark, Folder } from '@prisma/client';

UseGuards(JwtGuard);
@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService) {}

    @Get('all')
    get(): Promise<Folder[]> {
        return this.folderService.get();
    }

    @Patch(':id/update')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: CreateFolderDto): Promise<Folder> {
        return this.folderService.update(id, data);
    }

    @Delete(':id/delete')
    delete(@Param('id', ParseIntPipe) id: number): Promise<Folder> {
        return this.folderService.delete(id);
    }

    @Post(':id/bookmarks/store')
    createBookmark(@Param('id', ParseIntPipe) id: number, @Body() data: CreateBookmarkDto): Promise<Bookmark> {
        return this.folderService.createBookmark(id, data);
    }
}
