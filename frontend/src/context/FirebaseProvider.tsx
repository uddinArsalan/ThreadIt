import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  TwitterAuthProvider,
  signOut,
  getAdditionalUserInfo,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { FirebaseContextType } from "../interfaces/FirebaseContextInterface";
import { ref, get, set, push } from "firebase/database";
import { db, auth } from "../config/firebase";
import { SequenceObjectType, UserCredentials } from "../interfaces";

const provider = new TwitterAuthProvider();

const FirebaseContext = createContext<FirebaseContextType>({
  username: "Arsalan_0101",
  threadContentArray: [],
  isLoggedIn: false,
  currentUser: null,
  postThreadToDatabase: console.log,
  logOut: () => {},
  signIn: () => {},
  getTwitterCredentials: async (uid: string) => {
    return {
      accessToken: "",
      secret: "",
      username: "",
    };
  },
});

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("Arsalan_0101");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [threadContentArray, setThreadContentArray] = useState<
    SequenceObjectType[]
  >([]);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      const secret = credential?.secret;

      // The signed-in user info.
      const user = result.user;
      const userName = getAdditionalUserInfo(result)?.username;

      if (accessToken && secret && userName) {
        const twitterCredentials = {
          accessToken,
          secret,
          username: userName,
          lastUpdated: new Date().toISOString(),
        };

        setUsername(userName);
        storeUserTokens(user.uid, twitterCredentials);
      }
      console.log("Successfully logged in");
    } catch (error: any) {
      console.error("Login error: ", error.message, error.code);
    }
  };

  async function getTwitterUsername(uid: string) {
    try {
      const snapshot = await get(
        ref(db, `users/${uid}/twitterCredentials/username`)
      );
      const username = snapshot.val();
      if (username) {
        return username;
      } else {
        throw new Error("Twitter username not found");
      }
    } catch (error) {
      console.error("Error getting Twitter username:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in!");
        console.log("User ", user);
        setIsLoggedIn(true);
        getTwitterUsername(user.uid)
          .then((username) => setUsername(username))
          .catch((error) => console.error("Error fetching username:", error));
        setCurrentUser(user);
      } else {
        console.log("User is signed out");
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  async function getTwitterCredentials(uid: string): Promise<UserCredentials> {
    try {
      const snapshot = await get(ref(db, `users/${uid}/twitterCredentials`));
      const data = snapshot.val();
      if (data && data.accessToken && data.secret && data.username) {
        return data as UserCredentials;
      } else {
        throw new Error("Twitter credentials or username not found");
      }
    } catch (error) {
      console.error("Error getting Twitter credentials:", error);
      throw error;
    }
  }

  function storeUserTokens(userId: string, userProfileData: UserCredentials) {
    set(ref(db, `users/${userId}/twitterCredentials`), userProfileData);
  }

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  function postThreadToDatabase(newThreadContent: SequenceObjectType[]) {
    if (currentUser?.uid) {
      const threadRef = ref(db, `users/${currentUser.uid}/threads`);

      const newThreadRef = push(threadRef);

      set(newThreadRef, newThreadContent)
        .then(() => {
          console.log("New thread posted and saved in the database");
          setThreadContentArray(newThreadContent);
        })
        .catch((error) => {
          console.error("Error posting thread to database:", error);
        });
    }
  }

  return (
    <FirebaseContext.Provider
      value={{
        username,
        threadContentArray,
        isLoggedIn,
        currentUser,
        postThreadToDatabase,
        logOut,
        signIn,
        getTwitterCredentials,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
