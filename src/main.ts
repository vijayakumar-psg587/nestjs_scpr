import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { CommonModule } from './modules/common/common.module';
import { HeaderInterceptor } from './modules/common/interceptors/header.interceptor';
import { AppConfigService } from './modules/common/services/app-config/app-config.service';
import { ServerAdapterService } from './server-adapter.service';
import * as path from 'path';

import { CustomExceptionFilter } from './modules/common/filters/custom-exception.filter';
(async function bootstrap() {
	try {
		if (process.env.NODE_ENV === 'dev' && process.env.ISDEBUG_ENABLED) {
			console.log('into config');
			require('dotenv').config({ path: path.join(process.cwd(), './config/development/.env') });
		}
		const appConfig = AppConfigService.getAppConfig();

		const app = await NestFactory.create<NestFastifyApplication>(AppModule, ServerAdapterService.getAdapter());
		const corsInterceptorInstance = app.select(CommonModule).get(HeaderInterceptor, { strict: false });

		const headerInterceptorInstance = app.select(CommonModule).get(HeaderInterceptor, { strict: false });
		const exceptionFilter = app.select(CommonModule).get(CustomExceptionFilter, { strict: false });

		
		// await ServerAdapterService.configureSecurity(app);
		await ServerAdapterService.configureDbConnection(app);
		// TODO: Prefix ain't working. Need to find better alternative for graphql
		// app.setGlobalPrefix(appConfig.contextPath + appConfig.appVersion);
		app.setGlobalPrefix(appConfig.contextPath + appConfig.appVersion);
		app.useGlobalInterceptors(corsInterceptorInstance, headerInterceptorInstance);
		app.useGlobalPipes();
		app.useGlobalFilters(exceptionFilter);
		await app.listen(appConfig.port, appConfig.host).then(() => {
			console.log('App started in port:' + appConfig.port);
		});
	} catch (err) {
		process.stderr.write(`Error creating app:${err}`);
		process.exit(1);
	}
})();

process.on('unhandledRejection', (err) => {
	process.stderr.write(`Error  - unhandled rejection in app:${err}`);
	process.exit(1);
});
