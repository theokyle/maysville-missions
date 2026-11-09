import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  // --------------------------------------------------
  // JOIN GROUP
  // --------------------------------------------------

  async joinGroup(userId: string, groupId: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const group = await tx.group.findUnique({
          where: { id: groupId },
        });

        if (!group) {
          throw new NotFoundException('Group not found');
        }

        // Create group membership.
        const membership = await tx.groupMember.create({
          data: {
            groupId,
            userId,
          },
          include: {
            group: true,
          },
        });

        // Initialize progress for active group journeys.
        await this.enrollmentsService.initializeGroupJourneyProgress(
          tx,
          groupId,
          userId,
        );

        return membership;
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Already a member of this group');
      }

      throw error;
    }
  }

  // --------------------------------------------------
  // LEAVE GROUP
  // --------------------------------------------------

  async leaveGroup(userId: string, groupId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Group membership not found');
    }

    // Remove membership only.
    // Preserve journey progress and messages.
    return this.prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }
}
