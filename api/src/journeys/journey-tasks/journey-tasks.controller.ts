import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JourneyTasksService } from './journey-tasks.service';
import { CreateJourneyTaskDto } from '../dto/create-journey.dto';
import { UpdateJourneyDto } from '../dto/update-journey.dto';

@Controller('journeys/:journeyId/tasks')
export class JourneyTasksController {
  constructor(private readonly journeyTasksService: JourneyTasksService) {}

  @Post()
  create(
    @Body() createJourneyTaskDto: CreateJourneyTaskDto,
    @Param() journeyId: string,
  ) {
    return this.journeyTasksService.create(createJourneyTaskDto, journeyId);
  }

  @Get()
  findAll(@Param('journeyId') journeyId: string) {
    return this.journeyTasksService.findAll(journeyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journeyTasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJourneyDto: UpdateJourneyDto) {
    return this.journeyTasksService.update(id, updateJourneyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journeyTasksService.remove(id);
  }
}
