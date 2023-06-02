import { getDatabase, ref, onValue } from "firebase/database";
import { auth, db } from "./TwitterAuth";
import axios from "axios";
import { create } from 'zustand'
import { useState, useEffect } from 'react';
interface sequenceObjectArray {
  type: string;
  content: string;
}
interface tokensObject {
  tokens: string;
  secrets: string;
}

interface tweetArrayInterface {
  tweetIds: string[]
  setTweetId: (tweetId: string) => void
}

interface sequenceObject {
  sequenceData: sequenceObjectArray[]
}

const PostToTwitter = ({ click }: any) => {
  const [tokensObject, setTokensObject] = useState<tokensObject>({
    tokens: "",
    secrets: ""
  });
  const [threadContentArray, setThreadContentArray] = useState<sequenceObject>();
  const [tweetIds, setTweetIds] = useState<string[]>([]);
  // const useStore = create<tweetArrayInterface>()((set) => ({
  //   tweetIds: [],
  //   setTweetId: (tweetId) => set((state) => ({ tweetIds: [...state.tweetIds, tweetId] })),
  // }))

  // const setTweetIds = useStore((state) => state.setTweetId);
  // const tweetIds = useStore((state) => state.tweetIds)

  useEffect(() => {
    const tokenRef = ref(db, `tokens/${auth.currentUser?.uid}`);
    const threadContentRef = ref(db, `users/${auth.currentUser?.uid}`);
    onValue(threadContentRef, (snapshot) => {
      const content = snapshot.val();
      setThreadContentArray(content);
    })
    onValue(tokenRef, (snapshot) => {
      const data = snapshot.val();
      setTokensObject(data)
    });
  }, []);
  const MAX_CHARACTERS = 280;

  const postContent = async () => {
    let nextTweetContent = ''
    // Iterate over the content array and post each element as a tweet
    if (threadContentArray) {
      const array = threadContentArray.sequenceData
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        console.log(element.type);
        if (element.content.length >= 280) {
          const parts = splitTweetContent(element);
          for (let j = 0; j < parts.length; j++) {
            const ele = parts[j];
            if (element.type === 'paragraph' || element.type === 'code' || element.type === 'heading') {
              const tweetContent = ele;
              nextTweetContent = tweetContent
              const tweetId: string = await postTweet(tweetContent);
              if(tweetId){
                setTweetIds((prevId) => [...prevId,tweetId])
              }
              // setTweetIds((prevIds : string[]) => {
              //   return [...prevIds, tweetId]
              // });
            }
            if (j > 0) {
              const tweetContent = ele;
              await replyToTweet(tweetIds[j - 1], tweetContent);
            }

          }
        }

        else {

          if (element.type === 'paragraph' || element.type === 'code' || element.type === 'heading') {
            // console.log('text')
            const tweetContent = element.content;
            nextTweetContent = tweetContent;
            const tweetId: string = await postTweet(tweetContent);
            if(tweetId){
              setTweetIds((prevId) => [...prevId,tweetId])
            }
            // setTweetIds((prevIds: string[]) => {
            //   return [...prevIds, tweetId]
            // });
            console.log(tweetId,tweetIds)
          }

          // Handle image elements
          else if (element.type === 'img') {
            const imageUrl = element.content;
            const mediaId = await uploadImage(imageUrl);
            const tweetId : string = await postTweetWithImage(mediaId, nextTweetContent);
            // setTweetIds((prevIds: string[]) => {
            //   return [...prevIds, tweetId]
            // });
            if(tweetId){
              setTweetIds((prevId) => [...prevId,tweetId])
            }
            console.log(mediaId,tweetId,tweetIds)
          }

          // Maintain the sequence by using the tweet IDs and in_reply_to_status_id parameter
          if (i > 0) {
            const tweetContent = element.content;
            console.log(tweetIds[i - 1])
            await replyToTweet(tweetIds[i - 1], tweetContent);
          }
          // Handle text elements
        }

      }
    }
  }

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

  console.log(tweetIds)

  const handleClick = () => {
    postContent()
  }

  const postTweet = async (tweetContent: string) => {
    const response = await axios.post('http://localhost:3000/tweets', { tweetContent, tokensObject: tokensObject.tokens })
    const tweetId = response.data.tweetId;
    console.log(tweetId)
    return tweetId
  };

  const uploadImage = async (imageUrl: string) => {
    const response = await axios.post('http://localhost:3000/upload', { imageUrl, tokensObject: tokensObject.tokens })
    const mediaId = response.data.mediaId;
    console.log(mediaId)
    return mediaId
  };

  const postTweetWithImage = async (mediaId: string, nextTweetContent: string) => {
    const response = await axios.post('http://localhost:3000/uploadTweetImage', { mediaId, tokensObject: tokensObject.tokens, nextTweetContent })
    const tweetId = response.data.tweetId;
    console.log(tweetId)
    return tweetId
  };

  const replyToTweet = async (parentTweetId: string, tweetContent: string) => {
    console.log(parentTweetId)
    const response = await axios.post('http://localhost:3000/reply', { parentTweetId, tokensObject: tokensObject.tokens, tweetContent })
    const replyId = response.data.replyId;
    console.log(replyId)
    return replyId
  };

  const setId = (tweetId : string) => {
    setTweetIds((prevId) => [...prevId,tweetId])
  }

  return (
    <div>
      <div onClick={click} className="bg-blue-200 w-48 p-6 m-6 cursor-pointer">Post Thread </div>
      <div onClick={handleClick} className="bg-blue-200 w-48 p-6 m-6 cursor-pointer">Now Post On Twitter</div>
      <div className="bg-blue-200 w-48 p-6 m-6 cursor-pointer" onClick={() => setId(crypto.randomUUID())}>Set Id</div>
    </div>
  )
};

export default PostToTwitter;
