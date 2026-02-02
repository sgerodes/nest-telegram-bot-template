import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import TonConnect, {
  ConnectAdditionalRequest,
  IStorage,
  isWalletInfoRemote,
  TonConnectError,
  Wallet,
  WalletInfoRemote,
} from '@tonconnect/sdk';
import { randomUUID } from 'node:crypto';
import { TonConfig } from '@configuration/validation/configuration.validators';

type TonConnectSession = {
  connector: TonConnect;
  wallet: Wallet | null;
};

class InMemoryStorage implements IStorage {
  private readonly map = new Map<string, string>();

  async setItem(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.map.get(key) ?? null;
  }

  async removeItem(key: string): Promise<void> {
    this.map.delete(key);
  }
}

@Injectable()
export class TonWalletConnectService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly sessions = new Map<string, TonConnectSession>();

  constructor(private readonly tonConfig: TonConfig) {}

  async createSession(options?: {
    walletAppName?: string;
    request?: ConnectAdditionalRequest;
  }): Promise<{ sessionId: string; connectUrl: string; wallet: WalletInfoRemote }> {
    const manifestUrl = this.tonConfig.connectManifestUrl;
    if (!manifestUrl) {
      throw new BadRequestException('TON_CONNECT_MANIFEST_URL is not configured.');
    }

    const connector = new TonConnect({
      manifestUrl,
      storage: new InMemoryStorage(),
    });

    const wallet = await this.pickWallet(connector, options?.walletAppName);
    const connectUrl = connector.connect(
      { bridgeUrl: wallet.bridgeUrl, universalLink: wallet.universalLink },
      options?.request,
    );

    const sessionId = randomUUID();
    this.sessions.set(sessionId, { connector, wallet: connector.wallet });

    connector.onStatusChange(
      (connectedWallet) => {
        this.sessions.set(sessionId, { connector, wallet: connectedWallet });
      },
      (error: TonConnectError) => {
        this.logger.warn('TonConnect status error', { sessionId, error });
      },
    );

    return { sessionId, connectUrl, wallet };
  }

  getSessionWallet(sessionId: string): Wallet | null {
    return this.sessions.get(sessionId)?.wallet ?? null;
  }

  async disconnect(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    await session.connector.disconnect();
    this.sessions.delete(sessionId);
  }

  private async pickWallet(
    connector: TonConnect,
    walletAppName?: string,
  ): Promise<WalletInfoRemote> {
    const wallets = await connector.getWallets();
    const remoteWallets = wallets.filter(isWalletInfoRemote);

    if (remoteWallets.length === 0) {
      throw new BadRequestException('No remote TON wallets available.');
    }

    if (!walletAppName) {
      return remoteWallets[0];
    }

    const found = remoteWallets.find((wallet) => wallet.appName === walletAppName);
    if (!found) {
      throw new BadRequestException(`Wallet '${walletAppName}' not found.`);
    }

    return found;
  }
}
