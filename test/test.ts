const got = require('got');
import cheerio = require('cheerio');
const Nightmare = require('nightmare');
import * as jquery from "jquery";
import puppeteer = require('puppeteer');
import { AppConfigService } from './../src/modules/common/services/app-config/app-config.service';
import { APP_CONST } from './../src/modules/common/utils/app.constant';
import { HtmlTestService } from './../src/modules/scrapper/utils/html-test.service';
(async () => {

	    // THIS IS THE OVERVIEW PAGE SCRAPE DATA - TODO needs to be modified to get actual HTML data
	//const $ = cheerio.load(HtmlTestService.htmlTestService())
    
	const $ = cheerio.load(HtmlTestService.htmlTestService())
    
	// get review
	const reviewTabHref = $('.uxd-tab-menu > a')
    let reviewRelativePath = ''
	reviewTabHref.each((index, el) => {
        // TODO: Need to find a better alternative for this, a proper CSS selector
       if(index === 1) {
        reviewRelativePath = cheerio.load(el)('a').attr('href');
        console.log('review relative path:', reviewRelativePath);
       }
    })
    
    

    const reviewsMainPageUrl = 'https://gartner.com'+reviewRelativePath;
   
    const respBody = await getRespFromWebScrapingApi(reviewsMainPageUrl);
    const new$ = cheerio.load(respBody)
    const completeNew = cheerio.load(new$.html())
    const data = completeNew('.uxd-truncate-text').text()
    //console.log('data:', data)
 
    // Now there are two loops -  one for the reviews in a page and another one for the whole set of pages
    // const browser = await puppeteer.launch({headless: false})
    // const page = await browser.newPage();
    const readReviewList = completeNew('.read-review-link').children();


    // first trying to load the review one by one
    await scrapeFullReviewNMJS(reviewsMainPageUrl, readReviewList, cheerio)

})();


function loadWithPuppeteer(reviewsMainPage: string, page) {
    page.goto(reviewsMainPage)
}

async function  scrapeFullReviewNMJS(reviewsMainPageUrl: string, readReviewList, cheerio) {
  
    const ngjs =  new Nightmare({show: true, waitTimeout: 18000, gotoTimeout: 18000, loadTimeout: 17000,  executionTimeout: 18000 })
    try {
        const n = await ngjs
            .goto(reviewsMainPageUrl)
            
            .click('div > div.product-reviews-snippet-wrapper > ul > li:nth-child(1) > div > div.read-review-link > button')
            .wait('#review-nav > li.active > a')
            .evaluate( ()=> {
               return new Promise((resolve, reject) => {
                const hrefVal = document.querySelector('#review-nav > li.active > a')['href'] 
                // getting scrape items from review detail page
                let reviwedCustomerDetails: Record<string, string> = {}
                
                let completeReviewDetails: Record<string, string> = {}
                let otherQAs: Record<string, string>[] = []

                // construct completeREviewDetails
                const reviewTitle = document.querySelector('div.category.headline.condensed > h2')?.textContent
                const overallRating =document.querySelector('div.avgStarIcon > span > span').getAttribute('style')?.substr(7)?.replace(/[%]/, '')?.replace(';','')
                const reviewRatingUseful = document.querySelector('#review-helpful')?.textContent
                const completeReview = document.querySelector('#sub-head > p > span.commentSuffix')?.textContent

                
                completeReviewDetails = {
                    reviewTitle: reviewTitle,
                    reviewRatingUsefulNess: reviewRatingUseful,
                    reviewOverallRating: overallRating,
                    reviewCompleteDetail: completeReview 
                }

                // constrcut reviewerProfile
                const reviewerProfile  = document.querySelector('#profile > div > div.user-info.row > div > div.reviewer-title.row > div.col-xs-10.title > span')?.textContent
                const reviewerIndustry = document.querySelector('#industry > span')?.textContent
                const reviewerRole = document.querySelector('#roles > span')?.textContent;
                const reviewerIndustrySize = document.querySelector('#companySize > span')?.textContent;
                const reviewerImplementationStratergy = document.querySelector('#profile > div > div.user-info.row > div > div:nth-child(3) > span').textContent;

                reviwedCustomerDetails = {
                    reviewerProfile: reviewerProfile,
                    reviewerIndustry: reviewerIndustry,
                    reviewerRole: reviewerRole,
                    reviewerIndustrySize: reviewerIndustrySize,
                    reviewerImplementationStratergy:reviewerImplementationStratergy
                }

                // construct otherQAs

                
                resolve({rd: completeReviewDetails, rP: reviwedCustomerDetails})
               });
            })
            .end()
            .then((results) => {
                console.log('seeing results:', results)
            })
           
       
        
    } catch(err) {
        console.log('err in handling:', err)
    }
    

}

async function getRespFromWebScrapingApi(reviewsMainPage: string) {
    const compiledHeaders = {
        [APP_CONST.COMMON.AXIOS.HEADERNAMES[2]]: 'application/json',
        Accept: 'application/json',
    };
    const params = getParams(reviewsMainPage)
    console.log('params:', params)
    const resp: any = await got('https://api.webscrapingapi.com/v1', {
        retry: {
            limit:AppConfigService.getAppConfig().retries,
        },
        searchParams: params,
        headers: compiledHeaders,
    });
    return resp['body']
}

function getParams( url: string) {
    return {
        api_key: 'fxibQaYuQlO9Pf3stIGlnKZl9uanhccw',
        url: url,
        proxy_type: 'datacenter',
        country: 'us',
        render_js: 1,
        session: '100',
    };
}