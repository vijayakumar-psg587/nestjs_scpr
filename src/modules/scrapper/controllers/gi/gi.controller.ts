import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OpsService } from 'src/modules/database/services/ops/ops.service';
import { AuthGuard } from '../../guards/auth.guard';
import { InputReqModel } from '../../models/request/inp.model';
import { GiService } from '../../services/gi/gi.service';
import { FastifyRequest, FastifyReply } from 'fastify';

// Make sure to pass the emailId in the req headers always
@Controller('gi')
@UseGuards(AuthGuard)
export class GiController {
	constructor(private readonly giService: GiService) {}

	@Post()
	async getScrapingData(@Body() inputReqBody: InputReqModel) {
		return await this.giService.getGIScrapedData();
	}
}
