
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import {initScraping} from './scraper'

const url = "https://www.cbsnews.com/essentials/what-is-the-cheapest-meal-kit/";




async function extractCompetitorsFromIframe(driver: WebDriver): Promise<string[]> {
    try {
        //const iframes = await driver.findElements(By.tagName('iframe'));
        const iframe = await driver.findElement(By.xpath("//iframe[@id='MyFiAd']"));
        const src = await iframe.getAttribute('src');
        await driver.get(src);
        await driver.wait(until.elementLocated(By.xpath("//p/strong/span[@style='color: #000']")), 10000);
        const companyElements = await driver.findElements(By.xpath("//p/strong/span[@style='color: #000']"));
        const competitors = await Promise.all(companyElements.map(element => element.getText()));
        return competitors;

    } catch (error) {
        console.error('Error extracting competitors from iframe:', error);
        return [];
    }
}

initScraping(url, extractCompetitorsFromIframe);