import { IsEnum } from 'class-validator';
import { JourneyStatus } from 'src/generated/prisma/enums';

export class EnrollmentStatusDto {
  @IsEnum(JourneyStatus)
  status!: JourneyStatus;
}

export class UpdateJourneyStatusDto {
  @IsEnum(JourneyStatus)
  status!: JourneyStatus;
}
