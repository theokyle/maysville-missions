import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentStatusDto } from './dto/enrollment-status.dto';
import { JourneyType } from 'src/generated/prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Enroll a user in an individual journey.
   */
  async enroll(userId: string, journeyId: string) {
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

    if (journey.type !== JourneyType.INDIVIDUAL) {
      throw new ConflictException('This journey is only available to groups');
    }

    const existing = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Already enrolled in this journey');
    }

    return this.prisma.$transaction(async (tx) => {
      const journeyInstance = await tx.journeyInstance.create({
        data: {
          userId,
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

  /**
   * Get all individual journeys for a user.
   */
  findUserJourneys(userId: string) {
    return this.prisma.journeyInstance.findMany({
      where: {
        userId,
      },
      include: {
        journey: true,
        stepInstances: {
          include: {
            journeyStep: true,
            activities: true,
          },
          orderBy: {
            journeyStep: {
              sortOrder: 'asc',
            },
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  /**
   * Get a specific individual journey for a user.
   */
  findUserJourney(userId: string, journeyId: string) {
    return this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
      include: {
        journey: true,
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
  }

  /**
   * Update the status of a user's journey.
   */
  async updateStatus(
    userId: string,
    journeyId: string,
    enrollmentStatusDto: EnrollmentStatusDto,
  ) {
    const { status } = enrollmentStatusDto;

    const journeyInstance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
    });

    if (!journeyInstance) {
      throw new NotFoundException('Journey enrollment not found');
    }

    return this.prisma.journeyInstance.update({
      where: {
        id: journeyInstance.id,
      },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });
  }

  /**
   * Remove a user's journey enrollment.
   *
   * Because JourneyStepInstance and Activity use cascading deletes,
   * removing the JourneyInstance will also remove its progress and activities.
   */
  async remove(userId: string, journeyId: string) {
    const journeyInstance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
    });

    if (!journeyInstance) {
      throw new NotFoundException('Journey enrollment not found');
    }

    return this.prisma.journeyInstance.delete({
      where: {
        id: journeyInstance.id,
      },
    });
  }

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
