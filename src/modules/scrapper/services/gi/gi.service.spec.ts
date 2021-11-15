import { Test, TestingModule } from '@nestjs/testing';
import { GiService } from './gi.service';

describe('GiService', () => {
	let service: GiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GiService],
		}).compile();

		service = module.get<GiService>(GiService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
