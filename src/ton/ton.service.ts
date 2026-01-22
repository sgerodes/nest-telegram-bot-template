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

  private parseAddress(address: string): Address {
    try {
      return Address.parse(address);
    } catch (error) {
      this.logger.warn('Invalid TON address provided', { address, error });
      throw new BadRequestException('Invalid TON address');
    }
  }
}
