## **Description**

This project is the scraping tool being used to get data. Most probably the scraped data had to be dumped into S3, but that part will come in later

This project is created with Nestjs

**Steps**
- Run `npm install`
- Make sure to have the configurations available in local under *./config/development/.env*
- Run npm run start:nodemon:dev to start the server

## Points to Note
 - Common Module has all the related common tasks for the project
 - Database module has all the database oriented tasks
 - **scraper** module is the main module