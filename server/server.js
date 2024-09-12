import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_CORS_ORIGIN,
  })
);

app.get("/", (req, res) => {
  res.send("Server running successfully");
  console.log("Server running successfully");
});

app.post("/tweets", async (req, res) => {
  console.log("Tweets");
  const { tweetContent, tokensObject } = req.body;
  const secret = tokensObject.secret;
  const accessToken = tokensObject.accessToken;
  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: secret,
  });

  const v2Client = userClient.v2;
  try {
    const { data: createdTweet } = await v2Client.tweet(tweetContent);
    const tweetId = createdTweet.id;

    res.json({ tweetId });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: "Error posting tweet error" });
  }
});

app.post("/upload", async (req, res) => {
  console.log("Upload");
  const { imageUrl, tokensObject } = req.body;
  const secret = tokensObject.secret;
  const accessToken = tokensObject.accessToken;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: secret,
  });

  const v2Client = userClient.v2;
  const v1Client = userClient.v1;

  try {
    const imgData = await axios(imageUrl, { responseType: "arraybuffer" });
    const mediaId = await v1Client.uploadMedia(imgData.data, {
      mimeType: "image/jpeg",
    });
    res.json({ mediaId });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error posting image" });
  }
});

app.post("/uploadTweetImage", async (req, res) => {
  console.log("Upload Tweet Image");
  const { mediaId, tokensObject, nextTweetContent } = req.body;
  const secret = tokensObject.secret;
  const accessToken = tokensObject.accessToken;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: secret,
  });
  const v2Client = userClient.v2;
  try {
    const { data: createdTweet } = await v2Client.tweet(nextTweetContent, {
      media: { media_ids: [mediaId] },
    });
    // await v2Client.reply(createdTweet.data,previousTweetId)
    const tweetId = createdTweet.id;
    res.json({ tweetId });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error posting tweet with image" });
  }
});

app.post("/reply", async (req, res) => {
  console.log("Reply");
  const { parentTweetId, tokensObject, tweetContent } = req.body;
  const secret = tokensObject.secret;
  const accessToken = tokensObject.accessToken;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: secret,
  });

  const v2Client = userClient.v2;

  try {
    const { data: createdTweet } = await v2Client.reply(
      tweetContent,
      parentTweetId
    );

    const tweetId = createdTweet.id;
    res.json({ tweetId });
  } catch (error) {
    console.error("Error replying to tweet:", error);
    res.status(500).json({ error: "Error posting reply tweet" });
  }
});

app.post("/replyImage", async (req, res) => {
  console.log("Reply Image");
  const { tokensObject, tweetContent, parentTweetId, mediaId } = req.body;
  const secret = tokensObject.secret;
  const accessToken = tokensObject.accessToken;

  const userClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: accessToken,
    accessSecret: secret,
  });

  const v1Client = userClient.v1;

  try {
    const { data: createdTweet } = await v1Client.tweetThread([
      {
        status: tweetContent,
        media_ids: mediaId,
        in_reply_to_status_id: parentTweetId,
      },
    ]);
    const tweetId = createdTweet.id;
    res.json({ tweetId });
  } catch (error) {
    console.error("Error posting thread:", error);
    res.status(500).json({ error: "Error posting reply tweet" });
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
