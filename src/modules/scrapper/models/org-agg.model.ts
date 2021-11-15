import { Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { TracingEntitiesModel } from './tracing-entities.model';
import 'reflect-metadata';
export class CIOrgModel extends TracingEntitiesModel {
	@Expose()
	@Transform(() => String)
	_id: string;

	@Expose()
	name: string;

	@Expose()
	department?: string;

	@Expose()
	costCenter?: string;

	@Expose()
	//TODO: Need to change later to a more prominent type
	address?: string;

	@Expose()
	type?: string;
}
