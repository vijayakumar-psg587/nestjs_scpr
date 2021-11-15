import * as mongoose from 'mongoose';
import { AppUtilService } from 'src/modules/common/services/app-util/app-util.service';
export const orgSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		department: { type: String, required: true },
		costCenter: { type: String },
		address: { type: String },
		type: { type: String },
		createdBy: { type: String, default: 'SYSTEM' },
		updatedBy: { type: String, default: 'SYSTEM' },
		updatedAt: { type: Number, default: AppUtilService.getEpochTimeMs() },
	},
	{ collection: 'CI_ORG', optimisticConcurrency: true },
);
