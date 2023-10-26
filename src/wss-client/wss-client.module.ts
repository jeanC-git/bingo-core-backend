import { Module } from '@nestjs/common';
import { WssClientGateway } from './wss-client.gateway';

@Module({
  providers: [WssClientGateway],
  exports: [
    WssClientGateway
  ]
})
export class WssClientModule { }
