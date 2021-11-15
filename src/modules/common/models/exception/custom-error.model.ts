import { Expose } from 'class-transformer';
import { AppUtilService } from '../../services/app-util/app-util.service';

export class CustomErrorModel {
	constructor(code?, title?, message?, status?) {
		this.code = code;
		this.title = title;
		this.message = message;
		this.status = status;
		this.timestamp = AppUtilService.getAppLevelDefaultUTCTime();
	}
	@Expose()
	code: string;
	@Expose()
	title: string;
	@Expose()
	message: string | Record<string, unknown>;
	@Expose()
	status: number;
	@Expose()
	timestamp: string;
}
