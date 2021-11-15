import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoService {
	constructor() {}
	static async getMongoConnection(connUrl: string, connTimeOutMs: number, keepAlive: boolean) {
		mongoose.set('bufferCommands', false);
		return new Promise(async (resolve, reject) => {
			mongoose
				.connect(connUrl, { bufferCommands: false, dbName: 'CHAZE', autoIndex: false })
				.then((connDetails) => {
					resolve(connDetails);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
