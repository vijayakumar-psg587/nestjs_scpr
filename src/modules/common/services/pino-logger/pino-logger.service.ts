import { Injectable, LoggerService } from '@nestjs/common';
import * as os from 'os';
import pino from 'pino';
import { APP_CONST } from '../../utils/app.constant';
import { AppUtilService } from '../app-util/app-util.service';
@Injectable()
export class PinoLoggerService {
	static getLoggerConfig(level: string, redactKeys?: string[]): pino.BaseLogger {
		return pino({
			prettyPrint: (() => {
				return process.env.NODE_ENV && process.env.NODE_ENV === 'dev';
			})(),
			// tslint:disable-next-line: object-literal-sort-keys
			messageKey: APP_CONST.COMMON.APP_NAME + '-message',
			level: level,
			redact: {
				paths: (() => redactKeys ?? APP_CONST.COMMON.REDACT_DEFAULT)(),
				censor: '****',
			},
			base: {
				hostName: os.hostname(),
				platform: os.platform(),
				processId: process.pid,
				timestamp: AppUtilService.getAppLevelDefaultUTCTime(),
			},
		});
	}

	error(message: any, ...optionalParams: any[]): any {
		PinoLoggerService.getLoggerConfig(optionalParams['level'], optionalParams['appName']).error(message);
	}

	log(message: any, ...optionalParams: any[]): any {
		PinoLoggerService.getLoggerConfig(optionalParams['level'], optionalParams['appName']).info(message);
	}

	warn(message: any, ...optionalParams: any[]): any {
		PinoLoggerService.getLoggerConfig(optionalParams['level'], optionalParams['appName']).warn(message);
	}

	debug(message: any, ...optionalParams: any[]): any {
		PinoLoggerService.getLoggerConfig(optionalParams['level'], optionalParams['appName']).debug(message);
	}
}
