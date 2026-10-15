import { Controller, UseGuards } from '@nestjs/common';
import { Delete, Param, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
@UseGuards(AuthGuard())
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Post(':groupId/join')
  join(@Param('groupId') groupId: string, @GetUser('id') userId: string) {
    return this.groupService.joinGroup(userId, groupId);
  }

  @Delete(':groupId/leave')
  leave(@Param('groupId') groupId: string, @GetUser('id') userId: string) {
    return this.groupService.leaveGroup(userId, groupId);
  }

  @Post(':groupId/journeys/:journeyId/enroll')
  enrollJourney(
    @Param('groupId') groupId: string,
    @Param('journeyId') journeyId: string,
  ) {
    return this.groupService.enrollGroup(groupId, journeyId);
  }

  @Delete(':groupId/journeys/:journeyId')
  removeJourney(
    @Param('groupId') groupId: string,
    @Param('journeyId') journeyId: string,
  ) {
    return this.groupService.removeGroupEnrollment(groupId, journeyId);
  }
}
