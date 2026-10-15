import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { JourneyType } from 'src/generated/prisma/enums';

export class CreateJourneyDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsEnum(JourneyType)
  @IsOptional()
  type?: JourneyType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateJourneyStepDto)
  steps?: CreateJourneyStepDto[];
}

export class CreateJourneyStepDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  targetCount!: number;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}
