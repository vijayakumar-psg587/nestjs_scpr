import { Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { TracingEntitiesModel } from './tracing-entities.model';
import 'reflect-metadata';
export class CIRoleModel extends TracingEntitiesModel {
	@Expose()
	@Transform(() => String)
	_id: string;

	@Expose()
	roleName: string;

	@Expose()
	roleType: string;
}
