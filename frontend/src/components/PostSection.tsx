import { ChangeEvent } from "react";
import PostToTwitter from "./postThread";

const PostSection = ({
  setUrl,
  url,
  changeToThread,
  sequenceArray,
  writeUserData,
  userId,
  click,
  postInDatabase
}: any) => {
  return (
    <div className="grid lg:grid-cols-2 lg:grid-rows-1 grid-cols-1 grid-rows-3 lg:min-h-screen">
      <div className="bg-gray-300 grid justify-center p-8 lg:p-24 order-2 md:p-16 items-center row-span-2">
        <div className="border-4 border-gray-500 rounded-3xl p-6 md:pt-6 md:pb-6 md:pl-12 md:pr-12 lg:p-10 grid">
          <div className="text-blue-900 font-bold text-2xl font-serif">
            Paste the Link of Blog...
          </div>
          <div>
            <input
              type="text"
              name="url"
              id=""
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              className="p-4 mt-6 mb-2 placeholder:italic placeholder:text-slate-400 bg-white border-slate-300 rounded-md shadow-sm focus:outline-none focus:border-BGColor focus:bg-slate-100 focus:ring-1 sm:text-sm"
              placeholder="Paste here ..."
            />
            <button
              className="text-white bg-blue-900 p-3 rounded-md"
              onClick={() => {
                changeToThread(url);
                // createTwitterThread(content)
                writeUserData(userId, Array.from(sequenceArray));
              }}
            >
              Submit
            </button>
          </div>
        <PostToTwitter key={userId} click={postInDatabase} />
        </div>
      </div>
      <div className="bg-gray-900 flex justify-center lg:p-24 p-12 lg:order-2">
        <div className="text-green-500 grid grid-cols-1 font-bold leading-tight text-4xl italic underline">
          <div>
            Post Your Blogs and convert it in <br />{" "}
            <button className="twitterThread mt-12">Twitter Thread</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSection;
