import heroImg from "../assets/logos/comp.png";
import { RoughNotation } from "react-rough-notation";
import { Link } from "react-scroll";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useFirebase } from "../context/FirebaseProvider";

const WhatIsThreadIt = () => {
  const { username } = useFirebase();

  return (
    <div className="min-h-screen bg-grid bg-white">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
              INTRODUCING{" "}
              <RoughNotation
                type="highlight"
                show={true}
                color="#1e3a8a"
                animate={true}
                animationDuration={3000}
                animationDelay={1000}
              >
                <span className="text-white">THREAD IT</span>
              </RoughNotation>
            </h1>
            <p className="text-4xl md:text-6xl font-semibold text-gray-800">
              Simplify sharing
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-4xl md:text-6xl font-semibold text-blue-900">hashnode</span>
              <span className="bg-black text-white text-xl md:text-2xl px-4 py-2 rounded-full">
                blogs
              </span>
            </div>
            <p className="text-4xl md:text-6xl font-semibold text-gray-800 flex items-center">
              on
              <button className="ml-4 bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-2xl md:text-3xl">
                Twitter
              </button>
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName={username}
              options={{ height: 400 }}
              key={username}
            />
          </div>
        </div>

        <div className="bg-blue-400 rounded-lg shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="w-full h-64 md:h-full">
              <img src={heroImg} alt="Thread It Hero" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:p-12 space-y-8">
              <Feature
                title="Simplify Blog Sharing"
                description="Seamlessly convert your Hashnode blogs into captivating Twitter threads with Thread It's user-friendly interface and one-click posting."
              />
              <Feature
                title="Time-Saving Solution"
                description="Say goodbye to the hassle of copying and pasting. Thread It automates the process, letting you focus on what you do best - creating exceptional content."
              />
              <Feature
                title="Empower Your Voice"
                description="Share your ideas, knowledge, and stories with a wider audience on Twitter, amplifying your reach and impact across the platform."
              />
              <Link
                activeClass="active"
                to="main"
                spy={true}
                smooth={true}
                duration={500}
                className="inline-block"
              >
                <button className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-xl">
                  Get Started for free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="text-lg text-gray-800">{description}</p>
    </div>
  );
};

export default WhatIsThreadIt;