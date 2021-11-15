import { Injectable, Scope } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CustomErrorModel } from 'src/modules/common/models/exception/custom-error.model';
import { CIUserModel } from 'src/modules/scrapper/models/user-agg.model';
import { MongoUserModel } from '../../models/mongo/mongo.model';
@Injectable({
	scope: Scope.REQUEST,
})
export class OpsService {
	constructor() {}

	getUserDetailsByEmail(emailId: string): Promise<CIUserModel> {
		return new Promise((resolve, reject) => {
			MongoUserModel.aggregate(this.formAggregationQuery(emailId))
				.allowDiskUse(true)
				.exec()
				.then((data) => {
					console.log(JSON.stringify(data));
					const usrModel: CIUserModel[] = plainToClass(CIUserModel, data, { excludeExtraneousValues: true });
					resolve(usrModel[0]);
				})
				.catch((err) => {
					console.log('err obtained:', err);
					const errModel = new CustomErrorModel(500, 'DB_ERR', err.message, '500');
					reject(errModel);
				});
		});
	}

	private formAggregationQuery(emailId: string): any[] {
		return [
			{
				$match: { emailId: emailId },
			},
			{ $limit: 1 },
			{
				$lookup: {
					from: 'ROLES',
					localField: 'role',
					foreignField: '_id',
					as: 'usr_role',
				},
			},
			{ $limit: 1 },
			{
				$lookup: {
					from: 'CI_ORG',
					localField: 'org',
					foreignField: '_id',
					as: 'usr_role_org',
				},
			},
			{ $project: { _id: 1, userName: 1, emailId: 1, createdBy: 1, usr_role: { _id: 1, roleType: 1, createdBy: 1, roleName: 1 }, usr_role_org: { _id: 1, createdBy: 1, name: 1 } } },
		];
	}
}
