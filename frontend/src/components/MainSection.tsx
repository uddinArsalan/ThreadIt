import { useState, useContext } from "react";
// @ts-ignore
import * as cheerio from "cheerio";
import { auth } from "./TwitterAuth";
import { TwitterContext } from "./TwitterAuth";
import "../css/style.css";
import WhatIsThreadIt from "./WhatIsThreadIt";
import PaySection from "./PaySection";
import PostSection from "./PostSection";
import LastSection from "./LastSection";

interface Props {
  nav: boolean;
  userId: string | undefined;
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface sequenceObject {
  type: string;
  content: string;
}

const MainSection = ({ nav, userId, setUserId }: Props) => {
  const { logOut, signIn, writeUserData } = useContext(TwitterContext);
  const [url, setUrl] = useState<string>("");

  const [click, setClick] = useState<boolean>(false);
  const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const [sequenceArray, setSequenceArray] = useState<Set<sequenceObject>>(
    new Set()
  );

  const changeToThread = (url: string) => {
    setClick(true);
    fetch(url)
      .then((response: Response) => response.text())
      .then((html: string) => {
        const $ = cheerio.load(html);
        // const titleElement = $("title").text();
        const rootElement = $("body");
        let paragraphIndex = 0;
        let headingIndex = 0;
        let imageIndex = 0;
        let LiIndex = 0;
        let isTableContent = false;

        rootElement.find("*").each((index, element) => {
          const tagName = element.tagName;

          if (tagName === "img") {
            if (imageIndex > 1) {
              // For image elements, retrieve the source URL
              const src = $(element).attr("src");
              if (src && src.startsWith("h")) {
                setSequenceArray(
                  (seq) => new Set([...seq, { type: "img", content: src }])
                );
              }
            }
            imageIndex++;
          } else if (headingTags.includes(tagName)) {
            const textContent = $(element).text();
            // console.log(`Heading ${index + 1}: ${textContent}`);
            const tableContents = textContent.includes("Table");
            if (tableContents) {
              isTableContent = true;
              return;
            }
            if (headingIndex > 1) {
              setSequenceArray(
                (seq) =>
                  new Set([...seq, { type: "heading", content: textContent }])
              );
            }
            headingIndex++;
            // sequence.push({ type: 'heading', content: textContent });
          } else if (tagName == "code") {
            const textContent = $(element).text();
            setSequenceArray(
              (seq) => new Set([...seq, { type: "code", content: textContent }])
            );
          } else if (tagName == "p") {
            if (paragraphIndex !== 0) {
              // Skip the first iteration
              const textContent = $(element).text();
              setSequenceArray(
                (seq) =>
                  new Set([...seq, { type: "paragraph", content: textContent }])
              );
            }
            paragraphIndex++;
          } else if (tagName == "li") {
            const liElements = $(element).filter(function () {
              return $(this).children("p").length === 0;
            });
            const textContent = liElements.text();
            if (isTableContent) {
              if (LiIndex !== 0) {
                setSequenceArray(
                  (seq) =>
                    new Set([
                      ...seq,
                      { type: "paragraph", content: textContent },
                    ])
                );
              }
            } else {
              setSequenceArray(
                (seq) =>
                  new Set([...seq, { type: "paragraph", content: textContent }])
              );
            }
            LiIndex++;
          }
        });
      })
      .catch((error: Error) => console.log(error));
  };

  const handleClick = () => {
    writeUserData(userId, Array.from(sequenceArray));
  };

  return (
    <>
      {nav && (
        <div className="flex justify-center relative z-10 transition-opacity duration-75 lg:hidden">
          <div className="bg-blue-400 p-10 grid grid-rows-4 gap-2 place-content-center font-bold text-xl w-11/12 absolute top-0 h-72 rounded-md">
            <div className="hover:text-gray-900">What is ThreadIt ?</div>
            <div className="hover:text-gray-900">How It Works</div>
            <button
              className="text-LogIn border-2 border-BGColor rounded-3xl w-fit pl-4 pr-4 pt-2 pb-2 cursor-pointer"
              onClick={() => {
                signIn();
                setUserId(auth.currentUser?.uid);
              }}
            >
              Log In
            </button>
            <button
              className="bg-LogIn border-none text-white rounded-3xl w-fit pl-4 pr-4 pt-2 pb-2 cursor-pointer"
              onClick={() => {
                logOut;
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
      <WhatIsThreadIt />
      <PostSection
        url={url}
        setUrl={setUrl}
        changeToThread={changeToThread}
        writeUserData={writeUserData}
        userId={userId}
        sequenceArray={sequenceArray}
        click={click}
        postInDatabase = {handleClick}
      />

      <PaySection />

      {/* {Array.from(sequenceArray).map((element, index) => {
        return (
          <div key={index}>
            {element.type === "heading" ? (
              <div className="m-6 text-5xl font-bold">{element.content}</div>
            ) : element.type === "code" ? (
              <div className="flex justify-center">
                <div className="bg-black m-2 md:w-1/2 text-white p-16">
                  {element.content.split("\n").map((line, ind) => (
                    <div key={ind} className="my-2">
                      {line}
                    </div>
                  ))}{" "}
                </div>
              </div>
            ) : element.type == "img" ? (
              <div className="m-2">
                <img src={element.content} />
              </div>
            ) : element.type == "paragraph" ? (
              <div className="m-2 md:pl-16 text-lg ">{element.content}</div>
            ) : (
              " "
            )}
          </div>
        );
      })} */}

      {/* <PostToTwitter key={userId} click={handleClick} /> */}
      {/* <TwitterCode /> */}
      {/* <TwitterTimelineEmbed
                sourceType="profile"
                screenName="Arsalan_0101"
                options={{ height: 400 }}
            /> */}
      {/* {click && <TwitterShareButton
                url={url}
                options={{ text: body, via: 'Arsalan_0101' }}
            />} */}
      {/* <div className="bg-green-400 text-white p-4 w-48 cursor-pointer" onClick={() => writeUserData(userId,sequenceArray)}>Save Data</div> */}
      <LastSection />
    </>
  );
};

export default MainSection;
