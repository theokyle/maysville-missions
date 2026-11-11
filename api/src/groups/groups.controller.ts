import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GroupsService } from './groups.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // Get all groups
  @Get()
  getGroups(@GetUser('id') userId: string) {
    return this.groupsService.getGroups(userId);
  }

  // Get a single group
  @Get(':groupId')
  getGroup(@Param('groupId') groupId: string) {
    return this.groupsService.getGroup(groupId);
  }

  // Create a group
  @Post()
  createGroup(@Body() dto: CreateGroupDto, @GetUser('id') userId: string) {
    return this.groupsService.createGroup(userId, dto);
  }

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
