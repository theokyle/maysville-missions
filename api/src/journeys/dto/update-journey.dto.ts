import { PartialType } from '@nestjs/mapped-types';
import { CreateJourneyDto, CreateJourneyTaskDto } from './create-journey.dto';

export class UpdateJourneyDto extends PartialType(CreateJourneyDto) {}
export class UpdateJourneyTaskDto extends PartialType(CreateJourneyTaskDto) {}
