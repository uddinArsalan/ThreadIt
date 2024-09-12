import { useFirebase } from "../context/FirebaseProvider";
import { useState } from "react";
import { useCallback, useMemo } from "react";
import { useTweetPoster } from "../hooks/useTweetPoster";
import toast from "react-hot-toast";

const MAX_TWEET_LENGTH = 280;
const PostToTwitter = () => {
  const { threadContentArray, getTwitterCredentials, currentUser } =
    useFirebase();
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">(
    "idle"
  );

  const splitTweetContent = useCallback((content: string): string[] => {
    const parts: string[] = [];
    for (let i = 0; i < content.length; i += MAX_TWEET_LENGTH) {
      parts.push(content.slice(i, i + MAX_TWEET_LENGTH));
    }
    return parts;
  }, []);

  const postTweetOnTwitter = useCallback(async () => {
    setStatus("pending");
    const updatedTweetIds: string[] = [];

    try {
      const { accessToken, secret } = await getTwitterCredentials(
        currentUser?.uid || ""
      );
      const {
        postTweet,
        postTweetWithImage,
        replyToTweet,
        replyToTweetImage,
        uploadImage,
      } = useTweetPoster({ accessToken, secret });
      for (const element of threadContentArray) {
        if (!element.content) continue;

        const contentParts =
          element.content.length > MAX_TWEET_LENGTH
            ? splitTweetContent(element.content)
            : [element.content];

        for (const [index, part] of contentParts.entries()) {
          const isFirstTweet = updatedTweetIds.length === 0;
          const isTextContent = ["paragraph", "code", "heading"].includes(
            element.type
          );

          if (isFirstTweet) {
            if (isTextContent) {
              const tweetId = await postTweet(part);
              updatedTweetIds.push(tweetId);
            } else if (element.type === "img") {
              const mediaId = await uploadImage(part);
              const tweetId = await postTweetWithImage(mediaId, "");
              updatedTweetIds.push(tweetId);
            }
          } else {
            const parentTweetId = updatedTweetIds[updatedTweetIds.length - 1];
            if (isTextContent) {
              const tweetId = await replyToTweet(part, parentTweetId);
              updatedTweetIds.push(tweetId);
            } else if (element.type === "img") {
              const mediaId = await uploadImage(part);
              const tweetId = await replyToTweetImage(
                "",
                parentTweetId,
                mediaId
              );
              updatedTweetIds.push(tweetId);
            }
          }
        }
      }
      setStatus("done");
      toast.success("Your thread has been posted to Twitter.")
    } catch (error) {
      console.error("Error posting tweets:", error);
      setStatus("error");
      toast.error("Failed to post your thread to Twitter.")
    }
  }, [
    threadContentArray,
    splitTweetContent,
    getTwitterCredentials,
    currentUser,
  ]);

  const buttonText = useMemo(() => {
    switch (status) {
      case "idle":
        return "Post on Twitter";
      case "pending":
        return "Posting...";
      case "done":
        return "Posted Successfully";
      case "error":
        return "Error Posting Tweets";
    }
  }, [status]);

  const buttonClass = useMemo(() => {
    switch (status) {
      case "idle":
        return "bg-blue-900";
      case "pending":
        return "bg-yellow-500";
      case "done":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
    }
  }, [status]);

  const postTwitterThread = async () => {
    await postTweetOnTwitter();
  };

  return (
    <div>
      <button
        onClick={postTwitterThread}
        disabled={status === "pending" || status === "done"}
        className={`w-full text-white p-3 rounded-md transition duration-300 ease-in-out ${buttonClass} disabled:opacity-50`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PostToTwitter;
