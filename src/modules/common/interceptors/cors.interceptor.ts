import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, switchMap, throwError } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomErrorModel } from '../models/exception/custom-error.model';
import { APP_CONST } from '../utils/app.constant';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request: FastifyRequest = context.switchToHttp().getRequest();
		const res: FastifyReply<any> = context.switchToHttp().getResponse();
		console.log('coming in cors');
		const hostHeader = request.headers['host'];
		const originHeader = request.headers['origin'] && true ? <string>request.headers['origin'] : null;
		console.log('origin header', originHeader);
		let allowedHostOrOrigin = null;
		if (hostHeader) {
			allowedHostOrOrigin = APP_CONST.CORS.WHITELIST.filter((item) => item.includes(hostHeader));
		} else if (originHeader) {
			allowedHostOrOrigin = APP_CONST.CORS.WHITELIST.filter((item) => item.includes(originHeader));
		}

		if (allowedHostOrOrigin) {
			const corsMap = new Map();
			APP_CONST.CORS.HEADERS.map((item) => {
				item = item.toLowerCase();
				if (item.includes('Origin'.toLowerCase())) {
					corsMap.set(item, request.headers['host'] ? request.headers['host'] : request.headers['origin']);
				} else if (item.includes('Credentials'.toLowerCase())) {
					corsMap.set(item, APP_CONST.CORS.ALLOW_CRED);
				} else if (item.includes('Method'.toLowerCase())) {
					corsMap.set(item, [...APP_CONST.CORS.ALLOW_METHODS].join(','));
				} else if (item.includes('Headers'.toLowerCase())) {
					corsMap.set(item, [...APP_CONST.CORS.ALLOW_HEADERS].join(','));
				}
			});

			// @ts-ignore
			console.log('cors headers:', Object.fromEntries(corsMap));
			// @ts-ignore
			res.headers(Object.fromEntries(corsMap));
			return next.handle();
		} else {
			return next.handle().pipe(
				switchMap(() => {
					throw new CustomErrorModel('500', 'CORS', `Cors does not accept origin/host of ${originHeader}/${hostHeader}`, 500);
				}),
			);
		}
	}
}
