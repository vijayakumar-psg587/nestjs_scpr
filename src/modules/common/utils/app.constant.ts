export const APP_CONST = {
	MANDATORY_HEADERS_NAME_LIST: ['CS-LOG-TRACKING-ID', 'CS-USER-TYPE', 'CS-CONSUMER-APP-PROCESS', 'CS-PRINCIPAL-ROLE'],
	HEADERS: {
		CI_LOG_TRACKING_ID: 'CI-LOG-TRACKING-ID',
		CI_USER_ID: 'CI-USER-ID',
		CI_USER_TYPE: 'CI-USER-TYPE',
		CI_PRINCIPAL_ROLE: 'CI-PRINCIPAL-ROLE',
		CI_CONSUMER_APP_PROCESS: 'CI-CONSUMER-APP-PROCESS',
	},
	CHAR: {
		COMMA: ',',
		SLASH: '/',
		COLON: ':',
		SEMI_COLON: ';',
		HYPHEN: '-',
		AT: '@',
		UNDERSCORE: '_',
		QUESTION: '?',
		DOT: '.',
	},
	COMMON: {
		AXIOS: {
			HEADERNAMES: ['app-name', 'org', 'content-type'],
		},
		CONTEXT: 'ci-scraper',
		APP_NAME: 'ci_opn_scr',
		ORG_NAME: 'CHAZE',
		REDACT_DEFAULT: ['headers["Content-type"]', 'req["headers"]["Authorization"]'],
		DEFAULT_DATE_TIME_FORMAT: 'yyyy-MM-dd HH:mm:ss.SSSS',
		DEFAULT_APP_PORT: 3002,
		DEFAULT_APP_HOST: '0.0.0.0',
	},
	SCRAPER: {
		PRODUCTS_STARTER: ['ringcentral-office' ],
		MARKETS_STARTER: ['unified-communications-as-a-service-worldwide'],
		VENDORS_STARTER: ['ringcentral' ],
		URL_TEMPLATE: [
			{ GPI_OVERVIEW: 'https://www.gartner.com/reviews/market/#market/vendor/#vendor/product/#product?marketSeoName=#market&vendorSeoName=#vendor&productSeoName=#product' },
			{ GPI_REVIEWS:  'https://www.gartner.com/reviews/market/#market/vendor/#vendor/product/#product/reviews?marketSeoName=#market&vendorSeoName=#vendor&productSeoName=#product'},
			
			{ TR: '' },
			{ G2: ''}
		],
	},
	CORS: {
		HEADERS: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', 'Access-Control-Max-Age', 'Access-Control-Allow-Credentials'],
		WHITELIST: ['127.0.0.0', '127.0.0.0:3002', 'localhost:3002', '0.0.0.0:3002', '*', 'localhost', '*'],
		ALLOW_HEADERS: ['Content-type', 'Authorization', 'Origin', 'X-Forwaded-for', 'Referrer', 'Origin'],
		ALLOW_METHODS: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
		ALLOW_CRED: true,
	},
	HEALTH_CHECK: {
		URL: 'https://jsonplaceholder.typicode.com/posts/1',
		METHOD: 'GET',
		PROXY: 'http://http.proxy.fmr.com:8000',
	},
	MIMETYPE: {
		APPLICATION_JSON: 'application/json',
		MULTIPART_FORM_DATA: 'multipart/form-data',
	},
	REGEX: {
		MULTIPART_CONTENT_TYPE: /^(multipart)[\/\\\-\w]*$/,
		FILE_NAME: /^[\w]{2,}(.(csv|xls|xlsx|env|mp4))$/,
		NUMBER: /^[\d]$/,
		EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	},
};
