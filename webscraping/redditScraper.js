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
    await self.page.goto(SUBREDDIT_URL(subreddit + "/top", { waitUntil: 'networkidle0' }));
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

  getPostData: async (href) => {
    console.log(href)
    await self.goto(href + "?sort=top")
    // this grabs top level comments
    /*
      TODO: add functionality for grabbing the comment beneath if it is too short. 
      TODO: this can be done by checking length of the comment, if its too short, add the child, and so on down the line.
    */
    const topComments = await self.page.$$('.commentarea > .sitetable > div[class*="thing"]')

    const titleDiv = await self.page.waitForSelector('p[class*="title"]')
    const title = await self.page.evaluate(el => el.textContent, titleDiv)
    const authorA = await self.page.waitForSelector('a[class*="author"]')
    const OP = await self.page.evaluate(el => el.textContent, authorA)
    const commentDiv = await self.page.waitForSelector('a[class*="comments"]')
    const commentCount = await self.page.evaluate(el => el.textContent, commentDiv)
    const karmaDiv = await self.page.waitForSelector('div[class*="score"]')
    const karmaCount = await self.page.evaluate(el => el.textContent, karmaDiv)


    // scrape all the data
    const authors = await Promise.all(topComments.slice(0,20).map(async (el) => {
      return el.$eval(('a[class*="author"]'), node => {
        const text = node.innerText.trim()
        return text;
      })
    }))

    const topCommentBodies = await Promise.all(topComments.slice(0,20).map(async (el) => {
      return el.$eval('div[class*="md"]', node => {
        let text = node.innerText.trim()
        text = text.replace(/(\r\n|\n|\r)/gm, "");
        return text
      })
    }))

    const karma = await Promise.all(topComments.slice(0,20).map(async (el) => {
      return el.$eval('span[class*="score"]', node => {
        let text = node.innerText.trim()
        return text
      })
    }))

    const data = {
      authors,
      topCommentBodies,
      karmaArray: karma,
      title,
      originalPoster: OP,
      commentCount,
      originalKarma: karmaCount,
    }

    return data
  }
};

 
export default self;
