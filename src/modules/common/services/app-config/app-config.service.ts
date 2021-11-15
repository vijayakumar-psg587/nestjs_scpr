import { Injectable, Scope } from '@nestjs/common';
import { AppConfigModel } from '../../models/app-config.model';
import { AppMongoConfigModel } from '../../models/app-mongo-config.model';
import { AppScrModel } from '../../models/app-scr.model';
import { APP_CONST } from '../../utils/app.constant';

@Injectable({
	scope: Scope.DEFAULT,
})
export class AppConfigService {
	static appConfigModel: AppConfigModel;
	static appScraperModel: AppScrModel;
	static appMongoConfigModel: AppMongoConfigModel;
	static getAppConfig(): AppConfigModel {
		if (!this.appConfigModel) {
			this.appConfigModel = new AppConfigModel();
			this.appConfigModel.contextPath = APP_CONST.COMMON.CONTEXT;
			this.appConfigModel.retries = +process.env.HTTP_RETRIES;

			this.appConfigModel.port = process.env.APP_PORT ? +process.env.APP_PORT : APP_CONST.COMMON.DEFAULT_APP_PORT;
			this.appConfigModel.host = process.env.APP_HOST ? process.env.APP_HOST : APP_CONST.COMMON.DEFAULT_APP_HOST;

			this.appConfigModel.appVersion = process.env.APP_VERSION;
			this.appConfigModel.timeout = process.env.HTTP_TIMEOUT ? +process.env.HTTP_TIMEOUT : 5000;
			this.appConfigModel.maxRedirects = +process.env.HTTP_MAX_REDIRECTS;
			this.appConfigModel.maxSockets = +process.env.HTTP_MAX_SOCKETS;
		}
		return this.appConfigModel;
	}

	static getAppScraperConfig(): AppScrModel {
		if (!this.appScraperModel) {
			this.appScraperModel = new AppScrModel();
			this.appScraperModel.scraperUrl = process.env.SCRAPPING_API;
			this.appScraperModel.scraperkey = process.env.SCRAPPING_KEY;
		}
		return this.appScraperModel;
	}

	static getAppMongoConfig(): AppMongoConfigModel {
		if (!this.appMongoConfigModel) {
			this.appMongoConfigModel = new AppMongoConfigModel();
			this.appMongoConfigModel.database = process.env.MONGO_DB_DATABASE;
			this.appMongoConfigModel.cluster = process.env.MONGO_DB_CLUSTER;
			this.appMongoConfigModel.clusterOptions = process.env.MONGO_DB_CLUSTER_OPTIONS;
			this.appMongoConfigModel.protocol = process.env.MONGO_DB_PROTOCOL;
			this.appMongoConfigModel.userName = process.env.MONGO_DB_USERNAME;
			this.appMongoConfigModel.password = process.env.MONGO_DB_PASSWORD;
			this.appMongoConfigModel.connectionTm = +process.env.MONGO_DB_CONNECTION_TM ?? 7000;
			this.appMongoConfigModel.keepAlive = process.env.MONGO_DB_KEEPALIVE ? process.env.MONGO_DB_KEEPALIVE === 'true' : false;
		}
		return this.appMongoConfigModel;
	}
}
