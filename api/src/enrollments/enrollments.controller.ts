import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EnrollmentsService } from './enrollments.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { EnrollmentStatusDto } from './dto/enrollment-status.dto';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // Individual journey enrollment
  @Post('journeys/:journeyId/enroll')
  enroll(@Param('journeyId') journeyId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.enroll(userId, journeyId);
  }

  // Retrieve individual journeys
  @Get('me/journeys')
  findAll(@GetUser('id') userId: string) {
    return this.enrollmentsService.findUserJourneys(userId);
  }

  // Retrieve one individual journey
  @Get('me/journeys/:journeyId')
  findOne(
    @Param('journeyId') journeyId: string,
    @GetUser('id') userId: string,
  ) {
    return this.enrollmentsService.findUserJourney(userId, journeyId);
  }

  // Update individual journey status
  @Patch('me/journeys/:journeyId')
  update(
    @Param('journeyId') journeyId: string,
    @GetUser('id') userId: string,
    @Body() dto: EnrollmentStatusDto,
  ) {
    return this.enrollmentsService.updateStatus(userId, journeyId, dto);
  }

  // Remove individual enrollment
  @Delete('me/journeys/:journeyId')
  remove(@Param('journeyId') journeyId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.remove(userId, journeyId);
  }

  // Enroll a group in a journey
  @Post('groups/:groupId/journeys/:journeyId/enroll')
  enrollGroup(
    @Param('groupId') groupId: string,
    @Param('journeyId') journeyId: string,
    @GetUser('id') userId: string,
  ) {
    return this.enrollmentsService.enrollGroup(userId, groupId, journeyId);
  }

  // Retrieve group journeys for current user
  @Get('me/group-journeys')
  findGroupJourneys(@GetUser('id') userId: string) {
    return this.enrollmentsService.findUserGroupJourneys(userId);
  }

  // Remove a group's journey enrollment
  @Delete('groups/:groupId/journeys/:journeyId')
  removeGroupEnrollment(
    @Param('groupId') groupId: string,
    @Param('journeyId') journeyId: string,
    @GetUser('id') userId: string,
  ) {
    return this.enrollmentsService.removeGroupEnrollment(
      userId,
      groupId,
      journeyId,
    );
  }
}
