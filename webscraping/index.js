import reddit from './redditScraper.js'
import { sleep } from './sleep.js'



const gotoReddit = async (sr) => {

  await reddit.init(sr);

  let results = await reddit.getResults(10)
  console.log(results)
  sleep(100)
  
}

const grabScreenShotOfPage = async (subreddit) => {
  await reddit.init(subreddit);
  let results = await reddit.getResults(10)
  sleep(100)
  await reddit.screenshotQuestion(0, results)
}

grabScreenShotOfPage('askreddit');
