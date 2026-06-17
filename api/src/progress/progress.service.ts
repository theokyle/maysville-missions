import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  getAllTasks(userId: string) {
    return this.prisma.userTaskProgress.findMany({
      where: {
        userJourney: {
          userId,
        },
      },
    });
  }

  async addActivity(
    createActivityDto: CreateActivityDto,
    taskProgressId: string,
    userId: string,
  ) {
    const { name, note } = createActivityDto;

    return this.prisma.$transaction(async (tx) => {
      const taskProgress = await tx.userTaskProgress.findFirst({
        where: {
          id: taskProgressId,
          userJourney: {
            userId,
          },
        },
        include: {
          journeyTask: true,
        },
      });

      if (!taskProgress) {
        throw new NotFoundException('Task progress not found');
      }

      const nextCount = taskProgress.currentCount + 1;
      const isComplete = nextCount >= taskProgress.journeyTask.targetCount;

      const activity = await tx.activity.create({
        data: {
          name,
          note,
          taskProgressId,
        },
      });

      await tx.userTaskProgress.update({
        where: {
          id: taskProgressId,
        },
        data: {
          currentCount: nextCount,
          completed: isComplete,
          completedAt: isComplete ? new Date() : null,
        },
      });

      const remainingTasks = await tx.userTaskProgress.count({
        where: {
          userJourneyId: taskProgress.userJourneyId,
          completed: false,
        },
      });

      if (remainingTasks === 0) {
        await tx.userJourney.update({
          where: {
            id: taskProgress.userJourneyId,
          },
          data: {
            completed: true,
            completedAt: new Date(),
          },
        });
      }

      return activity;
    });
  }

  getAllActivities(userId: string, taskProgressId: string) {
    return this.prisma.userTaskProgress.findFirst({
      where: {
        id: taskProgressId,
        userJourney: {
          userId,
        },
      },
      include: {
        activity: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async updateActivity(
    activityId: string,
    updateActivityDto: UpdateActivityDto,
    userId: string,
  ) {
    const activity = await this.prisma.activity.findFirst({
      where: {
        id: activityId,
        taskProgress: {
          userJourney: {
            userId,
          },
        },
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

  async deleteActivity(activityId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const activity = await tx.activity.findFirst({
        where: {
          id: activityId,
          taskProgress: {
            userJourney: {
              userId,
            },
          },
        },
        include: {
          taskProgress: {
            include: {
              journeyTask: true,
            },
          },
        },
      });

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      await tx.activity.delete({
        where: {
          id: activityId,
        },
      });

      if (
        activity.taskProgress.completed &&
        activity.taskProgress.currentCount - 1 <
          activity.taskProgress.journeyTask.targetCount
      ) {
        await tx.userTaskProgress.update({
          where: {
            id: activity.taskProgressId,
          },
          data: {
            currentCount: {
              decrement: 1,
            },
            completed: false,
            completedAt: null,
          },
        });

        await tx.userJourney.update({
          where: {
            id: activity.taskProgress.userJourneyId,
          },
          data: {
            completed: false,
            completedAt: null,
          },
        });
      } else {
        await tx.userTaskProgress.update({
          where: {
            id: activity.taskProgressId,
          },
          data: {
            currentCount: {
              decrement: 1,
            },
          },
        });
      }
    });
  }
}
