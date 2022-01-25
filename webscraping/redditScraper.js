import puppeteer from 'puppeteer';
import csv from 'csv-parser';

const SUBREDDIT_URL = (subreddit) => `https://old.reddit.com/r/${subreddit}`;
const self = {
  browser: null,
  page: null,
  init: async (subreddit) => {
    // console.log(init);
    self.browser = await puppeteer.launch({
      headless: false
    });
    self.page = await self.browser.newPage();

    // go to the subreddit
    await self.page.goto(SUBREDDIT_URL(subreddit, { waitUntil: 'networkidle0' }));
  },
  getTopPosts: async (numResults) => {
    
    let elements = await self.page.$$('#siteTable > div[class*="thing"]');

    const links = await self.page.$$eval('p[class="title"] > a', as => as.map(a => a.href));


    const titles = await Promise.all(elements.map(async (element, i) => {
      return await element.$eval(('p[class="title"]'), node => {
        const text = node.innerText.trim()
        return text.slice(0, text.length - 16)
      });
    }));

    return {
      links: links.slice(0, numResults),
      titles: titles.slice(0, numResults),
    }
  },
  goto: async (href) => {
    await self.page.goto(href, { waitUntil: 'networkidle0'});
  },
  screenshotQuestion: async (index, postObject) => {
    await self.page.goto(postObject.links[index], { waitUntil: 'networkidle0'})
    await self.page.screenshot({path: 'newestVideo/page-screenshot.png'})
  },

  getTitleAndTopTenResponses: async (href) => {
    await self.goto(href)
    // this grabs top level comments
    const topComments = await self.page.$$('.commentarea > .sitetable > div[class*="thing"]')


    const authors = await Promise.all(topComments.slice(0,1).map(async (el) => {
      return el.$eval(('a[class*="author"'), node => {
        const text = node.innerText.trim()
        return text;
      })
    }))

    console.log(authors)
    

    // fields for CSV file
    // comment :string representing the comment
    // score: score
    // author: author of the parent comment
    // child1: string the comment
    //

    return authors

  }
};

 
export default self;
