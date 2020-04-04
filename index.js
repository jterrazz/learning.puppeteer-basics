const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

/*
Ideas for faster loading:
- Use the mobile version
- Open at start a set of chromium pages
- Preload at start most used websites
 */

class Scrapper {
    constructor() {
        this._browser = null;
    }

    /*
    Process init
     */

    async spawn() {
        this._browser = await puppeteer.launch();
        // Maybe do setup to preload a new page to gain time / have a set of open page to use
    }

    async kill() {
        await this._browser.close();
    }

    /*
    Scrapper examples
     */

    async getPageTitle() {
        const page = await this._browser.newPage();
        await page.goto('https://www.google.com');
        const title = await page.title();
        console.log(title);
    }

    async controlMobileKeyboard() {
        const page = await this._browser.newPage();

        await page.emulate(devices['iPhone X']);
        await page.goto('https://www.google.fr');
        await page.focus('#tsf > div:nth-child(2) > div.A7Yvie.emca > div.zGVn2e > div > div.a4bIc > input');
        await page.keyboard.type('i am typing using puppeteer !');
        await page.screenshot({ path: 'keyboard.png' });
    }

    async scrapLinks() {
        const page = await this._browser.newPage();
        await page.setExtraHTTPHeaders({Referer: 'https://sparktoro.com/'})
        await page.goto('https://sparktoro.com/trending');
        await page.waitForSelector('div.title > a');

        const stories = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('div.title > a'))
            return links.map(link => link.href).slice(0, 10)
        })

        console.log(stories);
    }
}

const scrapper = new Scrapper();
scrapper
    .spawn()
    .then(async () => {
        await scrapper.getPageTitle();
        await scrapper.controlMobileKeyboard();
        await scrapper.scrapLinks();
        await scrapper.kill();
    })
    .catch(console.error);