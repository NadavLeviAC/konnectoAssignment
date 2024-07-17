import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import {initScraping} from './scraper'
const url = "https://www.cbsnews.com/news/3-ways-to-qualify-for-credit-card-debt-forgiveness/";
interface Page {
    url: string;
    html: string;
    screenshotPath: string;
    competitors: string[];
}



async function extractCompetitorsFromIframe(driver: WebDriver): Promise<string[]> {
    try {
        const iframe = await driver.findElement(By.xpath("//iframe[@class='ca-embed-iframe']"));
        //const iframe = await driver.findElement(By.tagName('iframe'));
        const newUrl = await iframe.getAttribute('src');
        await driver.get(newUrl);
        //const companyElements = await driver.findElements(By.css('[data-catk-company]'));
        const companyElements = await driver.findElements(By.xpath("//a[@class='logo-link']"));
        const competitors = await Promise.all(companyElements.map(async (element: WebElement) => {
            return await element.getAttribute('data-catk-company');
        }));
        return competitors;
    } catch (error) {
        console.error('Error extracting competitors from document:', error);
        return [];
    }
}

initScraping(url, extractCompetitorsFromIframe);