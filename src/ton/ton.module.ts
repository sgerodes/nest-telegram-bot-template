import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { TonWalletConnectService } from './ton-wallet-connect.service';

@Module({
  providers: [TonService, TonWalletConnectService],
  exports: [TonService, TonWalletConnectService],
})
export class TonModule {}
