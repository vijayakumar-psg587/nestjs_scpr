import { Headers, Injectable, Scope } from '@nestjs/common';
import axios, { AxiosRequestHeaders } from 'axios';
import { Method } from 'axios';
import { AppScrModel } from './../../../common/models/app-scr.model';
import { AppConfigService } from './../../../common/services/app-config/app-config.service';
import { AppUtilService } from './../../../common/services/app-util/app-util.service';
import got from 'got';
import { APP_CONST } from './../../../common/utils/app.constant';
import { PinoLoggerService } from './../../../common/services/pino-logger/pino-logger.service';
import { ScrapperUtlService } from '../../utils/scrapper-utl/scrapper-utl.service';
import Nightmare from 'nightmare';
@Injectable({
	scope: Scope.REQUEST,
})
export class GiService {
	private infolog;
	constructor() {
		this.infolog = PinoLoggerService.getLoggerConfig('info');
	}

	// This is for gartner insights
	async getGIScrapedData() {
		const scrConfig = AppConfigService.getAppScraperConfig();
		// TODO: work on retries in 'got'

		// THis is for gartner peer insights
		const urlObjGIList = AppUtilService.createScrapingSites().filter(item => item.searchSource === 'GPI');
		return new Promise((resolve, reject) => {
			this.getGPIScrapingData(scrConfig, urlObjGIList).then(data => {
				console.log('from gi scraping:', data)
				resolve(data)
			}).catch(err => {
				console.log('err in gettin data:', err)
			})
		})
		
		
		
	}


	private async getGPIScrapingData(scrConfig: AppScrModel, urlGIObjList: Record<string, string>[]) {
		// have to make the iteration here as well
		return new Promise((resolve, reject) => {
			urlGIObjList.forEach((item) => {
				if(item.searchType === 'OVERVIEW') {
					this.callWebScrapingAPIAndCreateOverviewScrapeData(scrConfig, item).then(data => {
						console.log('after scraping overview data:', data)
					}).catch(err => {
						console.log('err in scraping overview data:', err)
						
					})
				}
				//  else if(item.searchType === 'REVIEWS') {
				// 	this.callWebScrapingAPIAndCreateReviewScrapeData(scrConfig, item).then(data => {
				// 		console.log('after scraping overview data:', data)
				// 	}).catch(err => {
				// 		console.log('err in scraping overview data:', err)
						
				// 	})
				// }
				
				
			})
			resolve('Done')
		})
		
		
	}

	private async callWebScrapingAPIAndCreateOverviewScrapeData(scrConfig: AppScrModel, urlGIOverview: Record<string, string>) {
		return new Promise(async (resolve, reject) => {
			const promises = []
			const params = this.getScraperConfigParamOptions(scrConfig, urlGIOverview.searchUrl);
			const compiledHeaders: AxiosRequestHeaders = {
				[APP_CONST.COMMON.AXIOS.HEADERNAMES[2]]: 'application/json',
				Accept: 'application/json',
			};
			console.log(params);
			try {
				
					const resp: any = await got(scrConfig.scraperUrl, {
						retry: {
							limit:AppConfigService.getAppConfig().retries,
						},
						searchParams: params,
						headers: compiledHeaders,
					});
					console.log('Getting response:', resp.body);
					ScrapperUtlService.convertHTMLToJSON(
						urlGIOverview, resp['body'] );
					resolve( 'Completed GPI Overview Scraping')	
				   

				
			}catch(err) {
				console.log(err.response.body)
				reject('Cannot scrape overview data'+err)
			}

		})
		

	
	}
   
	

	private getScraperConfigParamOptions(scrConfig: AppScrModel, urlToSearch: string): Record<string, string | number> {
		return {
			api_key: scrConfig.scraperkey,
			url: urlToSearch,
			proxy_type: 'datacenter',
			country: 'us',
			render_js: 1,
			session: '100',
		};
	}

	private buildScraperBody() {}
}
