export interface EnvConfig {
  getAppPort(): number;
  getNodeEnv(): string;
  getJwtSecret(): Promise<string>;
  getJwtExpiresInSeconds(): number;
}
