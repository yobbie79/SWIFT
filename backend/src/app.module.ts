import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'
import { DeliveriesModule } from './deliveries/deliveries.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [DeliveriesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}