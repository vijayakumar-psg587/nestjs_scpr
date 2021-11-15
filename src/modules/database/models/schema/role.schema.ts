import * as mongoose from 'mongoose';
import { AppUtilService } from 'src/modules/common/services/app-util/app-util.service';
export const roleSchema = new mongoose.Schema(
	{
		roleName: { type: String, default: 'CONSUMER', required: true },
		roleType: { type: String, default: 'APP', required: true },
		createdBy: { type: String, default: 'SYSTEM' },
		updatedBy: { type: String, default: 'SYSTEM' },
		updatedAt: { type: Number, default: AppUtilService.getEpochTimeMs() },
	},
	{ optimisticConcurrency: true, collection: 'ROLES' },
);
