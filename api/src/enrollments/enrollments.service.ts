import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateJourneyStatusDto } from './dto/enrollment-status.dto';

import {
  JourneyStatus,
  JourneyType,
  Prisma,
} from 'src/generated/prisma/client';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------
  // INDIVIDUAL ENROLLMENT
  // --------------------------------------------------

  async enroll(userId: string, journeyId: string) {
    const journey = await this.prisma.journey.findUnique({
      where: { id: journeyId },
      include: {
        steps: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    if (journey.type !== JourneyType.INDIVIDUAL) {
      throw new BadRequestException('This journey is designed for groups');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const instance = await tx.journeyInstance.create({
          data: {
            journeyId,
            userId,
          },
        });

        if (journey.steps.length > 0) {
          await tx.journeyStepInstance.createMany({
            data: journey.steps.map((step) => ({
              journeyInstanceId: instance.id,
              journeyStepId: step.id,
              userId,
              currentCount: 0,
              completed: false,
            })),
          });
        }

        return tx.journeyInstance.findUnique({
          where: { id: instance.id },
          include: {
            journey: {
              include: {
                steps: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
            stepInstances: {
              where: { userId },
              include: {
                journeyStep: true,
                activities: true,
              },
            },
          },
        });
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('You are already enrolled in this journey');
      }

      throw error;
    }
  }

  // --------------------------------------------------
  // INDIVIDUAL JOURNEY RETRIEVAL
  // --------------------------------------------------

  async findUserJourneys(userId: string) {
    return this.prisma.journeyInstance.findMany({
      where: { userId },
      include: {
        journey: {
          include: {
            steps: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        stepInstances: {
          where: { userId },
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

  async findUserJourney(userId: string, journeyId: string) {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
      include: {
        journey: {
          include: {
            steps: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        stepInstances: {
          where: { userId },
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
    });

    if (!instance) {
      throw new NotFoundException('Journey enrollment not found');
    }

    return instance;
  }

  // --------------------------------------------------
  // INDIVIDUAL JOURNEY STATUS
  // --------------------------------------------------

  async updateStatus(
    userId: string,
    journeyId: string,
    dto: UpdateJourneyStatusDto,
  ) {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
      include: {
        stepInstances: {
          where: { userId },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Journey enrollment not found');
    }

    if (dto.status === JourneyStatus.COMPLETED) {
      const allStepsCompleted = instance.stepInstances.every(
        (step) => step.completed,
      );

      if (!allStepsCompleted) {
        throw new BadRequestException(
          'All journey steps must be completed before completing the journey',
        );
      }
    }

    return this.prisma.journeyInstance.update({
      where: { id: instance.id },
      data: {
        status: dto.status,
        completedAt: dto.status === JourneyStatus.COMPLETED ? new Date() : null,
      },
    });
  }

  // --------------------------------------------------
  // INDIVIDUAL JOURNEY REMOVAL
  // --------------------------------------------------

  async remove(userId: string, journeyId: string) {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_userId: {
          journeyId,
          userId,
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Journey enrollment not found');
    }

    await this.prisma.journeyInstance.delete({
      where: { id: instance.id },
    });

    return { success: true };
  }

  // --------------------------------------------------
  // GROUP JOURNEY ENROLLMENT
  // --------------------------------------------------

  async enrollGroup(userId: string, groupId: string, journeyId: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Verify the journey exists and is a group journey.
        const journey = await tx.journey.findUnique({
          where: { id: journeyId },
          include: {
            steps: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        });

        if (!journey) {
          throw new NotFoundException('Journey not found');
        }

        if (journey.type !== JourneyType.GROUP) {
          throw new BadRequestException(
            'This journey is not designed for groups',
          );
        }

        // Verify the group exists and retrieve its members.
        const group = await tx.group.findUnique({
          where: { id: groupId },
          include: { members: true },
        });

        if (!group) {
          throw new NotFoundException('Group not found');
        }

        // Verify the requesting user belongs to the group.
        const membership = await tx.groupMember.findUnique({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
        });

        if (!membership) {
          throw new ForbiddenException(
            'You must be a group member to enroll this group in a journey',
          );
        }

        // Create one shared enrollment for the group.
        const instance = await tx.journeyInstance.create({
          data: {
            journeyId,
            groupId,
          },
        });

        // Create individual progress records for every member and step.
        const progressRecords = group.members.flatMap((member) =>
          journey.steps.map((step) => ({
            journeyInstanceId: instance.id,
            journeyStepId: step.id,
            userId: member.userId,
            currentCount: 0,
            completed: false,
          })),
        );

        if (progressRecords.length > 0) {
          await tx.journeyStepInstance.createMany({
            data: progressRecords,
          });
        }

        // Return the completed enrollment structure.
        return tx.journeyInstance.findUnique({
          where: { id: instance.id },
          include: {
            journey: {
              include: {
                steps: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
            group: {
              include: {
                members: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            stepInstances: {
              include: {
                journeyStep: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          'This group is already enrolled in this journey',
        );
      }

      throw error;
    }
  }

  // --------------------------------------------------
  // INITIALIZE PROGRESS FOR NEW GROUP MEMBERS
  // Called by GroupsService when a user joins a group.
  // --------------------------------------------------

  async initializeGroupJourneyProgress(
    tx: Prisma.TransactionClient,
    groupId: string,
    userId: string,
  ) {
    const membership = await tx.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException(
        'User must be a group member to participate in group journeys',
      );
    }

    const groupJourneys = await tx.journeyInstance.findMany({
      where: {
        groupId,
        status: JourneyStatus.IN_PROGRESS,
      },
      include: {
        journey: {
          include: {
            steps: true,
          },
        },
      },
    });

    for (const instance of groupJourneys) {
      if (instance.journey.steps.length === 0) {
        continue;
      }

      await tx.journeyStepInstance.createMany({
        data: instance.journey.steps.map((step) => ({
          journeyInstanceId: instance.id,
          journeyStepId: step.id,
          userId,
          currentCount: 0,
          completed: false,
        })),
        skipDuplicates: true,
      });
    }
  }

  // --------------------------------------------------
  // GROUP JOURNEY RETRIEVAL
  // --------------------------------------------------

  async findUserGroupJourneys(userId: string) {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const groupIds = memberships.map((membership) => membership.groupId);

    if (groupIds.length === 0) {
      return [];
    }

    return this.prisma.journeyInstance.findMany({
      where: {
        groupId: {
          in: groupIds,
        },
      },
      include: {
        journey: {
          include: {
            steps: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        group: true,
        stepInstances: {
          where: { userId },
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

  // --------------------------------------------------
  // GROUP JOURNEY STATUS
  // --------------------------------------------------

  async updateGroupStatus(
    groupId: string,
    journeyId: string,
    dto: UpdateJourneyStatusDto,
  ) {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_groupId: {
          journeyId,
          groupId,
        },
      },
      include: {
        journey: {
          include: {
            steps: true,
          },
        },
        group: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Group journey enrollment not found');
    }

    if (!instance.group) {
      throw new BadRequestException(
        'This journey enrollment is not associated with a group',
      );
    }

    if (dto.status === JourneyStatus.COMPLETED) {
      const memberIds = instance.group.members.map((member) => member.userId);

      if (memberIds.length === 0) {
        throw new BadRequestException(
          'A group must have members before completing a journey',
        );
      }

      const expectedProgressCount =
        memberIds.length * instance.journey.steps.length;

      const completedProgressCount =
        await this.prisma.journeyStepInstance.count({
          where: {
            journeyInstanceId: instance.id,
            userId: { in: memberIds },
            completed: true,
          },
        });

      if (completedProgressCount !== expectedProgressCount) {
        throw new BadRequestException(
          'All current group members must complete every journey step before the group journey can be completed',
        );
      }
    }

    return this.prisma.journeyInstance.update({
      where: { id: instance.id },
      data: {
        status: dto.status,
        completedAt: dto.status === JourneyStatus.COMPLETED ? new Date() : null,
      },
    });
  }

  // --------------------------------------------------
  // GROUP JOURNEY REMOVAL
  // --------------------------------------------------

  async removeGroupEnrollment(
    userId: string,
    groupId: string,
    journeyId: string,
  ) {
    const instance = await this.prisma.journeyInstance.findUnique({
      where: {
        journeyId_groupId: {
          journeyId,
          groupId,
        },
      },
    });

    if (!instance) {
      throw new NotFoundException('Group journey enrollment not found');
    }

    // Verify the requesting user is a current group member
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You must be a group member to remove this journey enrollment',
      );
    }

    await this.prisma.journeyInstance.delete({
      where: { id: instance.id },
    });

    return { success: true };
  }
}
