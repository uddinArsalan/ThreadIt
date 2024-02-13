import { createContext, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider,
  signOut,
  getAdditionalUserInfo,
} from "firebase/auth";
const provider = new TwitterAuthProvider();

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

interface sequenceObject {
  type: string;
  content: string;
}

interface TwitterContextType {
  username: string;
  writeUserData: (
    userId: string | undefined,
    sequenceData: sequenceObject[]
  ) => void
  logOut: () => void;
  signIn: () => void;
}

const firebaseConfig = {
  apiKey: "AIzaSyCCjB2iBqAUDM0Iemaw_atKz-JffAeyPPk",
  authDomain: "thread-it-7890b.firebaseapp.com",
  // authDomain : "thread-it-one.vercel.app",
  projectId: "thread-it-7890b",
  storageBucket: "thread-it-7890b.appspot.com",
  messagingSenderId: "961995972885",
  appId: "1:961995972885:web:56ecab787d0bdba3d4091c",
  measurementId: "G-YER5Q6TYSM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const TwitterContext = createContext<TwitterContextType>(null!);
// export const userId = auth.currentUser?.uid;

const TwitterContextProvider = ({ children }: any) => {
  const [username, setUsername] = useState<string>("Arsalan_0101");

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const secret = credential?.secret;
        console.log("successfully login");

        writeUserAuthDetails(token, secret);
        // The signed-in user info.
        const user = result.user;
        // console.log(result._tokenResponse)
        const userName = getAdditionalUserInfo(result)?.username;
        if(userName){
          setUsername(userName);
        }
        
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        // ...
      });
  };

  function writeUserAuthDetails(
    tokens: string | undefined,
    secrets: string | undefined
  ) {
    set(ref(db, `tokens/${auth.currentUser?.uid}/tokens`), {
      tokens: tokens,
      secrets: secrets,
    });
  }

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  function writeUserData(
    userId: string | undefined,
    sequenceData: sequenceObject[]
  ) {
    if (userId) {
      set(ref(db, `users/${userId}`), { sequenceData });
    }
  }


  return (
    <TwitterContext.Provider
      value={{ username, writeUserData, logOut, signIn }}
    >
      {children}
    </TwitterContext.Provider>
  );
};

export default TwitterContextProvider;
