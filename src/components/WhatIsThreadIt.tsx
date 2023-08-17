import heroImg from "../assets/logos/comp.png";
// import hashnode from "../assets/logos/logo-standard.svg";
import { useContext } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterFollowButton,
  TwitterHashtagButton,
  TwitterMentionButton,
  TwitterTweetEmbed,
  TwitterMomentShare,
  TwitterDMButton,
  TwitterVideoEmbed,
  TwitterOnAirButton,
} from "react-twitter-embed";
import { TwitterContext } from "./TwitterAuth";

const WhatIsThreadIt = () => {
  const { username } = useContext(TwitterContext);
  // bg-[url('./assets/transparent-grid-overlay-3.png')]
  return (
    <div className="h-98 flex flex-col md:p-12 p-6 bg-grid">
      <div className="grid md:grid-cols-2 lg:p-16 md:p-10">
        <div className="grid grid-cols-1 gap-y-2 md:text-6xl text-4xl md:font-bold font-semibold font-serif">
          <div className="">
            INTRODUCING <RoughNotation type="highlight" show={true} color="#1e3a8a" animate={true} animationDuration={3000} animationDelay={1000}><span className="text-white">THREAD IT</span></RoughNotation> :
          </div>
          <div>Simplify sharing</div>
          <div className="flex">
            <div className="mr-4 text-blue-900">hashnode</div>
            <div className="text-lg flex font-bold justify-center items-center md:bg-black md:text-white md:h-fit md:p-3 md:rounded-full">
              blogs
            </div>
          </div>
          <div className="flex">
            <div className="md:font-bold font-semibold flex justify-center items-center">on</div>
            <button className="twitterThread w-44">
              Twitter
            </button>
          </div>
        </div>
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName={username}
          options={{ height: 400 }}
          key={username}
        />
      </div>

      <div className="grid place-content-center lg:grid-cols-2 gap-6 grid-cols-1 md:mt-16 mt-6 bg-blue-400 rounded-md">
        <img src={heroImg} alt="" className="w-full" />
        <div className="flex flex-col justify-evenly p-10">
          <div className="mb-4 text-gray-800 font-semibold">
            <div className="font-bold text-lg text-black mb-2">
              Simplify Blog Sharing:
            </div>
            <div className="ml-3">
              {" "}
              Seamlessly convert your Hashnode blogs into captivating Twitter
              threads with Thread It's user-friendly interface and one-click
              posting.
            </div>
          </div>
          <div className="mb-4 text-gray-800 font-semibold">
            <div className="text-black font-bold text-lg mb-2">
              Time-Saving Solution:
            </div>
            <div className="ml-3">
              Say goodbye to the hassle of{" "}
              <span className="font-bold">copying and pasting.</span> Thread It
              automates the process, letting you focus on what you do best -
              creating exceptional content.
            </div>
          </div>
          <div className="mb-4 text-gray-800 font-semibold">
            <div className="text-black font-bold text-lg mb-2">
              Empower Your Voice:
            </div>
            <div className="ml-3">
              Share your ideas, knowledge, and stories with a wider audience on
              Twitter, <span className="font-bold">amplifying your reach</span>{" "}
              and impact across the platform.
            </div>
          </div>
          <button className="bg-BGColor text-white p-4 rounded-full w-48 float-left">
            Get Started for free
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatIsThreadIt;
