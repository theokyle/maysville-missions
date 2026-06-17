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
import { EnrollmentsService } from './enrollments.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { EnrollmentStatusDto } from './dto/enrollment-status.dto';

@Controller()
@UseGuards(AuthGuard())
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('journeys/:journeyId/enroll')
  enroll(@Param('journeyId') journeyId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.enroll(userId, journeyId);
  }

  @Get('me/journeys')
  findAll(@GetUser('id') userId: string) {
    return this.enrollmentsService.findUserJourneys(userId);
  }

  @Get('me/:journeyId')
  findOne(
    @Param('journeyId') journeyId: string,
    @GetUser('id') userId: string,
  ) {
    return this.enrollmentsService.findUserJourney(userId, journeyId);
  }

  @Patch('me/:journeyId')
  update(
    @Param('journeyId') journeyId: string,
    @GetUser('id') userId: string,
    @Body() enrollmentStatusDto: EnrollmentStatusDto,
  ) {
    return this.enrollmentsService.updateStatus(
      userId,
      journeyId,
      enrollmentStatusDto,
    );
  }

  @Delete('me/:journeyId')
  remove(@Param('journeyId') journeyId: string, @GetUser('id') userId: string) {
    return this.enrollmentsService.remove(userId, journeyId);
  }
}
