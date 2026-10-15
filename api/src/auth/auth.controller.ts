import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('/signin')
  signin(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.authService.signin(userCredentialsDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser('id') userId: string) {
    return this.authService.getMe(userId);
  }
}
