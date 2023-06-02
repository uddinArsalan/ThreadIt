import { signOut } from "firebase/auth";
import logo_1 from "../assets/logos/logo-1.png";
import { auth, logOut, signIn } from "./TwitterAuth";

type props = {
  setNav : React.Dispatch<React.SetStateAction<boolean>>
  setUserId :React.Dispatch<React.SetStateAction<string | undefined>>
}

const Navbar = ({setNav,setUserId} : props) => {

  return (
    <div className="bg-BGColor select-none md:p-6 p-4">
      <div className="bg-blue-400 md:p-6 p-3 select-none rounded-xl md:grid grid-cols-6 items-center font-bold text-xl cursor-pointer text-gray-700 flex justify-between">
        <img src={logo_1} alt="Thread It" className="w-64 col-span-2" />
        <div className="hover:text-gray-900 md:flex hidden">What is ThreadIt ?</div>
        <div className="hover:text-gray-900 md:flex hidden">How It Works</div>

        <div className="flex justify-evenly">
        <div className="text-LogIn border-2 border-BGColor rounded-3xl w-fit p-2 pr-4 pl-4 md:flex hidden" onClick={() => {
          signIn();
          setUserId((prevUserId) => auth.currentUser?.uid || prevUserId);
          }}>
          Log In
        </div>
        <div className="bg-LogIn border-2 text-white border-none rounded-3xl w-fit p-2 pr-4 pl-4 md:flex hidden" onClick={() => {
          logOut
          }}>
          Log Out
        </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-blue-950 md:hidden p-2"
          onClick={() => setNav(prev => !prev)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default Navbar;
