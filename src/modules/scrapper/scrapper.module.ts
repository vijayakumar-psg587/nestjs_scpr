import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GiController } from './controllers/gi/gi.controller';
import { GiService } from './services/gi/gi.service';
import { ScrapperUtlService } from './utils/scrapper-utl/scrapper-utl.service';

@Module({
	controllers: [GiController],
	providers: [GiService, ScrapperUtlService],
	imports: [DatabaseModule],
})
export class ScrapperModule {}
