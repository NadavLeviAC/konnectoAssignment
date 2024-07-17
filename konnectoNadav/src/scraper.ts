import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';
import * as fs from 'fs-extra';
import * as path from 'path';


interface Competitor {
    name: string;
    position: number;
}

// Convert an array of competitor names into an array of Competitor objects
const convertToCompetitors = (names: string[]): Competitor[] => {
    return names.map((name, index) => ({
      name,
      position: index + 1
    }));
  };

interface Page {
    url: string;
    html: string;
    screenshotPath: string;
    competitors: string[];
}

async function saveScreenshot(driver: any) {
    try {

        driver.manage().window().maximize();
        const screenshotPath = path.join(__dirname, `screenshot-${Date.now()}.png`);
        const image = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, image, 'base64');
        return screenshotPath;
    } catch (error) {
        console.error('couldnt take screen shot', error);
        return '';
    }
}


async function pageObjectBuilder(url: string , extractCompetitors: (driver: WebDriver) => Promise<string[]> ) {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(url);
        const html = await driver.getPageSource();
        const screenshotPath = await saveScreenshot(driver);
        const competitors = await extractCompetitors(driver);
        
        // create page from all the data
        let my_page: Page = { url: url, html: html, screenshotPath: screenshotPath, competitors: competitors };
        return my_page;
    } finally {
        await driver.quit();
    }
}



export async function initScraping(url: string , extractCompetitors: (driver: WebDriver) => Promise<string[]>) {
    try {
        const pageData = await pageObjectBuilder(url , extractCompetitors);
        const angular_structure = {
            page_url: pageData.url,
            html: pageData.html,
            screenshotPath: pageData.screenshotPath,
            competitors: convertToCompetitors(pageData.competitors)
        }
        console.log(angular_structure);
        return angular_structure;
        
    } catch (error) {
        console.error('An error for url: ',url, error);
    }
}



