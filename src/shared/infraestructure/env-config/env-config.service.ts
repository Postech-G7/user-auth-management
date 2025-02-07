import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

@Injectable()
export class EnvConfigService implements EnvConfig {
  private secretManagerClient: SecretManagerServiceClient;

  constructor(private configService: ConfigService) {
    this.secretManagerClient = new SecretManagerServiceClient();
  }

  private async getSecret(secretName: string): Promise<string> {
    try {
      const [version] = await this.secretManagerClient.accessSecretVersion({
        name: secretName,
      });
      return version.payload.data.toString();
    } catch (error) {
      console.error(`Error fetching secret ${secretName}:`, error);
      throw error;
    }
  }

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
  async getJwtSecret(): Promise<string> {
    const secretName = this.configService.get<string>('JWT_SECRET_NAME');
    return this.getSecret(secretName);
  }
  getJwtExpiresInSeconds(): number {
    return Number(this.configService.get<number>('JWT_EXPIRES_IN'));
  }
  getDatabaseUrl(): Promise<string> {
    const secretName = this.configService.get<string>('DATABASE_URL');
    return this.getSecret(secretName);
  }
}
