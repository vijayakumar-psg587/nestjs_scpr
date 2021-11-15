import { Test, TestingModule } from '@nestjs/testing';
import { GiController } from './gi.controller';

describe('GiController', () => {
	let controller: GiController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GiController],
		}).compile();

		controller = module.get<GiController>(GiController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
