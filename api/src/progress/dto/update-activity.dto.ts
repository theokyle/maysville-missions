import { IsOptional, IsString } from 'class-validator';

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
