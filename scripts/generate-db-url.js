import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  try {
    const [version] = await client.accessSecretVersion({
      name: secretName,
    });
    return version.payload.data.toString();
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error);
    throw error;
  }
}

async function main() {
  const secretName = process.env.DATABASE_URL;
  const databaseUrl = await getSecret(secretName);
  console.log(databaseUrl);
}

main().catch(console.error);
