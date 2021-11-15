import * as mongoose from 'mongoose';
import { AppUtilService } from 'src/modules/common/services/app-util/app-util.service';
import { SchemaValidator } from '../../validators/schema.validator';
export const userSchema = new mongoose.Schema(
	{
		userName: { type: String, required: true },
		password: { type: String, required: true },
		email: {
			type: String,
			required: true,
			validate: {
				message: (props) => `Given email- ${props.value} does not match the regex pattern. Please provide proper email`,
				validator: SchemaValidator.emailValidator,
			},
		},
		org: { type: mongoose.Types.ObjectId, required: true },
		role: { type: mongoose.Types.ObjectId, required: true },
		createdBy: { type: String, default: 'SYSTEM' },
		updatedBy: { type: String, default: 'SYSTEM' },
		updatedAt: { type: Number, default: AppUtilService.getEpochTimeMs() },
	},
	{ optimisticConcurrency: true, collection: 'USERS' },
);
