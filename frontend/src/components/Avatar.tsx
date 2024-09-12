import { useFirebase } from "../context/FirebaseProvider";
import { User } from "firebase/auth";

const Avatar = () => {
  const { currentUser } = useFirebase();

  const getUserProfileInitials = (user: User | null) => {
    const userProfileInitials = user?.displayName
      ?.split(" ")
      .join("")
      .toUpperCase();
    return userProfileInitials;
  };
  return (
    <div>
      {currentUser?.photoURL ? (
        <img
          src={currentUser?.photoURL}
          alt=""
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center font-bold">
          {getUserProfileInitials(currentUser)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
