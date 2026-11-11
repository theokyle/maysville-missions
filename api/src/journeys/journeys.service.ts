import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateJourneyDto } from './dto/update-journey.dto';

@Injectable()
export class JourneysService {
  constructor(private prisma: PrismaService) {}

  create(createJourneyDto: CreateJourneyDto) {
    const { title, description, icon, type, videoUrl, steps } =
      createJourneyDto;

    return this.prisma.journey.create({
      data: {
        title,
        description,
        icon,
        type,
        videoUrl,
        steps: {
          create: steps ?? [],
        },
      },
      include: {
        steps: {
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
        steps: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const journey = await this.prisma.journey.findUnique({
      where: { id },
      include: {
        steps: {
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
    await this.findOne(id);

    const { title, description, icon, type, videoUrl } = updateJourneyDto;

    return this.prisma.journey.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        type,
        videoUrl,
      },
      include: {
        steps: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.journey.delete({
      where: { id },
    });
  }
}
