import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async updateCount(
    userId: string,
    taskProgressId: string,
    updateProgressDto: UpdateProgressDto,
  ) {
    const { count } = updateProgressDto;

    return this.prisma.$transaction(async (tx) => {
      // Find the Progress Item
      const progress = await tx.userTaskProgress.findFirst({
        where: {
          id: taskProgressId,
          userJourney: {
            userId,
          },
        },
        include: {
          journeyTask: true,
          userJourney: true,
        },
      });

      // Check if progress item exists
      if (!progress) {
        throw new NotFoundException('Progress not found');
      }

      // Ensure count is between 0 and the maximum count of tasks for the progress item
      if (count < 0 || count > progress.journeyTask.targetCount) {
        throw new BadRequestException(
          `Count must be between 0 and ${progress.journeyTask.targetCount}`,
        );
      }

      const updatedProgress = await tx.userTaskProgress.update({
        where: {
          id: taskProgressId,
        },
        data: {
          currentCount: count,
          completed: count === progress.journeyTask.targetCount,
          completedAt:
            count === progress.journeyTask.targetCount ? new Date() : null,
        },
      });

      // If the task is completed, check if there are remaining tasks in the journey and, if not, mark the journey as completed
      if (updatedProgress.completed) {
        const remainingTasks = await tx.userTaskProgress.count({
          where: {
            userJourneyId: progress.userJourneyId,
            completed: false,
          },
        });

        if (remainingTasks === 0) {
          await tx.userJourney.update({
            where: {
              id: progress.userJourneyId,
            },
            data: {
              completedAt: new Date(),
              status: 'COMPLETED',
            },
          });
        }
      }

      return updatedProgress;
    });
  }

  getAllTasks(userId: string) {
    return this.prisma.userTaskProgress.findMany({
      where: {
        userJourney: {
          userId,
        },
      },
    });
  }
}
