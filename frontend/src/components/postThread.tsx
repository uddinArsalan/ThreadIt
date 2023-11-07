import { ref, onValue } from "firebase/database";
import { auth, db } from "./TwitterAuth";
import axios from "axios";
import { useState, useEffect } from "react";
import clsx from 'clsx'
interface sequenceObjectArray {
  type: string;
  content: string;
}
interface tokensObject {
  tokens: string;
  secrets: string;
}

interface sequenceObject {
  sequenceData: sequenceObjectArray[];
}

const PostToTwitter = ({ click }: any) => {
  const [tokensObject, setTokensObject] = useState<tokensObject>({
    tokens: "",
    secrets: "",
  });
  const [threadContentArray, setThreadContentArray] =
    useState<sequenceObject>();
  const [tweetIds, setTweetIds] = useState<string[]>([]);
  const [ statusTweet ,setStatusTweets] = useState("Post On Twitter");

  useEffect(() => {
    const tokenRef = ref(db, `tokens/${auth.currentUser?.uid}`);
    const threadContentRef = ref(db, `users/${auth.currentUser?.uid}`);
    onValue(threadContentRef, (snapshot) => {
      const content = snapshot.val();
      setThreadContentArray(content);
    });
    onValue(tokenRef, (snapshot) => {
      const data = snapshot.val();
      setTokensObject(data);
    });
  }, []);
  const MAX_CHARACTERS = 280;

  const postContent = async () => {
    setStatusTweets("Please Wait..")
    let nextTweetContent = "";
    let updatedTweetIds: string[] = [];
    // Iterate over the content array and post each element as a tweet
    try{
    if (threadContentArray) {
      const array = threadContentArray.sequenceData;
      for (let i = 0; i < array.length; i++) {
        let element = array[i];
        // console.log(element.type);
        if (element.content == "") {
          continue;
        }
        if (element.content.length >= 280) {
          const parts = splitTweetContent(element);
          for (let j = 0; j < parts.length; j++) {    
            // if (parts[j] == "") {
            //   continue;
            // }

            if (i == 0 && j == 0) {
              if (
                element.type === "paragraph" ||
                element.type === "code" ||
                element.type === "heading"
              ) {
                const tweetContent = parts[j];
                // console.log(tweetContent);
                console.log(`In i (${i}) == 0 && j (${j}) == 0`)
                nextTweetContent = tweetContent;
                let tweetId = await postTweet(tweetContent);
                updatedTweetIds.push(tweetId);
              } 
            }
              if (j == 0 && i != 0) {
                if (
                  element.type === "paragraph" ||
                  element.type === "code" ||
                  element.type === "heading"
                ) {
                  const tweetContent = parts[j];
                  // console.log(tweetContent);
                  console.log(`In j ${j} == 0 && i ${i} != 0`)
                  nextTweetContent = tweetContent;
                  // console.log(updatedTweetIds[j - 1]);
                  let tweetId = await replyToTweet(
                    tweetContent,
                    updatedTweetIds[updatedTweetIds.length - 1]
                  );
                  updatedTweetIds.push(tweetId);
                }
              }
            
            if (updatedTweetIds.length >= 1 && j >= 1) {
              const tweetContent = parts[j];
              console.log(`In j ${j} >= 1`);
              nextTweetContent = tweetContent;
              // console.log(updatedTweetIds[j - 1]);
              let tweetId = await replyToTweet(
                tweetContent,
                updatedTweetIds[updatedTweetIds.length - 1]
              );
              updatedTweetIds.push(tweetId);
            }
          }
        } else {
          // console.log(i, updatedTweetIds); // Here getting 1,[] then 2,[] and so on ... so only first image is posted without posting other tweets since tweetIds array is not updated or getting updated array in this postContent async function

          if (i == 0) {
            if (
              element.type === "paragraph" ||
              element.type === "code" ||
              element.type === "heading"
            ) {
              // console.log("Real Image uploaded")
              let tweetContent = element.content;
              nextTweetContent = tweetContent;
              let tweetId = await postTweet(tweetContent);
              updatedTweetIds.push(tweetId);
            }

            // Handle image elements
            else if (element.type === "img") {
              let imageUrl = element.content;
              let mediaId = await uploadImage(imageUrl);
              let tweetId = await postTweetWithImage(mediaId, nextTweetContent);
              updatedTweetIds.push(tweetId);
            }
          }
          if (updatedTweetIds.length >= 1 && i >= 1) {
            if (
              element.type === "paragraph" ||
              element.type === "code" ||
              element.type === "heading"
            ) {
              let tweetContent = element.content;
              nextTweetContent = tweetContent;
              // await sleep(1000); // Add a delay to ensure tweetIds state is updated
              let tweetId = await replyToTweet(
                tweetContent,
                updatedTweetIds[updatedTweetIds.length - 1]
              );
              updatedTweetIds.push(tweetId);
              // console.log(updatedTweetIds);
              // console.log(updatedTweetIds[i-1]);
            }

            // Handle image elements
            else if (element.type === "img") {
              // console.log("Image Type")
              let imageUrl = element.content;
              let mediaId = await uploadImage(imageUrl);
              // await postTweetWithImage(mediaId, nextTweetContent);
              // await sleep(1000);
              let tweetId = await replyToTweetImage(
                nextTweetContent,
                updatedTweetIds[updatedTweetIds.length - 1],
                mediaId
              );
              updatedTweetIds.push(tweetId);
            }
          }
        }
      }
      setTweetIds((prevIds) => [...prevIds, ...updatedTweetIds]);
    } 
    setStatusTweets("Successfully Posted")
  }
    catch(error){
      setStatusTweets("Error Posting Tweets.")
    }
  };

  function splitTweetContent(tweetContent: sequenceObjectArray) {
    const parts = [];
    let currentIndex = 0;

    while (currentIndex < tweetContent.content.length) {
      // Extract the next 280 characters or less
      const part = tweetContent.content.substr(currentIndex, MAX_CHARACTERS);
      // Add the part to the array
      parts.push(part);
      // Move the current index to the next position
      currentIndex += MAX_CHARACTERS;
    }

    return parts;
  }

  const handleClick = () => {
    postContent();
  };

  const postTweet = async (tweetContent: string) => {
    const response = await axios.post("https://thread-it-server.onrender.com/tweets", {
      tweetContent,
      tokensObject: tokensObject.tokens,
    });
    const tweetId = response.data.tweetId;
    // setTweetIds((prevId) => [...prevId, tweetId]);
    return tweetId;
  };

  const uploadImage = async (imageUrl: string) => {
    const response = await axios.post("https://thread-it-server.onrender.com/upload", {
      imageUrl,
      tokensObject: tokensObject.tokens,
    });
    const mediaId = response.data.mediaId;
    return mediaId;
  };

  const postTweetWithImage = async (
    mediaId: string,
    nextTweetContent: string
  ) => {
    const response = await axios.post(
      "https://thread-it-server.onrender.com/uploadTweetImage",
      { mediaId, tokensObject: tokensObject.tokens, nextTweetContent }
    );
    const tweetId = response.data.tweetId;
    // setTweetIds((prevId) => [...prevId, tweetId]);
    return tweetId;
  };

  const replyToTweet = async (tweetContent: string, parentTweetId: string) => {
    // console.log(parentTweetId, tweetIds);
    const response = await axios.post("https://thread-it-server.onrender.com/reply", {
      parentTweetId,
      tokensObject: tokensObject.tokens,
      tweetContent,
    });
    const tweetId = response.data.tweetId;
    // setTweetIds((prevId) => [...prevId, tweetId]);
    return tweetId;
  };

  const replyToTweetImage = async (
    tweetContent: string,
    parentTweetId: string,
    mediaId: string
  ) => {
    // replyToTweetImage
    const response = await axios.post("https://thread-it-server.onrender.com/replyImage", {
      tokensObject,
      tweetContent,
      parentTweetId,
      mediaId,
    });
    const tweetId = response.data.tweetId;
    // setTweetIds((prevId) => [...prevId, tweetId]);
    return tweetId;
  };
  
  return (
    <div>
      <div onClick={click} className="bg-blue-900 w-fit p-4 rounded-md m-6 cursor-pointer text-white text-sm font-semibold">
        Post Thread
      </div>
      <div
        onClick={handleClick}
        className={clsx("bg-blue-900 w-fit p-4 m-6 cursor-pointer rounded-md text-white font-semibold text-sm",{"bg-green-600" : statusTweet == "Successfully Posted"},{"bg-red-600" : statusTweet == "Error Posting Tweets."})}
      >
        {statusTweet}
      </div>
    </div>
  );
};

export default PostToTwitter;
