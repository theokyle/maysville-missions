import { Test, TestingModule } from '@nestjs/testing';
import { JourneyTasksController } from './journey-steps.controller';

describe('JourneyTasksController', () => {
  let controller: JourneyTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JourneyTasksController],
    }).compile();

    controller = module.get<JourneyTasksController>(JourneyTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
