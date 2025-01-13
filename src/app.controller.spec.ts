import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return index.html', () => {
      const mockResponse = {
        sendFile: jest.fn().mockReturnValue('index.html'),
      } as any;
      const result = appController.getHello(mockResponse);
      expect(mockResponse.sendFile).toHaveBeenCalledWith('index.html');
      expect(result).toBe('index.html');
    });

    it('should handle sendFile error', () => {
      const mockResponse = {
        sendFile: jest.fn().mockImplementation(() => {
          throw new Error('File not found');
        }),
      } as any;
      
      expect(() => appController.getHello(mockResponse)).toThrow('File not found');
    });
  });
});
