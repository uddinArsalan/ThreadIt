import axios from "axios";
import { TwitterCredentials } from "../interfaces";

const API_SERVER_BASE_URL = import.meta.env.VITE_API_SERVER_BASE_URL;

export const useTweetPoster = (credentials: TwitterCredentials) => {
  const tokensObject = {
    accessToken: credentials.accessToken,
    secret: credentials.secret,
  };
  const postTweet = async (tweetContent: string) => {
    const response = await axios.post(`${API_SERVER_BASE_URL}/tweets`, {
      tweetContent,
      tokensObject,
    });
    return response.data.tweetId;
  };

  const uploadImage = async (imageUrl: string) => {
    const response = await axios.post(`${API_SERVER_BASE_URL}/upload`, {
      imageUrl,
      tokensObject,
    });
    const mediaId = response.data.mediaId;
    return mediaId;
  };

  const postTweetWithImage = async (
    mediaId: string,
    nextTweetContent: string
  ) => {
    const response = await axios.post(
      `${API_SERVER_BASE_URL}/uploadTweetImage`,
      {
        mediaId,
        tokensObject,
        nextTweetContent,
      }
    );
    const tweetId = response.data.tweetId;
    return tweetId;
  };

  const replyToTweet = async (tweetContent: string, parentTweetId: string) => {
    const response = await axios.post(`${API_SERVER_BASE_URL}/reply`, {
      parentTweetId,
      tokensObject,
      tweetContent,
    });
    const tweetId = response.data.tweetId;
    return tweetId;
  };

  const replyToTweetImage = async (
    tweetContent: string,
    parentTweetId: string,
    mediaId: string
  ) => {
    const response = await axios.post(`${API_SERVER_BASE_URL}/replyImage`, {
      tokensObject,
      tweetContent,
      parentTweetId,
      mediaId,
    });
    const tweetId = response.data.tweetId;
    return tweetId;
  };

  return {
    postTweet,
    uploadImage,
    postTweetWithImage,
    replyToTweet,
    replyToTweetImage,
  };
};
