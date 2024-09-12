import { User } from "firebase/auth";
import { SequenceObjectType, UserCredentials } from ".";
export interface FirebaseContextType {
  username: string;
  threadContentArray : SequenceObjectType[];
  currentUser : User | null;
  isLoggedIn : boolean;
  postThreadToDatabase: (newThreadContent : SequenceObjectType[]) => void;
  logOut: () => void;
  signIn: () => void;
  getTwitterCredentials : (uid : string) => Promise<UserCredentials>
}
