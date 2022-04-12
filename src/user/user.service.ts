import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { Bookmark, Folder, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFolderDto } from 'src/folder/dto';
import { UpdateUserDto } from './dto/user-update.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async get(): Promise<User[]> {
        try {
            const result = await this.prisma.user.findMany({
                include: {
                    folder: {
                        include: {
                            bookmark: true,
                        },
                    },
                },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const result = await this.prisma.user.delete({
                where: {
                    id,
                },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async getCurrent(id: number): Promise<User> {
        try {
            const result = await this.prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    folder: { include: { bookmark: true } },
                },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateCurrent(id: number, data: UpdateUserDto): Promise<User> {
        try {
            // Hash new password
            const newHash = await argon.hash(data.password);

            const result = await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name: data.name,
                    email: data.email,
                    hash: newHash,
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

    async createFolderByCurrent(id: number, data: CreateFolderDto): Promise<Folder> {
        try {
            const result = await this.prisma.folder.create({
                data: {
                    name: data.name,
                    userId: id,
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

    async getFolderByCurrent(id: number): Promise<Folder[]> {
        try {
            const result = await this.prisma.folder.findMany({
                where: {
                    userId: id,
                },
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async getBookmarkByCurrent(folderId: number, userId: number): Promise<Bookmark[]> {
        try {
            const hasFolder = await this.prisma.folder.findMany({
                where: {
                    id: folderId,
                    userId,
                },
            });

            if (!hasFolder.length) {
                throw new ForbiddenException(`User hasn't bookmark(id: ${folderId})`);
            } else {
                const result = await this.prisma.bookmark.findMany({
                    where: {
                        folderId,
                    },
                });

                return result;
            }
        } catch (error) {
            throw error;
        }
    }
}
