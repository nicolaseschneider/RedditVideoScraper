import { createObjectCsvWriter }from 'csv-writer';

const commentWriter = createObjectCsvWriter({
    path: '../videoCreation/commentData.csv',
    header: [
        {id: 'commentId', title: 'CommentID'},
        {id: 'authorName', title: 'AuthorName'},
        {id: 'karma', title: 'Karma'},
        {id: 'postBody', title: 'Post Body'},
    ]
});
const postWriter = createObjectCsvWriter({
    path: '../videoCreation/postData.csv',
    header: [
        {id: 'authorName', title: 'AuthorName'},
        {id: 'karma', title: 'Karma'},
        {id: 'title', title: 'Title'},
        {id: 'commentCount', title: 'commentCount'},
    ]
})
const parseIncomingData = (postDataObject) => {
    const {
        authors,
        topCommentBodies,
        karmaArray,
        originalPoster,
        commentCount,
        title,
        originalKarma,
    } = postDataObject

    const resultingData = []

    for (let i = 0; i < authors.length; i++) {
        const data = {
            authorName: authors[i],
            karma: karmaArray[i],
            commentId: authors[i] + "-" + karmaArray[i] + "-" + String(i),
            postBody: topCommentBodies[i]
        }
        resultingData.push({...data})
    }

    const postData = [{
        authorName: originalPoster,
        commentCount,
        title,
        karma: originalKarma,
    }]
    return {
        commentData: resultingData,
        postData,
    }
}

export const writePostDataToCSV = (postData) => {
    // TODO
    /*
        TODO: at some point down the road, Either put this in an s3 bucket, or write it to a database.
    */
    const parsedData = parseIncomingData(postData);
    postWriter
        .writeRecords(parsedData.postData)
        .then(() => {
            console.log('Post Data has been written to file successfully!')
        })
        .catch((e) => console.log('ERROR WRITING POST TO CSV FILE: ', e))

    commentWriter
        .writeRecords(parsedData.commentData)
        .then(() => console.log('Comment Data has been written to file successfully!'))
        .catch((e) => console.log('ERROR WRITING COMMENTS TO CSV FILE: ', e))
}
