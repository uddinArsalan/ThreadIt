import "../css/style.css";
import WhatIsThreadIt from "./WhatIsThreadIt";
import PaySection from "./PaySection";
import PostSection from "./PostSection";
import LastSection from "./LastSection";
import NavMenu from "./NavMenu";

interface MainSectionProps {
  showNavbar: boolean;
}

const MainSection: React.FC<MainSectionProps> = ({ showNavbar }) => {
  return (
    <>
      {showNavbar && <NavMenu />}
      <WhatIsThreadIt />
      <PostSection/>   
      <PaySection />
      <LastSection />
    </>
  );
};

export default MainSection;
