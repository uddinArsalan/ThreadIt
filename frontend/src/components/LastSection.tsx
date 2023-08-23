// import heroImg from "../assets/logos/comp.png";
import srcImg from "../assets/lastSec.svg"
import secondSrc from "../assets/undraw.svg"
import { RoughNotation,RoughNotationGroup } from "react-rough-notation";

const LastSection = () => {
  return (
    <div className="h-3/4 p-6">
      <div className="font-bold text-3xl md:text-5xl text-center mt-20">
        <RoughNotation
          show={true}  
          type="box"
          color="gray"
          animate={true}
          animationDuration={4000}
          animationDelay={1000}
        >
        Choose Thread It today
        </RoughNotation>
      </div>
      <div className="grid md:grid-cols-2 md:grid-rows-2 gap-y-12 m-4 md:p-24">
        <img src={srcImg} alt="" className="rounded-lg md:w-96" />
        <div className="grid gap-y-4 text-md list-disc font-semibold text-gray-700">
          <div>
            Hassle-free Sharing: Say goodbye to tedious copy-pasting! With
            Thread It, you can seamlessly convert your Hashnode blogs into
            captivating Twitter threads in just a few clicks.
          </div>
          <div>
            Personalized Tweets: Stand out from the crowd by customizing your
            tweets before posting. Add your unique touch, style, and hashtags to
            make your content shine.
          </div>
          <div>
            Styling Options: Make your threads visually appealing with
            formatting options. Emphasize important points, add headings, and
            enhance readability with ease.
          </div>
          </div>
          <div className="grid gap-y-4 text-md list-disc font-semibold text-gray-700 order-4 md:order-3">
          <div>
            Save Time and Effort: Thread It streamlines the process, so you
            spend more time creating content and engaging with your audience.
          </div>
          <div>
            Advanced Plans: Upgrade to our Pro and Premium plans for exclusive
            features tailored to content creators and bloggers. Unlock the full
            potential of Thread It.
          </div>
          <div>
            Engage Your Audience: Reach a broader audience on Twitter and keep
            them engaged with informative and captivating thread content.
          </div>
          <div>
            Future Updates: We are continuously improving Thread It based on
            user feedback. Expect regular updates and exciting new features to
            enhance your experience.
          </div>
          </div>
          <img src={secondSrc} alt="" className="order-3 md:order-4"/>
        </div>
      <div className="font-semibold flex pt-0 m-2 md:p-12 break-words justify-center mt-0 mb-16 text-2xl">
        Choose Thread It today and elevate your blog-sharing game on Twitter.
        Join our community of content creators and take the next step in your
        online journey.
      </div>
    </div>
  );
};

export default LastSection;
