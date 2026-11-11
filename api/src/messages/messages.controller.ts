import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MessagesService } from './messages.service';

import { CreateMessageDto } from './dto/create-message-dto';
import { CreateReplyDto } from './dto/create-reply-dto';
import { UpdateMessageDto } from './dto/update-message-dto';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('journey-messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Get all messages for a group journey,
  // optionally filtered by journey step.
  @Get(':journeyInstanceId')
  getMessages(
    @GetUser('id') userId: string,
    @Param('journeyInstanceId') journeyInstanceId: string,
    @Query('journeyStepId') journeyStepId?: string,
  ) {
    return this.messagesService.getMessages(
      userId,
      journeyInstanceId,
      journeyStepId,
    );
  }

  // Create a new top-level message.
  @Post(':journeyInstanceId')
  createMessage(
    @GetUser('id') userId: string,
    @Param('journeyInstanceId') journeyInstanceId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(userId, journeyInstanceId, dto);
  }

  // Reply to an existing message.
  @Post(':messageId/replies')
  replyToMessage(
    @GetUser('id') userId: string,
    @Param('messageId') messageId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.messagesService.replyToMessage(userId, messageId, dto.content);
  }

  // Edit one of the user's own messages.
  @Patch(':messageId')
  updateMessage(
    @GetUser('id') userId: string,
    @Param('messageId') messageId: string,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messagesService.updateMessage(userId, messageId, dto);
  }

  // Delete one of the user's own messages.
  @Delete(':messageId')
  deleteMessage(
    @GetUser('id') userId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.deleteMessage(userId, messageId);
  }
}
