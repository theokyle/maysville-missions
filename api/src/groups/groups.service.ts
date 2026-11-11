import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { CreateGroupDto } from './dto/create-group.dto';

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
  // GET ALL GROUPS
  // --------------------------------------------------

  async getGroups(userId: string) {
    return this.prisma.group.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        // Only return the current user's membership.
        // This allows the frontend to determine isMember.
        members: {
          where: { userId },
        },
        _count: {
          select: {
            members: true,
            journeyInstances: true,
          },
        },
      },
    });
  }

  // --------------------------------------------------
  // GET SINGLE GROUP
  // --------------------------------------------------

  async getGroup(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          orderBy: {
            joinedAt: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        journeyInstances: {
          orderBy: {
            startedAt: 'desc',
          },
          include: {
            journey: {
              include: {
                steps: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                },
              },
            },
            stepInstances: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            journeyInstances: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  // --------------------------------------------------
  // CREATE GROUP
  // --------------------------------------------------

  async createGroup(userId: string, dto: CreateGroupDto) {
    return this.prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: dto.name,
          description: dto.description,
          members: {
            create: {
              userId,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
              journeyInstances: true,
            },
          },
        },
      });

      return group;
    });
  }

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
