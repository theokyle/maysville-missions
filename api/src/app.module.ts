import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { JourneysModule } from './journeys/journeys.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, JourneysModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
