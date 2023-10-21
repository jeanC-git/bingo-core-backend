import { Module } from '@nestjs/common';
import { WssClientService } from './wss-client.service';
import { WssClientGateway } from './wss-client.gateway';

@Module({
  providers: [WssClientGateway, WssClientService],
  exports: [
    WssClientService,
    WssClientGateway
  ]
})
export class WssClientModule { }
