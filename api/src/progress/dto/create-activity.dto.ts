import { IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
