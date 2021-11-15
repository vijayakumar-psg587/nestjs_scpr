import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable, Scope } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CustomErrorModel } from '../models/exception/custom-error.model';

@Injectable({
	scope: Scope.DEFAULT,
})
@Catch()
export class CustomExceptionFilter<T> implements ExceptionFilter {
	catch(exception: HttpException | CustomErrorModel | Error, host: ArgumentsHost) {
		console.log('ece:', exception, typeof exception, exception instanceof CustomErrorModel);
		const resp: FastifyReply = <FastifyReply>host.switchToHttp().getResponse();
		if (exception instanceof HttpException) {
			const hte = exception as HttpException;
			resp.code(hte.getStatus()).status(hte.getStatus()).send({ message: hte.message });
		} else if (exception instanceof CustomErrorModel) {
			const ce = exception as CustomErrorModel;
			resp.code(+ce.code)
				.status(ce.status)
				.send({ message: ce.message, time: ce.timestamp });
		} else {
			const e = exception as Error;
			resp.code(500).status(500).send({ message: e.message });
		}
	}
}
