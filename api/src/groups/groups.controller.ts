import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GroupsService } from './groups.service';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Join a group
  @Post(':groupId/join')
  join(@Param('groupId') groupId: string, @GetUser('id') userId: string) {
    return this.groupsService.joinGroup(userId, groupId);
  }

  // Leave a group
  @Delete(':groupId/leave')
  leave(@Param('groupId') groupId: string, @GetUser('id') userId: string) {
    return this.groupsService.leaveGroup(userId, groupId);
  }
}
