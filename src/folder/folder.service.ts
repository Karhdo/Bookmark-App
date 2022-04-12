import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Bookmark, Folder } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFolderDto } from './dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

@Injectable()
export class FolderService {
    constructor(private prisma: PrismaService) {}

    async get(): Promise<Folder[]> {
        try {
            const result = await this.prisma.folder.findMany({
                include: { bookmark: true },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: CreateFolderDto): Promise<Folder> {
        try {
            const result = await this.prisma.folder.update({
                where: {
                    id,
                },
                data,
            });

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

    async delete(id: number): Promise<Folder> {
        try {
            const result = await this.prisma.folder.delete({
                where: {
                    id,
                },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async createBookmark(id: number, data: CreateBookmarkDto): Promise<Bookmark> {
        try {
            const result = await this.prisma.bookmark.create({
                data: {
                    title: data.title,
                    description: data.description,
                    link: data.link,
                    folderId: id,
                },
            });

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
}
