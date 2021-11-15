import { v4 as uuidv4 } from 'uuid';
import { AppConfigService } from './modules/common/services/app-config/app-config.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as mongoose from 'mongoose';
import { CustomErrorModel } from './modules/common/models/exception/custom-error.model';
import { APP_CONST } from './modules/common/utils/app.constant';
import { MongoService } from './modules/database/services/mongo/mongo.service';
export class ServerAdapterService {
	constructor() {}

	private static configureHook(app: NestFastifyApplication) {
		(<FastifyAdapter>app.getHttpServer()).get().addHook('preHandler', (req, rep, done) => {
			if (req.routerPath === '*' && req.routerMethod === 'OPTIONS') {
				return done();
			}
		});
	}

	static async configureSecurity(app: NestFastifyApplication) {
		// TODO: Have to enable security with csp proper directives, default ones might not be enough
		await app.register(require('fastify-helmet'));
	}

	static async configureDbConnection(app: NestFastifyApplication) {
		// only if the connection becomes available, we have to start the graphql
		const dbConfig = AppConfigService.getAppMongoConfig();
		// construct the URL
		const connUrl = dbConfig.protocol + APP_CONST.CHAR.COLON + '//' + dbConfig.userName + APP_CONST.CHAR.COLON + dbConfig.password + APP_CONST.CHAR.AT + dbConfig.cluster + APP_CONST.CHAR.SLASH + dbConfig.database + APP_CONST.CHAR.QUESTION + dbConfig.clusterOptions;
		mongoose.set('debug', process.env.NODE_ENV && process.env.NODE_ENV === 'dev');
		const conn = await MongoService.getMongoConnection(connUrl, dbConfig.connectionTm, dbConfig.keepAlive).catch((err) => {
			console.log('getting err:', err);
			throw new CustomErrorModel(500, 'APP', err.message, 500);
		});
	}

	static getAdapter(): FastifyAdapter {
		const appConfig = AppConfigService.getAppConfig();

		return new FastifyAdapter({
			ignoreTrailingSlash: false,
			caseSensitive: true,
			genReqId: () => uuidv4().toString(),
			trustProxy: true,
			pluginTimeout: appConfig.timeout,
			requestIdHeader: 'req-id',
		});
	}
}
