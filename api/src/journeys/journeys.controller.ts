import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { UpdateJourneyDto } from './dto/update-journey.dto';

@Controller('journeys')
export class JourneysController {
  constructor(private readonly journeysService: JourneysService) {}

  @Post()
  create(@Body() createJourneyDto: CreateJourneyDto) {
    return this.journeysService.create(createJourneyDto);
  }

  @Get()
  findAll() {
    return this.journeysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journeysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJourneyDto: UpdateJourneyDto) {
    return this.journeysService.update(id, updateJourneyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journeysService.remove(id);
  }
}
