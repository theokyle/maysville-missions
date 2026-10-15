import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJourneyStepDto } from '../dto/create-journey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateJourneyStepDto } from '../dto/update-journey.dto';

@Injectable()
export class JourneyStepsService {
  constructor(private prisma: PrismaService) {}

  create(createJourneyStepDto: CreateJourneyStepDto, journeyId: string) {
    const { title, description, targetCount, sortOrder } = createJourneyStepDto;

    return this.prisma.journeyStep.create({
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
    return this.prisma.journeyStep.findMany({
      where: {
        journeyId,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const step = await this.prisma.journeyStep.findUnique({
      where: {
        id,
      },
    });

    if (!step) {
      throw new NotFoundException('Journey step not found');
    }

    return step;
  }

  async update(id: string, updateJourneyStepDto: UpdateJourneyStepDto) {
    await this.findOne(id);

    return this.prisma.journeyStep.update({
      where: { id },
      data: updateJourneyStepDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.journeyStep.delete({
      where: {
        id,
      },
    });
  }
}
