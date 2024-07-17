
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import {initScraping} from './scraper'

const url = "https://www.deliveryrank.com/best-high-protein-meal-delivery-services";


async function extractCompetitorsFromIframe(driver: WebDriver): Promise<string[]> {
    try {
        
        await driver.wait(until.elementLocated(By.xpath("//product-record")), 10000);
        const companyElements = await driver.findElements(By.xpath("//product-record"));
        const competitors = await Promise.all(companyElements.map(element => element.getAttribute('data-name')));
        return competitors;
    } catch (error) {
        console.error('Error extracting competitors from iframe:', error);
        return [];
    }
}

initScraping(url, extractCompetitorsFromIframe);