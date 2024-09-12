import PostToTwitter from "./PostToTwitter";
import ThreadCreator from "./ThreadCreator";

const PostSection = () => {
  return (
    <div className="grid lg:grid-cols-2 lg:grid-rows-1 grid-cols-1 grid-rows-3 lg:min-h-screen" id="main">
      <div className="bg-gray-300 grid justify-center p-8 lg:p-24 order-2 md:p-16 items-center row-span-2">
        <div className="border-4 border-gray-500 rounded-3xl p-6 md:pt-6 md:pb-6 md:pl-12 md:pr-12 lg:p-10 grid gap-6">
          <h2 className="text-blue-900 font-bold text-2xl font-serif">
            Paste the Link of Blog...
          </h2>
         <ThreadCreator />
          <PostToTwitter />
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
