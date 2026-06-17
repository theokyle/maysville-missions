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

@Controller('me/tasks')
@UseGuards(AuthGuard())
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getAllTasks(@GetUser('id') userId: string) {
    return this.progressService.getAllTasks(userId);
  }

  @Post(':taskProgressId/activities')
  addActivity(
    @Body() createActivityDto: CreateActivityDto,
    @Param('taskProgressId') taskProgressId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.addActivity(
      createActivityDto,
      taskProgressId,
      userId,
    );
  }

  @Get(':taskProgressId/activities')
  findAll(
    @Param('taskProgressId') taskProgressId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.getAllActivities(userId, taskProgressId);
  }

  @Patch(':taskProgressId/activities/:activityId')
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

  @Delete(':taskProgressId/activities/:activityId')
  remove(
    @Param('activityId') activityId: string,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.deleteActivity(activityId, userId);
  }
}
