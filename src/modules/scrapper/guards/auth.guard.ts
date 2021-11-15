import { CanActivate, ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { OpsService } from 'src/modules/database/services/ops/ops.service';
import { CIUserModel } from '../models/user-agg.model';
@Injectable({
	scope: Scope.REQUEST,
})
export class AuthGuard implements CanActivate {
	constructor(private readonly opsService: OpsService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: FastifyRequest = context.switchToHttp().getRequest();
		return await this.validateRequest(req);
	}

	private async validateRequest(req: FastifyRequest): Promise<boolean> {
		// get the req headers,
		let emailIdHeader = req.headers['email'] ?? req.headers['emailid'];
		return new Promise(async (resolve, reject) => {
			if (emailIdHeader) {
				let emailId = '';
				if (Array.isArray(emailIdHeader)) {
					emailId = emailIdHeader[0];
				} else {
					emailId = emailIdHeader;
				}
				// now check if the emailId fetches the admin rights
				const data = await this.opsService.getUserDetailsByEmail(emailId).catch((err) => {
					reject(false);
				});
				if (data) {
					resolve(data.org[0].name === 'Chaze' && data.role[0].roleName === 'ADMIN' && data.role[0].roleType.includes('DB'));
				}
			} else {
				resolve(false);
			}
		});
	}
}
