import { Readable } from 'stream';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../shared/application/errors';
import { GoogleCloudStorageService } from '../services/google-cloud-storage.service.ts';
import { cloudStorage } from '../config/cloud-storage.config';
import * as fs from 'fs';

jest.mock('../config/cloud-storage.config', () => ({
  cloudStorage: {
    bucket: {
      file: jest.fn(),
    },
    storage: {
      bucket: jest.fn(),
    },
  },
}));

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  createReadStream: jest.fn(),
}));

describe('GoogleCloudStorageService', () => {
  let service: GoogleCloudStorageService;
  const mockFile = {
    originalname: 'test-file.txt',
    buffer: Buffer.from('file content'),
    mimetype: 'text/plain',
  };
  const mockBucketName = 'test-bucket';
  const mockFileName = 'test-file.txt';
  const mockFilePath = './downloads/test-file.zip';

  beforeEach(() => {
    process.env.GCLOUD_STORAGE_BUCKET = mockBucketName;
    service = new GoogleCloudStorageService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a file successfully', async () => {
      const mockFileUpload = {
        save: jest.fn().mockResolvedValue(undefined),
        publicUrl: jest
          .fn()
          .mockReturnValue('http://example.com/test-file.txt'),
      };
      (cloudStorage.bucket.file as jest.Mock).mockReturnValue(mockFileUpload);

      const result = await service.upload(mockFile, 'uploads/');

      expect(cloudStorage.bucket.file).toHaveBeenCalledWith(
        'uploads/test-file.txt'
      );
      expect(mockFileUpload.save).toHaveBeenCalledWith(mockFile.buffer, {
        metadata: { contentType: mockFile.mimetype },
        resumable: false,
      });
      expect(result).toBe('http://example.com/test-file.txt');
    });

    it('should throw BadRequestError if no file is provided', async () => {
      await expect(service.upload(null, 'uploads/')).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('download', () => {
    it('should download a file successfully', async () => {
      const mockFileStream = new Readable();
      (fs.createReadStream as jest.Mock).mockReturnValue(mockFileStream);

      const mockFile = {
        download: jest.fn().mockResolvedValue(undefined),
      };
      (cloudStorage.storage.bucket as jest.Mock).mockReturnValue({
        file: jest.fn().mockReturnValue(mockFile),
      });

      const result = await service.download('test-file');

      expect(fs.mkdirSync).toHaveBeenCalledWith('downloads', {
        recursive: true,
      });
      expect(cloudStorage.storage.bucket).toHaveBeenCalledWith(mockBucketName);
      expect(mockFile.download).toHaveBeenCalledWith({
        destination: mockFilePath,
      });
      expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath);
      expect(result).toBe(mockFileStream);
    });

    it('should throw NotFoundError if the file stream encounters an error', async () => {
      const mockFileStream = new Readable();
      mockFileStream._read = () => { };
      mockFileStream.emit('error', new Error('File not found'));
      (fs.createReadStream as jest.Mock).mockReturnValue(mockFileStream);

      const mockFile = {
        download: jest.fn().mockResolvedValue(undefined),
      };
      (cloudStorage.storage.bucket as jest.Mock).mockReturnValue({
        file: jest.fn().mockReturnValue(mockFile),
      });

      await expect(service.download('test-file')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('delete', () => {
    it('should delete a file successfully', async () => {
      const mockFile = {
        delete: jest.fn().mockResolvedValue(undefined),
      };
      (cloudStorage.bucket.file as jest.Mock).mockReturnValue(mockFile);

      await service.delete(mockFileName);

      expect(cloudStorage.bucket.file).toHaveBeenCalledWith(mockFileName);
      expect(mockFile.delete).toHaveBeenCalled();
    });
  });

  describe('listFiles', () => {
    it('should list files with a prefix', async () => {
      const mockFiles = [
        { name: 'uploads/file1.txt' },
        { name: 'uploads/file2.txt' },
      ];
      (cloudStorage.bucket.getFiles as jest.Mock).mockResolvedValue([
        mockFiles,
      ]);

      const result = await service.listFiles('uploads/');

      expect(cloudStorage.bucket.getFiles).toHaveBeenCalledWith({
        prefix: 'uploads/',
      });
      expect(result).toEqual(['uploads/file1.txt', 'uploads/file2.txt']);
    });

    it('should list all files when no prefix is provided', async () => {
      const mockFiles = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
      (cloudStorage.bucket.getFiles as jest.Mock).mockResolvedValue([
        mockFiles,
      ]);

      const result = await service.listFiles();

      expect(cloudStorage.bucket.getFiles).toHaveBeenCalledWith({});
      expect(result).toEqual(['file1.txt', 'file2.txt']);
    });
  });
});
