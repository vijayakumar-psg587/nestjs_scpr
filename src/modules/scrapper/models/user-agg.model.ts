import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsMongoId } from 'class-validator';
import { CIRoleModel } from './role-agg.model';
import 'reflect-metadata';
import { CIOrgModel } from './org-agg.model';
import { TracingEntitiesModel } from './tracing-entities.model';
export class CIUserModel extends TracingEntitiesModel {
	@Expose()
	@Transform(() => String)
	_id: string;
	@Expose()
	userName: string;
	@Expose()
	emailId: string;
	@Expose({ name: 'usr_role' })
	@IsArray({ always: true })
	@Type(() => CIRoleModel)
	role: CIRoleModel[];

	@Expose({ name: 'usr_role_org' })
	@IsArray({ always: true })
	@Type(() => CIOrgModel)
	org: CIOrgModel[];
}
