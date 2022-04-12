import { ForbiddenException, Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}
    async get(): Promise<Bookmark[]> {
        try {
            const results = await this.prisma.bookmark.findMany();

            return results;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: UpdateBookmarkDto): Promise<Bookmark> {
        try {
            const result = await this.prisma.bookmark.update({
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

    async delete(id: number): Promise<Bookmark> {
        try {
            const result = await this.prisma.bookmark.delete({
                where: { id },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }
}
