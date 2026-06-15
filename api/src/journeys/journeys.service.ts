import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateJourneyDto } from './dto/update-journey.dto';

@Injectable()
export class JourneysService {
  constructor(private prisma: PrismaService) {}

  create(createJourneyDto: CreateJourneyDto) {
    const { title, description, icon, tasks } = createJourneyDto;
    return this.prisma.journey.create({
      data: {
        title,
        description,
        icon,
        tasks: {
          create: tasks ?? [],
        },
      },
      include: {
        tasks: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.journey.findMany({
      include: {
        tasks: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const journey = await this.prisma.journey.findUnique({
      where: {
        id,
      },
      include: {
        tasks: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!journey) {
      throw new NotFoundException('Journey not found');
    }

    return journey;
  }

  async update(id: string, updateJourneyDto: UpdateJourneyDto) {
    const { title, description, icon } = updateJourneyDto;
    try {
      return await this.prisma.journey.update({
        where: { id },
        data: {
          title,
          description,
          icon,
        },
      });
    } catch {
      throw new NotFoundException('Journey not found');
    }
  }

  remove(id: string) {
    return this.prisma.journey.delete({
      where: {
        id,
      },
    });
  }
}
