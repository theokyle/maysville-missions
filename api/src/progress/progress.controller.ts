import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('me/steps')
@UseGuards(AuthGuard())
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getAllSteps(@GetUser('id') userId: string) {
    return this.progressService.getAllSteps(userId);
  }

  @Post(':stepProgressId/activities')
  addActivity(
    @Body() createActivityDto: CreateActivityDto,
    @Param('stepProgressId') stepProgressId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.addActivity(
      createActivityDto,
      stepProgressId,
      userId,
    );
  }

  @Get(':stepProgressId/activities')
  findAll(
    @Param('stepProgressId') stepProgressId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.getAllActivities(userId, stepProgressId);
  }

  @Patch(':stepProgressId/activities/:activityId')
  update(
    @Param('activityId') activityId: string,
    @GetUser('id') userId: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.progressService.updateActivity(
      activityId,
      updateActivityDto,
      userId,
    );
  }

  @Delete(':stepProgressId/activities/:activityId')
  remove(
    @Param('activityId') activityId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.deleteActivity(activityId, userId);
  }
}
