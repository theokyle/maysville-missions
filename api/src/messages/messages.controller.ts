import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { MessagesService } from './messages.service';

import { CreateMessageDto } from './dto/create-message-dto';
import { CreateReplyDto } from './dto/create-reply-dto';
import { UpdateMessageDto } from './dto/update-message-dto';

import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@Controller('journey-messages')
@UseGuards(AuthGuard())
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Get all messages for a group journey,
  // optionally filtered by journey step.
  @Get(':journeyInstanceId')
  getMessages(
    @Req() req: AuthenticatedRequest,
    @Param('journeyInstanceId') journeyInstanceId: string,
    @Query('journeyStepId') journeyStepId?: string,
  ) {
    return this.messagesService.getMessages(
      req.user.id,
      journeyInstanceId,
      journeyStepId,
    );
  }

  // Create a new top-level message.
  @Post(':journeyInstanceId')
  createMessage(
    @Req() req: AuthenticatedRequest,
    @Param('journeyInstanceId') journeyInstanceId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(
      req.user.id,
      journeyInstanceId,
      dto,
    );
  }

  // Reply to an existing message.
  @Post(':messageId/replies')
  replyToMessage(
    @Req() req: AuthenticatedRequest,
    @Param('messageId') messageId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.messagesService.replyToMessage(
      req.user.id,
      messageId,
      dto.content,
    );
  }

  // Edit one of the user's own messages.
  @Patch(':messageId')
  updateMessage(
    @Req() req: AuthenticatedRequest,
    @Param('messageId') messageId: string,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messagesService.updateMessage(req.user.id, messageId, dto);
  }

  // Delete one of the user's own messages.
  @Delete(':messageId')
  deleteMessage(
    @Req() req: AuthenticatedRequest,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.deleteMessage(req.user.id, messageId);
  }
}
