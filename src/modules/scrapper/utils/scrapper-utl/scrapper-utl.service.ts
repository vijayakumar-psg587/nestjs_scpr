import { Injectable, Scope } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { timingSafeEqual } from 'crypto';
import { HtmlTestService } from '../html-test.service';
@Injectable({
    scope: Scope.REQUEST
})
export class ScrapperUtlService {
    constructor(){}

    static convertHTMLToJSON( productScrapingDetails: Record<string, string>,htmlData: string){
		if(productScrapingDetails.searchSource === 'GPI') {
            if(productScrapingDetails.searchPageType === 'OVERVIEW') {
                // scrape overview page
                this.scrapeGartnerOverviewPage(productScrapingDetails,  htmlData)
				
            } 
			// else if(productScrapingDetails.searchPageType === 'REVIEWS') {
            //     // scrape reviews page  - go to every review from there and scrape the data
			// 	this.scrapeGartnerReviewsPage(productScrapingDetails, htmlData);
			// } else {
            //     // scrape rating page
            // }
            
        }
       

    }


    private static scrapeGartnerOverviewPage(productScrapingDetails: Record<string, string>, htmlData) {
        // THIS IS THE OVERVIEW PAGE SCRAPE DATA - TODO needs to be modified to get actual HTML data
	//const $ = cheerio.load(HtmlTestService.htmlTestService())
	const $ = cheerio.load(htmlData)

	// get review
	const reviewTabHref = $('body').find('[data-interaction="reviews_tab"]').attr('href')
	console.log('reviewTabHref')

    // get ratingContent
	const overallRating = $('.ratingNumber').text()?.substring(0,4)
	// get recommendationPercentage
	const wouldRecommendPercentage = $('.would-recommend-text').text()?.substring(0,2)
	
	// get overall rating distribution
	const ratingDisList = $('.starHistogramTable').children()
	let valToPass = 5;
	let productRatingDistributionList = []
		ratingDisList.each((index, el) => {
			
		const starRating = cheerio.load(el)(`[data-filter="${valToPass}"] .piStatusBar .uxd-status-bar > label > span`).text().trim();
		const starRatingVal = cheerio.load(el)(`[data-filter="${valToPass}"] > .piStatusBar .uxd-status-bar > label`).text().substr(6);
		valToPass--;
		productRatingDistributionList.push({star: starRating, percentage: starRatingVal}) 
	})

	// get overall customer experience
	let overallCustomerExperience = [];
	const experienceGraphChildren = $('.customer-experience-graphs').children()
	
	experienceGraphChildren.map((index, el) => {
		const ratingCategory = cheerio.load(el)('.section-graph > .rating-category').text()
		const ratingVal = cheerio.load(el)('.section-graph > .label-and-graph > .label').text()
		if(ratingCategory?.length >=1 && ratingVal?.length >= 1)
		overallCustomerExperience.push({OverallRatingCategory: ratingCategory, OverallRatingValue: ratingVal})
	})
	// get Product Capability Features and Ratings
	let capabilityFeatures = []
	const childCapabilityElements = $('.capabilities-container').children();
	childCapabilityElements.map((index, el ) => {
		//console.log('index is:', index)
		const productFeature = cheerio.load(el)('.capability-title').text();
		let productFeatureRating : number, productFeatureOverallCount: number = 0;
		//console.log('tt:', title)
		cheerio.load(el)('.capability-section-graph > span').each((index, anotherEl) => {
			const ratingLabel = cheerio.load(anotherEl)('.rating-review-label').text();
			if(index === 0) {
				productFeatureRating = +ratingLabel.trim().replace('(', '').replace(')', '')
			} else {
				productFeatureOverallCount = +ratingLabel.trim().replace('(', '').replace(')', '')
			}
			
		})
		 
		capabilityFeatures.push({ProductCapability: productFeature, ProductFeatureRating: productFeatureRating, ProductFeatureRateCount: productFeatureOverallCount})
	})
	// consolidating the scraped data
	const overviewScrapedObj = Object.assign({}, [{
		Overview: {
			ProductOverallRating: overallRating,
			ProductOverallRecommendedPercentage: wouldRecommendPercentage,
			ProductName: productScrapingDetails.searchProductItem,
			Source: productScrapingDetails.searchSource,
			MarketCategory: productScrapingDetails.searchMarketItem,
			VendorCategory: productScrapingDetails.searchVendorItem,
			ProductOverallCategoryRating: JSON.stringify(overallCustomerExperience),
			ProductOverallFeatureReview: JSON.stringify(capabilityFeatures),
			ProductOverallRatingDistribution: JSON.stringify(productRatingDistributionList)
		}
	}])
	console.log('overview scraped Obj:', overviewScrapedObj)



	return {overviewScrapedObj};

    }

	static scrapeGartnerReviewsPage(productScrapingDetails: Record<string, string>, htmlData: string,) {

	}

    static convertJSONToCSV() {

    }

    static exportToMongo(){}
    static exportToAWSS3(){}


}
