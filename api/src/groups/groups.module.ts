import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [AuthModule, EnrollmentsModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
