// const Twitter = require('twitter-lite')
const { TwitterApi } = require('twitter-api-v2');
const express = require("express");
// const Twit = require("twit");
const axios = require('axios')
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors(
  {
    origin : ["https://thread-it-one.vercel.app/"],
    methods : ["POST", "GET"],
    credentials : true
  }
));
app.use(express.json());

app.post("/tweets", async (req, res) => {
  console.log("Tweets")
  const { tweetContent, tokensObject} = req.body;
  const accessTokenSecret = tokensObject.secrets;
  const accessToken = tokensObject.tokens;

  // if (tweetContent.length > 280) {
  //   res.status(400).json({ error: 'Tweet content exceeds the character limit' });
  //   return;
  // }

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });

  const v2Client = userClient.v2;
  // Use the accessToken and accessTokenSecret to make API requests to Twitter's API;
  try {
    // Make API request to post a tweet and return the tweet ID
    const { data: createdTweet } = await v2Client.tweet(tweetContent);
    const tweetId = createdTweet.id;
    // await v2Client.reply(tweetContent,previousTweetId)
    // console.log(typeof tweetId)
    res.json({tweetId})
    // client.post(
    //   "statuses/update",
    //   { status: tweetContent },
    //   function (err, data, response) {
    //     const tweetId = data.id_str;
    //     console.log(data);
    //     // console.log(response)
    //     // console.log(tweetId)
    //     res.json({ tweetId });
    //   }
    // );
    // const response = await twitterClient.post('statuses/update', { status: tweetContent,auto_populate_reply_metadata: true });
    // console.log('Why it is haappening')
    // const tweetId = response.data.id_str;
    // res.json({ tweetId });
  } catch (error) {
    // Handle error cases
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: "Error posting tweet error" });
  }
});

app.post('/upload', async(req,res) => {
  console.log("Upload")
  const { imageUrl, tokensObject } = req.body;
  const accessTokenSecret = tokensObject.secrets;
  const accessToken = tokensObject.tokens;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });

  const v2Client = userClient.v2;
  const v1Client = userClient.v1;

  try{
    const imgData = await axios(imageUrl, { responseType: 'arraybuffer' });
    const mediaId = await v1Client.uploadMedia(imgData.data, {mimeType : 'image/jpeg'});
    res.json({mediaId});

  } catch(error){
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error posting image" });
  }
})

app.post("/uploadTweetImage", async (req, res) => {
  console.log("Upload Tweet Image")
  const { mediaId, tokensObject, nextTweetContent } = req.body;
  const accessTokenSecret = tokensObject.secrets;
  const accessToken = tokensObject.tokens;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });
  const v2Client = userClient.v2;
  try {
    // Make API request to upload an image and return the media ID
    const { data: createdTweet } = await v2Client.tweet(nextTweetContent, {media: {  media_ids: [mediaId] }});
    // await v2Client.reply(createdTweet.data,previousTweetId)
    const tweetId = createdTweet.id;
    res.json({tweetId});
    
  } catch (error) {
    // Handle error cases
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error posting tweet with image" });
  }
});


app.post("/reply", async (req, res) => {
  console.log("Reply")
  const { parentTweetId, tokensObject, tweetContent } = req.body;
  console.log(parentTweetId)
  const accessTokenSecret = tokensObject.secrets;
  const accessToken = tokensObject.tokens;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });

  const v2Client = userClient.v2;
  
  try {
    // Make API request to reply to a tweet and link it to the parent tweet using the in_reply_to_status_id parameter
    const {data : createdTweet} = await v2Client.reply(tweetContent,parentTweetId)
      
    const tweetId = createdTweet.id
    res.json({tweetId});

  } catch (error) {
    // Handle error cases
    console.error("Error replying to tweet:", error);
    res.status(500).json({ error: "Error posting reply tweet" });
  }
});

app.post('/replyImage',async (req,res) => {
  console.log("Reply Image")
  const {tokensObject, tweetContent,parentTweetId,mediaId } = req.body;
  const accessTokenSecret = tokensObject.secrets;
  const accessToken = tokensObject.tokens;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: accessTokenSecret,
  });

  const v1Client = userClient.v1;

  try{

    const {data : createdTweet} = await v1Client.reply(tweetContent,parentTweetId,{ media_ids: mediaId });
    const tweetId = createdTweet.id;
    res.json({tweetId});
  } 
  catch(error) {
    console.error("Error posting thread:", error);
    res.status(500).json({ error: "Error posting reply tweet" });
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
