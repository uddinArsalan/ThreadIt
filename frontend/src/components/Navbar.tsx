import logo_1 from "../assets/logos/logo-1.png";
import { useFirebase } from "../context/FirebaseProvider";
import Avatar from "./Avatar";

interface NavbarProps {
  toggleNavbar: () => void;
}

const Navbar = ({ toggleNavbar }: NavbarProps) => {
  const { logOut, signIn, isLoggedIn } = useFirebase();

  return (
    <div className="bg-BGColor select-none p-6">
      <div className="bg-blue-400 lg:p-6 p-3 select-none rounded-xl lg:grid grid-cols-6 md:grid-cols-4 items-center font-bold text-xl cursor-pointer text-gray-700 flex justify-between">
        <img
          src={logo_1}
          alt="Thread It"
          className="w-44 sm:w-48 md:w-64 m-2"
        />
        <div className="hover:text-gray-900 lg:flex hidden place-content-center">
          What is ThreadIt ?
        </div>
        <div className="hover:text-gray-900 lg:flex hidden place-content-center">
          How It Works
        </div>
        <div className="flex justify-evenly">
          {isLoggedIn ? (
            <Avatar />
          ) : (
            <div
              className="text-LogIn border-2 border-BGColor rounded-3xl p-2 pl-4 pr-4 cursor-pointer lg:flex hidden"
              onClick={signIn}
            >
              Log In
            </div>
          )}

          <div
            className="bg-LogIn border-2 min-w-16 text-white border-none rounded-3xl cursor-pointer p-2 pr-4 pl-4 lg:flex hidden "
            onClick={logOut}
          >
            Log Out
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-blue-950 lg:hidden p-2"
          onClick={toggleNavbar}
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
