import { Injectable, Scope } from '@nestjs/common';
import * as dateFns from 'date-fns';
import * as locale from 'date-fns/locale';
import { APP_CONST } from '../../utils/app.constant';
import { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';

const HttpsProxyAgent = require('https-proxy-agent');
const https = require('https');
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
	scope: Scope.DEFAULT,
})
export class AppUtilService {
	static getAppLevelDefaultUTCTime() {
		return dateFns.format(Date.now(), APP_CONST.COMMON.DEFAULT_DATE_TIME_FORMAT, { locale: locale.enIN });
	}

	static getEpochTimeMs(): number {
		return dateFns.getUnixTime(Date.now());
	}

	static configureAxios(url, method: Method, proxy: string, headers?: Record<string, string>, param?: any, body?: object): AxiosRequestConfig<any> {
		let enableProxy = process.env.ENABLE_HTTPS_PROXY ?? false;
		console;
		let httpsProxyAgent;
		if (enableProxy) {
			// get via substrings the host - port, auth for proxy

			httpsProxyAgent = new HttpsProxyAgent({
				host: '',
				port: '',
				secureProxy: true,
			});
		}
		let axiosProxyConfig;
		const compiledHeaders: AxiosRequestHeaders = {
			[APP_CONST.COMMON.AXIOS.HEADERNAMES[0]]: APP_CONST.COMMON.APP_NAME,
			[APP_CONST.COMMON.AXIOS.HEADERNAMES[1]]: APP_CONST.COMMON.ORG_NAME,
			[APP_CONST.COMMON.AXIOS.HEADERNAMES[2]]: 'application/json',
			...headers,
		};

		// we can insert a validator to see if a URL is valid
		return {
			headers: compiledHeaders,
			proxy: httpsProxyAgent,
			httpsAgent: new https.Agent({
				cert: fs.readFileSync(path.join(process.cwd(), './certs/ci_opn_scr.pem')),
				key: fs.readFileSync(path.join(process.cwd(), './certs/ci_opn_scr_key.pem')),
				rejectUnauthorized: false,
			}),
			url: url,
			method: method,
			maxContentLength: 5242880,
			params: param,
			timeoutErrorMessage: `Axios cannot contact the specified URL - ${url}`,
			timeout: 20000,
			xsrfHeaderName: 'AXIOS-CI_API_XSRF',
			maxRedirects: 3,
		};
	}

	//TODO need to make changes to construct the URLs dynamically for each source
	// THIS SOLUTION IS NOT VIABLE for larger data market strings. HAS TO CHANGE
	static createScrapingSites(): Record<string, string>[] {
		let overViewObjList = [];
		APP_CONST.SCRAPER.URL_TEMPLATE.forEach((urlItem) => {
			APP_CONST.SCRAPER.MARKETS_STARTER.forEach((mItem) => {
				APP_CONST.SCRAPER.VENDORS_STARTER.forEach((vItem) => {
					APP_CONST.SCRAPER.PRODUCTS_STARTER.forEach((pItem) => {
						Object.keys(urlItem).forEach(val => {
							   let searchPageType = ''
								// this is for gartner peer insights	
								if(val.includes('GPI')){
									if(val.includes('OVERVIEW')) {
										searchPageType = 'OVERVIEW'
									} else if(val.includes('REVIEWS')) {
										searchPageType = 'REVIEWS'
									}
									overViewObjList.push({
										searchPageType: searchPageType,
										searchSource: 'GPI',
										searchMarketItem: mItem,
										searchVendorItem: vItem,
										searchProductItem: pItem,
										searchUrl: this.constructGIUrls(urlItem[val], mItem, vItem, pItem),
									});
								} else if(val.includes('TR')) {
									// this is for trustRadius
								} else {
									// this is for G2
								}

							
						}) 
							
						
					});
				});
			});
		});

		return overViewObjList;
	}

	private static constructGIUrls(urlString: string, market: string, vendor: string, product: string): string {
		const urlStructuredString = urlString
			.replace(new RegExp(/#market/, 'ig'), market)
			.replace(new RegExp(/#vendor/, 'ig'), vendor)
			.replace(new RegExp(/#product/), product)
			.replace(new RegExp(/#product$/), product);
		return urlStructuredString;
	}
}
