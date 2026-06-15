import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJourneyTaskDto } from '../dto/create-journey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateJourneyTaskDto } from '../dto/update-journey.dto';

@Injectable()
export class JourneyTasksService {
  constructor(private prisma: PrismaService) {}

  create(createJourneyTaskDto: CreateJourneyTaskDto, journeyId: string) {
    const { title, description, targetCount, sortOrder } = createJourneyTaskDto;

    return this.prisma.journeyTask.create({
      data: {
        title,
        description,
        targetCount,
        sortOrder,
        journey: {
          connect: {
            id: journeyId,
          },
        },
      },
    });
  }

  findAll(journeyId: string) {
    return this.prisma.journeyTask.findMany({
      where: {
        journeyId,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.journeyTask.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Journey task not found');
    }

    return task;
  }

  async update(id: string, updateJourneyTaskDto: UpdateJourneyTaskDto) {
    const task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException('Journey task not found');
    }

    return await this.prisma.journeyTask.update({
      where: { id },
      data: updateJourneyTaskDto,
    });
  }

  remove(id: string) {
    return this.prisma.journeyTask.delete({
      where: {
        id,
      },
    });
  }
}
