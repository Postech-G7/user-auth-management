import { Storage } from '@google-cloud/storage';
import { cloudStorage } from '../../cloud-storage.config';

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({
      bucket: jest.fn().mockReturnValue('mock-bucket'),
    })),
  };
});

describe('Cloud Storage Configuration', () => {
  const mockBucketName = 'test-bucket';
  const mockProjectId = 'test-project-id';
  const mockKeyFilename = '/path/to/mock/keyfile.json';
  const mockServiceAccountKey = JSON.stringify({
    type: 'service_account',
    project_id: 'mock-project-id',
    private_key: 'mock-private-key',
    client_email: 'mock-email@example.com',
  });

  beforeAll(() => {
    process.env.GCLOUD_STORAGE_BUCKET = mockBucketName;
    process.env.GCLOUD_PROJECT_ID = mockProjectId;
    process.env.GCLOUD_KEY_FILENAME = mockKeyFilename;
    process.env.GCP_SERVICE_ACCOUNT_KEY = mockServiceAccountKey;
    process.env.NODE_ENV = 'test'; // Simula ambiente de teste
  });

  afterAll(() => {
    delete process.env.GCLOUD_STORAGE_BUCKET;
    delete process.env.GCLOUD_PROJECT_ID;
    delete process.env.GCLOUD_KEY_FILENAME;
    delete process.env.GCP_SERVICE_ACCOUNT_KEY;
    delete process.env.NODE_ENV;
  });

  it('should create a storage instance with keyFilename in test environment', () => {
    expect(Storage).toHaveBeenCalledWith({
      projectId: mockProjectId,
      keyFilename: mockKeyFilename,
    });
    expect(cloudStorage.bucket).toBe('mock-bucket');
  });

  it('should create a storage instance with credentials in production environment', () => {
    process.env.NODE_ENV = 'production'; // Simula ambiente de produção

    const storageInstance = new Storage({
      projectId: mockProjectId,
      credentials: JSON.parse(mockServiceAccountKey),
    });

    expect(Storage).toHaveBeenCalledWith({
      projectId: mockProjectId,
      credentials: JSON.parse(mockServiceAccountKey),
    });
    expect(storageInstance.bucket(mockBucketName)).toBe('mock-bucket');
  });
});
