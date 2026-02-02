import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TonClient, Address } from 'ton';
import { TonConfig } from '@configuration/validation/configuration.validators';

@Injectable()
export class TonService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly client: TonClient;

  constructor(private readonly tonConfig: TonConfig) {
    this.client = new TonClient({
      endpoint: tonConfig.endpoint,
      apiKey: tonConfig.apiKey,
      timeout: tonConfig.timeoutMs ?? 5000,
    });
  }

  async getBalance(address: string): Promise<bigint> {
    const parsed = this.parseAddress(address);

    try {
      return await this.client.getBalance(parsed);
    } catch (error) {
      this.logger.error('Failed to get TON balance', {
        address,
        error,
      });
      throw new ServiceUnavailableException('TON provider error');
    }
  }

  buildTransferLink(amountTon: string, comment?: string): string {
    const address = this.tonConfig.paymentAddress;
    if (!address) {
      throw new BadRequestException('TON_PAYMENT_ADDRESS is not configured.');
    }

    const amountNano = this.parseTonAmountToNano(amountTon);
    const params = new URLSearchParams({ amount: amountNano.toString() });
    if (comment) {
      params.set('text', comment);
    }

    return `ton://transfer/${address}?${params.toString()}`;
  }

  private parseAddress(address: string): Address {
    try {
      return Address.parse(address);
    } catch (error) {
      this.logger.warn('Invalid TON address provided', { address, error });
      throw new BadRequestException('Invalid TON address');
    }
  }

  private parseTonAmountToNano(amount: string): bigint {
    const trimmed = amount.trim();
    if (!/^\d+(\.\d+)?$/.test(trimmed)) {
      throw new BadRequestException('Invalid amount format.');
    }

    const [whole, fraction = ''] = trimmed.split('.');
    if (fraction.length > 9) {
      throw new BadRequestException('Too many decimal places (max 9).');
    }

    const paddedFraction = fraction.padEnd(9, '0');
    return BigInt(whole) * 1_000_000_000n + BigInt(paddedFraction);
  }
}
