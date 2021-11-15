import { Test, TestingModule } from '@nestjs/testing';
import { ScrapperUtlService } from './scrapper-utl.service';

describe('ScrapperUtlService', () => {
	let service: ScrapperUtlService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ScrapperUtlService],
		}).compile();

		service = module.get<ScrapperUtlService>(ScrapperUtlService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
