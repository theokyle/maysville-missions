import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JourneyStepsService } from './journey-steps.service';
import { CreateJourneyStepDto } from '../dto/create-journey.dto';
import { UpdateJourneyDto } from '../dto/update-journey.dto';

@Controller('journeys/:journeyId/Steps')
export class JourneyStepsController {
  constructor(private readonly journeyStepsService: JourneyStepsService) {}

  @Post()
  create(
    @Body() createJourneyStepDto: CreateJourneyStepDto,
    @Param() journeyId: string,
  ) {
    return this.journeyStepsService.create(createJourneyStepDto, journeyId);
  }

  @Get()
  findAll(@Param('journeyId') journeyId: string) {
    return this.journeyStepsService.findAll(journeyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journeyStepsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJourneyDto: UpdateJourneyDto) {
    return this.journeyStepsService.update(id, updateJourneyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journeyStepsService.remove(id);
  }
}
