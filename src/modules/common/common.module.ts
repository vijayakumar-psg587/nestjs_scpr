import { Module } from '@nestjs/common';
import { AppUtilService } from './services/app-util/app-util.service';
import { AppConfigService } from './services/app-config/app-config.service';
import { PinoLoggerService } from './services/pino-logger/pino-logger.service';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { CorsInterceptor } from './interceptors/cors.interceptor';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

@Module({
	providers: [AppUtilService, AppConfigService, PinoLoggerService, HeaderInterceptor, CorsInterceptor, CustomExceptionFilter],
	exports: [AppUtilService, AppConfigService, PinoLoggerService, HeaderInterceptor, CorsInterceptor, CustomExceptionFilter],
})
export class CommonModule {}
