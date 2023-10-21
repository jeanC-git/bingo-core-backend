import { Controller } from '@nestjs/common';
import { CronModuleService } from './cron-module.service';

@Controller('cron-module')
export class CronModuleController {
  constructor(private readonly cronModuleService: CronModuleService) {}
}
