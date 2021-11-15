import * as mongoose from 'mongoose';
import { orgSchema } from '../schema/org.schema';
import { roleSchema } from '../schema/role.schema';
import { userSchema } from '../schema/user.schema';
export const MongoOrgModel = mongoose.model('CI_ORG', orgSchema, 'CI_ORG');
export const MongoRoleModel = mongoose.model('ROLES', roleSchema, 'ROLES');
export const MongoUserModel = mongoose.model('USERS', userSchema, 'USERS');
