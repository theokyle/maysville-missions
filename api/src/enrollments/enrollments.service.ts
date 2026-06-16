import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JourneyStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: string, journeyId: string) {
    const journey = await this.prisma.journey.findUnique({
      where: {
        id: journeyId,
      },
      include: {
        tasks: true,
      },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    const existing = await this.prisma.userJourney.findUnique({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Already enrolled in this journey');
    }

    return this.prisma.$transaction(async (tx) => {
      const userJourney = await tx.userJourney.create({
        data: {
          userId,
          journeyId,
        },
      });

      await tx.userTaskProgress.createMany({
        data: journey.tasks.map((task) => ({
          userJourneyId: userJourney.id,
          journeyTaskId: task.id,
          currentCount: 0,
          completed: false,
        })),
      });

      return userJourney;
    });
  }

  findUserJourneys(userId: string) {
    return this.prisma.userJourney.findMany({
      where: {
        userId,
      },
      include: {
        journey: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  findUserJourney(userId: string, journeyId: string) {
    return this.prisma.userJourney.findUnique({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
      include: {
        journey: {
          include: {
            tasks: true,
          },
        },
      },
    });
  }

  updateStatus(userId: string, journeyId: string, status: JourneyStatus) {
    return this.prisma.userJourney.update({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
      data: {
        status,
      },
    });
  }

  remove(userId: string, journeyId: string) {
    return this.prisma.userJourney.delete({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
    });
  }
}
