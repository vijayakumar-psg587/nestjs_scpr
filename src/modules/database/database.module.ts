import { Module } from '@nestjs/common';
import { MongoService } from './services/mongo/mongo.service';
import { OpsService } from './services/ops/ops.service';

@Module({
	providers: [MongoService, OpsService],
	exports: [MongoService, OpsService],
})
export class DatabaseModule {}
