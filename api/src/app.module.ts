import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { JourneysModule } from './journeys/journeys.module';
import { AuthModule } from './auth/auth.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProgressModule } from './progress/progress.module';
import { GroupsModule } from './groups/groups.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    PrismaModule,
    JourneysModule,
    AuthModule,
    EnrollmentsModule,
    ProgressModule,
    GroupsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
