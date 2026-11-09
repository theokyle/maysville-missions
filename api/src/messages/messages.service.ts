import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

import { CreateMessageDto } from './dto/create-message-dto';
import { UpdateMessageDto } from './dto/update-message-dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get messages for a group journey.
   *
   * Returns original posts and their replies.
   * An optional step ID filters the discussion to one journey step.
   */
  async getMessages(
    userId: string,
    journeyInstanceId: string,
    journeyStepId?: string,
  ) {
    await this.getAccessibleGroupJourney(userId, journeyInstanceId);

    return this.prisma.journeyMessage.findMany({
      where: {
        journeyInstanceId,
        parentId: null,
        ...(journeyStepId ? { journeyStepId } : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        journeyStep: {
          select: {
            id: true,
            title: true,
            sortOrder: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Create an original group discussion post.
   */
  async createMessage(
    userId: string,
    journeyInstanceId: string,
    dto: CreateMessageDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const instance = await this.getAccessibleGroupJourney(
        userId,
        journeyInstanceId,
        tx,
      );

      if (dto.journeyStepId) {
        await this.validateJourneyStep(
          tx,
          instance.journeyId,
          dto.journeyStepId,
        );
      }

      return tx.journeyMessage.create({
        data: {
          content: dto.content,
          userId,
          journeyInstanceId,
          journeyStepId: dto.journeyStepId ?? null,
          parentId: null,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          journeyStep: true,
        },
      });
    });
  }

  /**
   * Reply to an existing original post.
   *
   * Replies inherit the original post's journey step.
   * Replies to replies are not permitted.
   */
  async replyToMessage(userId: string, parentId: string, content: string) {
    return this.prisma.$transaction(async (tx) => {
      const parent = await tx.journeyMessage.findUnique({
        where: {
          id: parentId,
        },
        include: {
          journeyInstance: true,
        },
      });

      if (!parent) {
        throw new NotFoundException('Message not found');
      }

      await this.getAccessibleGroupJourney(
        userId,
        parent.journeyInstanceId,
        tx,
      );

      if (parent.parentId !== null) {
        throw new BadRequestException('Replies to replies are not permitted');
      }

      return tx.journeyMessage.create({
        data: {
          content,
          userId,
          journeyInstanceId: parent.journeyInstanceId,
          journeyStepId: parent.journeyStepId,
          parentId: parent.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  }

  /**
   * Update a message created by the requesting user.
   */
  async updateMessage(
    userId: string,
    messageId: string,
    dto: UpdateMessageDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.journeyMessage.findFirst({
        where: {
          id: messageId,
          userId,
        },
      });

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      await this.getAccessibleGroupJourney(
        userId,
        message.journeyInstanceId,
        tx,
      );

      return tx.journeyMessage.update({
        where: {
          id: messageId,
        },
        data: {
          content: dto.content,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  }

  /**
   * Delete a message created by the requesting user.
   *
   * An original post cannot be deleted while it has replies.
   */
  async deleteMessage(userId: string, messageId: string) {
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.journeyMessage.findFirst({
        where: {
          id: messageId,
          userId,
        },
        include: {
          replies: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      await this.getAccessibleGroupJourney(
        userId,
        message.journeyInstanceId,
        tx,
      );

      if (message.replies.length > 0) {
        throw new BadRequestException(
          'Delete the replies before deleting this post',
        );
      }

      await tx.journeyMessage.delete({
        where: {
          id: messageId,
        },
      });

      return {
        success: true,
      };
    });
  }

  /**
   * Verify that a journey instance is a group journey
   * and that the user is a current group member.
   */
  private async getAccessibleGroupJourney(
    userId: string,
    journeyInstanceId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const instance = await tx.journeyInstance.findFirst({
      where: {
        id: journeyInstanceId,
        userId: null,
        groupId: {
          not: null,
        },
        group: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
        journeyId: true,
        groupId: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Group journey not found');
    }

    return instance;
  }

  /**
   * Verify that a step belongs to the specified journey.
   */
  private async validateJourneyStep(
    tx: Prisma.TransactionClient,
    journeyId: string,
    journeyStepId: string,
  ) {
    const step = await tx.journeyStep.findFirst({
      where: {
        id: journeyStepId,
        journeyId,
      },
    });

    if (!step) {
      throw new BadRequestException(
        'The selected step does not belong to this journey',
      );
    }

    return step;
  }
}
