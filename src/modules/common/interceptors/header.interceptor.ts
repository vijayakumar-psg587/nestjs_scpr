import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { PrincipalRoleType } from '../models/enum/principal-role.enum';
import { UserIdType } from '../models/enum/user-type.enum';
import { CustomErrorModel } from '../models/exception/custom-error.model';
import { AppUtilService } from '../services/app-util/app-util.service';
import { APP_CONST } from '../utils/app.constant';

@Injectable({
	scope: Scope.DEFAULT,
})
export class HeaderInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		// validate if request headers  -  USER type and Principal Role are of the required enums
		const headerGen = this.headerGenerator(req.headers);

		let genVal = null;
		let headerErrList: string[] = [];
		// we have to make sure atleast UseridType and PrincipalRoles are entered in HEADERS
		// TODO. Once tested need to remove the comments below
		// if (!headerGen.next().value) {
		// 	headerErrList = ['Request should contain atleast UserIdType or PrincipalRoleType'];
		// }
		let itrFlag = true;
		while (itrFlag || (genVal && !genVal.done)) {
			genVal = headerGen.next();
			if (genVal.done) {
				itrFlag = false;
			}
			if (genVal && genVal.value && genVal.value.key === APP_CONST.HEADERS.CI_USER_TYPE.toLowerCase()) {
				headerErrList =
					Object.keys(UserIdType).filter((item) => item.toLowerCase() === genVal.value.key).length > 1
						? (() => {
								const errMsg = `Request does not contain a valid UserIdType`;
								headerErrList.push(errMsg);
								return [...headerErrList];
						  })()
						: headerErrList;
			}
			if (genVal && genVal.value && genVal.value.key === APP_CONST.HEADERS.CI_PRINCIPAL_ROLE.toLowerCase()) {
				headerErrList =
					Object.keys(PrincipalRoleType).filter((item) => item.toLowerCase() === genVal.value.key).length > 1
						? (() => {
								const errMsg = `Request does not contain a valid PrincipalRole`;
								headerErrList.push(errMsg);
								return [...headerErrList];
						  })()
						: headerErrList;
			}
		}

		if (headerErrList.length >= 1) {
			// there is an err =- make sure to throw that
			const errModel = new CustomErrorModel();
			errModel.code = '451';
			errModel.status = HttpStatus.BAD_REQUEST;
			errModel.timestamp = AppUtilService.getAppLevelDefaultUTCTime();
			headerErrList.forEach((item) => {
				if (errModel.message) {
					errModel.message = errModel.message + ' : ' + item;
				} else {
					errModel.message = item;
				}
			});

			throw errModel;
		} else {
			return next.handle();
		}
		//return next.handle();
	}

	private *headerGenerator(headerObj: unknown) {
		// you can put the return type Generator<number>, but it is ot necessary as ts will infer
		for (const key of Object.keys(headerObj)) {
			if (key.toLowerCase() === APP_CONST.HEADERS.CI_USER_TYPE.toLowerCase() || key.toLowerCase() === APP_CONST.HEADERS.CI_PRINCIPAL_ROLE.toLowerCase())
				yield {
					key: key.toLowerCase(),
					value: headerObj[key].toLowerCase(),
				};
		}
	}
}
