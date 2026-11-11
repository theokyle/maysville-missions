import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { JourneyStatus, Prisma } from 'src/generated/prisma/client';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the user's step instances for journeys they currently have access to.
   *
   * Group progress is individual and private to each member.
   */
  getAllSteps(userId: string) {
    return this.prisma.journeyStepInstance.findMany({
      where: {
        userId,
        journeyInstance: {
          OR: [
            { userId },
            {
              group: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
      include: {
        journeyStep: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
        journeyInstance: {
          include: {
            journey: true,
            group: true,
          },
        },
      },
      orderBy: {
        journeyStep: {
          sortOrder: 'asc',
        },
      },
    });
  }

  /**
   * Add an activity to the requesting user's own step instance.
   */
  async addActivity(
    createActivityDto: CreateActivityDto,
    stepInstanceId: string,
    userId: string,
  ) {
    const { name, note } = createActivityDto;

    return this.prisma.$transaction(async (tx) => {
      const stepInstance = await tx.journeyStepInstance.findUnique({
        where: {
          id: stepInstanceId,
        },
        include: {
          journeyStep: true,
          journeyInstance: true,
        },
      });

      if (!stepInstance || stepInstance.userId !== userId) {
        throw new NotFoundException('Step instance not found');
      }

      await this.assertJourneyAccess(tx, stepInstance.journeyInstance, userId);

      if (stepInstance.journeyInstance.status !== JourneyStatus.IN_PROGRESS) {
        throw new BadRequestException(
          'Activities can only be added to active journeys',
        );
      }

      const activity = await tx.activity.create({
        data: {
          name,
          note,
          userId,
          stepInstanceId,
        },
      });

      // Increment atomically so simultaneous activity submissions
      // do not overwrite one another's counts.
      const updatedStep = await tx.journeyStepInstance.update({
        where: {
          id: stepInstanceId,
        },
        data: {
          currentCount: {
            increment: 1,
          },
        },
      });

      const isComplete =
        updatedStep.currentCount >= stepInstance.journeyStep.targetCount;

      await tx.journeyStepInstance.update({
        where: {
          id: stepInstanceId,
        },
        data: {
          completed: isComplete,
          completedAt: isComplete
            ? (stepInstance.completedAt ?? new Date())
            : null,
        },
      });

      // Only individual journeys have an automatic completion status.
      if (stepInstance.journeyInstance.userId) {
        await this.recalculateIndividualJourneyStatus(
          tx,
          stepInstance.journeyInstanceId,
        );
      }

      return activity;
    });
  }

  /**
   * Get activities belonging to the requesting user's step instance.
   * Group members cannot view another member's private activities.
   */
  async getAllActivities(userId: string, stepInstanceId: string) {
    const stepInstance = await this.prisma.journeyStepInstance.findFirst({
      where: {
        id: stepInstanceId,
        userId,
        journeyInstance: {
          OR: [
            { userId },
            {
              group: {
                members: {
                  some: { userId },
                },
              },
            },
          ],
        },
      },
      include: {
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        journeyStep: true,
      },
    });

    if (!stepInstance) {
      throw new NotFoundException('Step instance not found');
    }

    return stepInstance;
  }

  /**
   * Update an activity created by the requesting user.
   */
  async updateActivity(
    activityId: string,
    updateActivityDto: UpdateActivityDto,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const activity = await tx.activity.findFirst({
        where: {
          id: activityId,
          userId,
        },
        include: {
          stepInstance: {
            include: {
              journeyInstance: true,
            },
          },
        },
      });

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      await this.assertJourneyAccess(
        tx,
        activity.stepInstance.journeyInstance,
        userId,
      );

      return tx.activity.update({
        where: {
          id: activityId,
        },
        data: updateActivityDto,
      });
    });
  }

  /**
   * Delete an activity and recalculate the associated step progress.
   */
  async deleteActivity(activityId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const activity = await tx.activity.findFirst({
        where: {
          id: activityId,
          userId,
        },
        include: {
          stepInstance: {
            include: {
              journeyStep: true,
              journeyInstance: true,
            },
          },
        },
      });

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      const stepInstance = activity.stepInstance;

      await this.assertJourneyAccess(tx, stepInstance.journeyInstance, userId);

      await tx.activity.delete({
        where: {
          id: activityId,
        },
      });

      // Use the remaining activity records as the source of truth.
      const remainingActivityCount = await tx.activity.count({
        where: {
          stepInstanceId: stepInstance.id,
        },
      });

      const isComplete =
        remainingActivityCount >= stepInstance.journeyStep.targetCount;

      await tx.journeyStepInstance.update({
        where: {
          id: stepInstance.id,
        },
        data: {
          currentCount: remainingActivityCount,
          completed: isComplete,
          completedAt: isComplete
            ? (stepInstance.completedAt ?? new Date())
            : null,
        },
      });

      // Group journeys have no shared completion status.
      if (stepInstance.journeyInstance.userId) {
        await this.recalculateIndividualJourneyStatus(
          tx,
          stepInstance.journeyInstanceId,
        );
      }

      return {
        success: true,
      };
    });
  }

  /**
   * Verify that the user still has access to the journey.
   *
   * Individual journeys belong to one user.
   * Group journeys are accessible only to current group members.
   */
  private async assertJourneyAccess(
    tx: Prisma.TransactionClient,
    instance: {
      id: string;
      userId: string | null;
      groupId: string | null;
    },
    userId: string,
  ) {
    if (instance.userId === userId && !instance.groupId) {
      return;
    }

    if (instance.groupId && !instance.userId) {
      const membership = await tx.groupMember.findUnique({
        where: {
          groupId_userId: {
            groupId: instance.groupId,
            userId,
          },
        },
      });

      if (membership) {
        return;
      }
    }

    throw new NotFoundException('Journey not found');
  }

  /**
   * Recalculate completion for an individual journey only.
   *
   * Group journeys deliberately do not receive a shared completion status.
   */
  private async recalculateIndividualJourneyStatus(
    tx: Prisma.TransactionClient,
    journeyInstanceId: string,
  ) {
    const instance = await tx.journeyInstance.findUnique({
      where: {
        id: journeyInstanceId,
      },
      include: {
        journey: {
          include: {
            steps: true,
          },
        },
        stepInstances: true,
      },
    });

    if (!instance) {
      throw new NotFoundException('Journey enrollment not found');
    }

    // This helper applies only to individual journeys.
    if (!instance.userId || instance.groupId) {
      return;
    }

    // Do not automatically reopen abandoned journeys.
    if (instance.status === JourneyStatus.ABANDONED) {
      return;
    }

    const expectedStepCount = instance.journey.steps.length;

    const allStepsComplete =
      expectedStepCount > 0 &&
      instance.stepInstances.length === expectedStepCount &&
      instance.stepInstances.every(
        (step) => step.userId === instance.userId && step.completed,
      );

    if (allStepsComplete && instance.status !== JourneyStatus.COMPLETED) {
      await tx.journeyInstance.update({
        where: {
          id: journeyInstanceId,
        },
        data: {
          status: JourneyStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    } else if (
      !allStepsComplete &&
      instance.status === JourneyStatus.COMPLETED
    ) {
      await tx.journeyInstance.update({
        where: {
          id: journeyInstanceId,
        },
        data: {
          status: JourneyStatus.IN_PROGRESS,
          completedAt: null,
        },
      });
    }
  }
}
