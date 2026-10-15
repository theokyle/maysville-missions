import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JourneyStatus } from 'src/generated/prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all step instances for journeys the user has access to.
   *
   * This includes:
   * - Individual journeys owned by the user
   * - Group journeys belonging to groups the user is a member of
   */
  getAllSteps(userId: string) {
    return this.prisma.journeyStepInstance.findMany({
      where: {
        journeyInstance: {
          OR: [
            {
              userId,
            },
            {
              group: {
                members: {
                  some: {
                    userId,
                  },
                },
              },
            },
          ],
        },
      },
      include: {
        journeyStep: true,
        journeyInstance: {
          include: {
            journey: true,
            group: true,
          },
        },
      },
    });
  }

  /**
   * Add an activity to a journey step.
   *
   * The step instance determines which journey/context
   * the activity counts toward.
   */
  async addActivity(
    createActivityDto: CreateActivityDto,
    stepInstanceId: string,
    userId: string,
  ) {
    const { name, note } = createActivityDto;

    return this.prisma.$transaction(async (tx) => {
      const stepInstance = await tx.journeyStepInstance.findFirst({
        where: {
          id: stepInstanceId,
          journeyInstance: {
            OR: [
              {
                userId,
              },
              {
                group: {
                  members: {
                    some: {
                      userId,
                    },
                  },
                },
              },
            ],
          },
        },
        include: {
          journeyStep: true,
          journeyInstance: true,
        },
      });

      if (!stepInstance) {
        throw new NotFoundException('Step instance not found');
      }

      const nextCount = stepInstance.currentCount + 1;

      const isComplete = nextCount >= stepInstance.journeyStep.targetCount;

      const activity = await tx.activity.create({
        data: {
          name,
          note,
          userId,
          stepInstanceId,
        },
      });

      await tx.journeyStepInstance.update({
        where: {
          id: stepInstanceId,
        },
        data: {
          currentCount: nextCount,
          completed: isComplete,
          completedAt: isComplete ? new Date() : null,
        },
      });

      // Check whether all steps in the journey are now complete.
      const remainingSteps = await tx.journeyStepInstance.count({
        where: {
          journeyInstanceId: stepInstance.journeyInstanceId,
          completed: false,
        },
      });

      if (remainingSteps === 0) {
        await tx.journeyInstance.update({
          where: {
            id: stepInstance.journeyInstanceId,
          },
          data: {
            status: JourneyStatus.COMPLETED,
            completedAt: new Date(),
          },
        });
      }

      return activity;
    });
  }

  /**
   * Get all activities for a particular step instance.
   */
  getAllActivities(userId: string, stepInstanceId: string) {
    return this.prisma.journeyStepInstance.findFirst({
      where: {
        id: stepInstanceId,
        journeyInstance: {
          OR: [
            {
              userId,
            },
            {
              group: {
                members: {
                  some: {
                    userId,
                  },
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
  }

  /**
   * Update an activity.
   *
   * A user can only update an activity that they created.
   */
  async updateActivity(
    activityId: string,
    updateActivityDto: UpdateActivityDto,
    userId: string,
  ) {
    const activity = await this.prisma.activity.findFirst({
      where: {
        id: activityId,
        userId,
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: updateActivityDto,
    });
  }

  /**
   * Delete an activity and recalculate the associated
   * step and journey completion status.
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

      await tx.activity.delete({
        where: {
          id: activityId,
        },
      });

      const nextCount = Math.max(0, stepInstance.currentCount - 1);

      const isComplete = nextCount >= stepInstance.journeyStep.targetCount;

      await tx.journeyStepInstance.update({
        where: {
          id: stepInstance.id,
        },
        data: {
          currentCount: nextCount,
          completed: isComplete,
          completedAt: isComplete ? stepInstance.completedAt : null,
        },
      });

      // Recalculate journey completion.
      const remainingSteps = await tx.journeyStepInstance.count({
        where: {
          journeyInstanceId: stepInstance.journeyInstanceId,
          completed: false,
        },
      });

      if (remainingSteps > 0) {
        await tx.journeyInstance.update({
          where: {
            id: stepInstance.journeyInstanceId,
          },
          data: {
            status: JourneyStatus.IN_PROGRESS,
            completedAt: null,
          },
        });
      }

      return {
        success: true,
      };
    });
  }
}
