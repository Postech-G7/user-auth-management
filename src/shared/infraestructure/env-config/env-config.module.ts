//command: nest generate module shared/infraestructure/env-config
import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigService } from './env-config.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
  static async forRoot(
    options: ConfigModuleOptions = {}
  ): Promise<DynamicModule> {
    return super.forRoot({
      ...options,
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ], //C:\dev\nestjs\project\.env.example => dirname C:\dev\nestjs\ file name .env.example
    });
  }
}
