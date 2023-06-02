import { ChangeEvent, useEffect, useState } from "react";
// import Content from "./Content";
// @ts-ignore
import * as cheerio from "cheerio";
// import TwitterCode from "./TwitterCode";
import { auth, logOut } from "./TwitterAuth";
import { signIn, writeUserData } from "./TwitterAuth";
import PostToTwitter from "./postThread";
// import TwitterCard from "./TwitterCard";
// import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';

interface Props {
    nav: boolean;
    userId : string | undefined;
    setUserId :React.Dispatch<React.SetStateAction<string | undefined>>
}

interface sequenceObject {
    type: string;
    content: string;
}

const MainSection = ({ nav ,userId,setUserId}: Props) => {
    // client_id : cmt0SGZlR1RpQ1RVT3FNUzVyTF86MTpjaQ
    // client_secret : HRmh4yUT_uH_dn7RNl8D_wGr28GorIydyotAxBuqRswioz81Lz
    // Bearer Token : AAAAAAAAAAAAAAAAAAAAAN%2F%2FmgEAAAAAhLBNaWtUnYRWl77bHMLoCzAVFTM%3DXkpInKjxrysTB9LaYgjJ3s8r4MVujvBYrttxtBCfdSkeZBLazw
    // Access Token : 1509424906576236547-trZRxVzOGa78sXNYf1bylpb1NztAjq
    // Access Token Secret : HrEYWMuDUC26a9c0dmSXw9T9mC1iJYWeOAQTJxodbGH7H
    // Consumer API Key : RDrrj6qgSQriGcegFs9HQ6g3I
    // Consumer API Key Secret : X5ZHLem3SHyoyVWoENFvTM8YTgJEnK4yqTvf6zbJAvRfnwGKVo
    // const [title, setTitle] = useState<string | null>(null);
    // const [body, setBody] = useState<string | null>(null);
    const [url, setUrl] = useState<string>("");
    // const [codeText, setCodeText] = useState<string[]>([]);
    // const [imageArr, setImageArr] = useState<string[]>([]);
    const [click, setClick] = useState<boolean>(false);
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const [sequenceArray, setSequenceArray] = useState<sequenceObject[]>([])

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
                rootElement.find("*").each((index, element) => {
                    const tagName = element.tagName;

                    if (tagName === "img") {
                        if(imageIndex > 1){
                            // For image elements, retrieve the source URL
                            const src = $(element).attr("src");
                            if (src && src.startsWith("h")) {
                                // console.log(`Image ${index + 1}: ${src}`);
                                // sequence.push({ type: 'img', content: src });
                                setSequenceArray((seq) => [...seq, { type: 'img', content: src }])
                            }
                        }
                        imageIndex ++;
                    }
                    else if (headingTags.includes(tagName)) {
                        const textContent = $(element).text();
                        // console.log(`Heading ${index + 1}: ${textContent}`);
                        const tableContents = textContent.includes('Table');
                        if(tableContents){
                            return;
                        }
                        if(headingIndex > 1){
                            setSequenceArray((seq) => [...seq, { type: 'heading', content: textContent }])
                        }
                        headingIndex ++;
                        // sequence.push({ type: 'heading', content: textContent });
                    }
                    else if (tagName == 'code') {
                        const textContent = $(element).text();
                        // console.log(`Code ${index}: ${textContent}`);
                        // sequence.push({ type: 'code', content: textContent });
                        setSequenceArray((seq) => [...seq, { type: 'code', content: textContent }])
                    }
                    else if (tagName == 'p') {
                        if (paragraphIndex !== 0) { // Skip the first iteration
                            const textContent = $(element).text();
                            // console.log(`Paragraph ${index}: ${textContent}`);
                            // sequence.push({ type: 'paragraph', content: textContent });
                            setSequenceArray((seq) => [...seq, { type: 'paragraph', content: textContent }])
                        }
                        paragraphIndex++;
                    }
                });
                // const bodyElement = $("p:not(:first)").text();
                // const code = $('pre').text();
                // const codeTemplate = $("pre code").toArray();
                // console.log(codeTemplate)
                // codeTemplate.forEach((ele) => {
                    // console.log($(ele).text())
                    // setCodeText((prevCodeText) => [...prevCodeText, $(ele).text()]);
                // });

                // const images = $("img").toArray();
                // const filteredImages = images.filter((element) => {
                //     return element.attribs.src.startsWith("h");
                // });
                // filteredImages.forEach((element) => {
                //     setImageArr((prev) => [...prev, element.attribs.src]);
                // });
                // if (bodyElement && titleElement) {
                //     setTitle(titleElement);
                //     setBody(bodyElement);
                // }
            })
            .catch((error: Error) => console.log(error));
    };

    const handleClick = () => {
        writeUserData(userId,sequenceArray);
    }

    return (
        <>
            {nav && (
                <div className="flex justify-center relative z-10 md:hidden">
                    <div className="bg-blue-400 p-10 grid grid-rows-4 gap-2 place-content-center font-bold text-xl w-11/12 absolute top-0 h-72 rounded-md">
                        <div className="hover:text-gray-900">What is ThreadIt ?</div>
                        <div className="hover:text-gray-900">How It Works</div>
                        <button className="text-LogIn border-2 border-BGColor rounded-3xl w-fit pl-4 pr-4 pt-2 pb-2 cursor-pointer" onClick={() => {
                            signIn()
                            setUserId(auth.currentUser?.uid)
                        }} >
                            Log In
                        </button>
                        <button className="bg-LogIn border-none text-white rounded-3xl w-fit pl-4 pr-4 pt-2 pb-2 cursor-pointer" onClick={() => {
                            logOut
                        }} >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
            <div className="grid md:grid-cols-2 md:grid-rows-1 grid-cols-1 grid-rows-2 md:min-h-screen">
                <div className="bg-gray-200 flex justify-center md:p-24 p-12 order-2 items-center ">
                    <div className="border-2 border-gray-500 w-11/12 md:h-48 rounded-3xl p-6 md:p-10 flex justify-between flex-col">
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
                                className="p-4 md:w-4/5 mt-6 mb-2 w-11/12 placeholder:italic placeholder:text-slate-400 bg-white border-slate-300 rounded-md shadow-sm focus:outline-none focus:border-BGColor focus:bg-slate-100 focus:ring-1 sm:text-sm"
                                placeholder="Paste here ..."
                            />
                            <button
                                className="text-white bg-purple-700 p-3 rounded-md"
                                onClick={() => {
                                    changeToThread(url);
                                    // createTwitterThread(content)
                                    writeUserData(userId,sequenceArray)
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900 flex justify-center md:p-24 p-12 md:order-2">
                    <div className="text-green-500 grid grid-cols-1 font-bold leading-tight text-4xl italic underline">
                        <div>
                            Post Your Blogs and convert it in{" "}
                            <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block mt-6">
                                <span className="relative text-white">Twitter Thread</span>
                            </span>
                        </div>
                    </div>
                    {/* <div className=""></div> */}
                </div>
            </div>
            {/* <Content
                className="order-3"
                textBody={body}
                key={Math.floor(Math.random() * 9 + 1)}
                click={click}
                arrImgs={imageArr}
                codeText={codeText}
            /> */}
            {sequenceArray.map((element,index) => {
                return (
                    <div key={index}>
                        {element.type === 'heading' ? <div className="m-6 text-5xl font-bold">{element.content}</div> : element.type === 'code' ? <div className="flex justify-center"><div className="bg-black m-2 w-1/2 text-white p-16">{element.content.split('\n').map((line, ind) => (<div key={ind} className="my-2">{line}</div>)
                        )} </div></div> : element.type == 'img' ? <div className="m-2"><img src={element.content} /></div> : element.type == 'paragraph' ? <div className="m-2 pl-16 text-lg ">{element.content}</div> : " "}
                    </div>
                )
            })}
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
            <PostToTwitter key={userId} click={handleClick}/>
        </>
    );
};

export default MainSection;
