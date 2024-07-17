
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import {initScraping} from './scraper'

const url = "https://www.fund.com/top/debt-consolidation/dr/desk/";



async function extractCompetitorsFromIframe(driver: WebDriver): Promise<string[]> {
    try {
        
        await driver.wait(until.elementLocated(By.xpath("//div[@class='logo-link-holder']/a")), 10000);
        const companyElements = await driver.findElements(By.xpath("//div[@class='logo-link-holder']/a"));
        const competitors = await Promise.all(companyElements.map(element => element.getAttribute('title')));
        return competitors;
    } catch (error) {
        console.error('Error extracting competitors from iframe:', error);
        return [];
    }
}

initScraping(url, extractCompetitorsFromIframe);