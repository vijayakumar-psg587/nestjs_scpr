import { Expose, Type } from 'class-transformer';
import { ScrapeOptionModel } from './scrape-options.model';

export class InputReqModel {
	@Expose()
	url: string;
	@Expose()
	@Type(() => ScrapeOptionModel)
	options?: ScrapeOptionModel;
}
