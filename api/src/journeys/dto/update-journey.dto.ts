import { PartialType } from '@nestjs/mapped-types';
import { CreateJourneyDto, CreateJourneyStepDto } from './create-journey.dto';

export class UpdateJourneyDto extends PartialType(CreateJourneyDto) {}
export class UpdateJourneyStepDto extends PartialType(CreateJourneyStepDto) {}
