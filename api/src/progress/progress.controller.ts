import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Controller()
@UseGuards(AuthGuard())
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me/tasks')
  findAll(@GetUser('id') userId: string) {
    return this.progressService.getAllTasks(userId);
  }

  @Patch('me/tasks/:id')
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @GetUser('id') userId: string,
  ) {
    return this.progressService.updateCount(userId, id, updateProgressDto);
  }
}
