import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JourneyType } from 'src/generated/prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}
  async joinGroup(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existing = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Already a member of this group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
      },
      include: {
        group: true,
      },
    });
  }

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

    return this.prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }

  async enrollGroup(groupId: string, journeyId: string) {
    const journey = await this.prisma.journey.findUnique({
      where: {
        id: journeyId,
      },
      include: {
        steps: true,
      },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    if (journey.type !== JourneyType.GROUP) {
      throw new ConflictException('This journey is not available to groups');
    }

    const group = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existing = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_groupId: {
          journeyId,
          groupId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Group is already enrolled in this journey');
    }

    return this.prisma.$transaction(async (tx) => {
      const journeyInstance = await tx.journeyInstance.create({
        data: {
          groupId,
          journeyId,
        },
      });

      await tx.journeyStepInstance.createMany({
        data: journey.steps.map((step) => ({
          journeyInstanceId: journeyInstance.id,
          journeyStepId: step.id,
          currentCount: 0,
          completed: false,
        })),
      });

      return tx.journeyInstance.findUnique({
        where: {
          id: journeyInstance.id,
        },
        include: {
          journey: true,
          group: true,
          stepInstances: {
            include: {
              journeyStep: true,
            },
            orderBy: {
              journeyStep: {
                sortOrder: 'asc',
              },
            },
          },
        },
      });
    });
  }

  async removeGroupEnrollment(groupId: string, journeyId: string) {
    const journeyInstance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_groupId: {
          journeyId,
          groupId,
        },
      },
    });

    if (!journeyInstance) {
      throw new NotFoundException('Group journey enrollment not found');
    }

    return this.prisma.journeyInstance.delete({
      where: {
        id: journeyInstance.id,
      },
    });
  }
}
