import { Expose } from 'class-transformer';
import 'reflect-metadata';
export class TracingEntitiesModel {
	@Expose()
	createdBy: string;
	@Expose()
	updatedBy?: string;
	@Expose()
	updatedAt?: number;
	// Derive the below from ObjectId of the document/model always
	@Expose({ toClassOnly: true })
	createdAt?: string;
}
