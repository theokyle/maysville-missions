import { Module } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { JourneyTasksController } from './journey-tasks/journey-tasks.controller';
import { JourneyTasksService } from './journey-tasks/journey-tasks.service';

@Module({
  controllers: [JourneysController, JourneyTasksController],
  providers: [JourneysService, JourneyTasksService],
})
export class JourneysModule {}
