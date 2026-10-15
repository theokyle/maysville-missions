import { Module } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { JourneyStepsController } from './journey-steps/journey-steps.controller';
import { JourneyStepsService } from './journey-steps/journey-steps.service';

@Module({
  controllers: [JourneysController, JourneyStepsController],
  providers: [JourneysService, JourneyStepsService],
})
export class JourneysModule {}
