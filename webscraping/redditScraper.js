import puppeteer from 'puppeteer';

const SUBREDDIT_URL = (subreddit) => `https://old.reddit.com/r/${subreddit}`;
const self = {
  browser: null,
  page: null,
  init: async (subreddit) => {
    // console.log(init);
    self.browser = await puppeteer.launch({
      headless: true,
    });
    self.page = await self.browser.newPage();

    // go to the subreddit
    await self.page.goto(SUBREDDIT_URL(subreddit, { waitUntil: 'networkidle0' }));
  },
  getResults: async (nr) => {
    
    let elements = await self.page.$$('#siteTable > div[class*="thing"]');

    const links = await self.page.$$eval('p[class="title"] > a', as => as.map(a => a.href));


    const titles = await Promise.all(elements.map(async (element, i) => {
      return await element.$eval(('p[class="title"]'), node => {
        const text = node.innerText.trim()
        return text.slice(0, text.length - 16)
      });
    }));

    return {
      links,
      titles,
    }
  },
  screenshotQuestion: async (index, postObject) => {
    await self.page.goto(postObject.links[index], { waitUntil: 'networkidle0'})
    await self.page.screenshot({path: 'page-screenshot.png'})
  }
};

 
export default self;
