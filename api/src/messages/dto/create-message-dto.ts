import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  content!: string;

  @IsOptional()
  @IsUUID()
  journeyStepId?: string;
}
