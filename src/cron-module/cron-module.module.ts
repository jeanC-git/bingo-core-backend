import { Module } from '@nestjs/common';
import { CronModuleService } from './cron-module.service';
import { CronModuleController } from './cron-module.controller';

@Module({
  controllers: [CronModuleController],
  providers: [CronModuleService],
})
export class CronModuleModule {}
