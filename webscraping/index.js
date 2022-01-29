import reddit from './redditScraper.js'
import { sleep } from './sleep.js'
import { writePostDataToCSV } from './csvWriter.js'



// const gotoReddit = async (sr) => {

//   await reddit.init(sr);

//   let results = await reddit.getResults(10)
//   console.log(results)
//   sleep(100)
  
// }

// const grabScreenShotOfPage = async (subreddit) => {
//   await reddit.init(subreddit);
//   let results = await reddit.getResults(10)
//   console.log(results)
//   sleep(100)
//   await reddit.screenshotQuestion(0, results)
// }

// grabScreenShotOfPage('askreddit');


const scrapeAndWritePostToFile = async (subreddit) => {
  await reddit.init(subreddit)
  console.log('HERE')
  let results = await reddit.getTopPosts(1)
  // sleep(300)
  // console.log(results)
  const postData = await reddit.getPostData(results.links[0])
  writePostDataToCSV(postData)
}
scrapeAndWritePostToFile('askreddit')
