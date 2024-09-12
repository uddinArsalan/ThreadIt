import { useFirebase } from "../context/FirebaseProvider";

const NavMenu = () => {
  const { signIn, logOut } = useFirebase();
  return (
    <div className="flex justify-center relative z-10 transition-opacity duration-75 lg:hidden">
      <div className="bg-blue-400 p-10 grid grid-rows-4 gap-2 place-content-center font-bold text-xl w-11/12 absolute top-0 h-72 rounded-md">
        <div className="hover:text-gray-900">What is ThreadIt ?</div>
        <div className="hover:text-gray-900">How It Works</div>
        <button
          className="text-LogIn border-2 border-BGColor rounded-3xl w-fit pl-4 pr-4 pt-2 pb-2 cursor-pointer"
          onClick={signIn}
        >
          Log In
        </button>
        <button
          className="bg-LogIn border-none text-white rounded-3xl w-fit pl-4 pr-4 pt-2 pb-2 cursor-pointer"
          onClick={logOut}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default NavMenu;
