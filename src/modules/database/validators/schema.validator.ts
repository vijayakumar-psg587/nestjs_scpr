import { APP_CONST } from 'src/modules/common/utils/app.constant';

export class SchemaValidator {
	constructor() {}

	static emailValidator(value: string) {
		const emailRegex = new RegExp(APP_CONST.REGEX.EMAIL, 'ig');
		return emailRegex.test(value);
	}
}
