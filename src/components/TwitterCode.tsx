import { signIn } from "./TwitterAuth"
const TwitterCode = () => {

  //     subdomain: "api", // "api" is the default (change for other subdomains)
  //     version: "1.1", // version "1.1" is the default (change for other subdomains)
  //     consumer_key: "RDrrj6qgSQriGcegFs9HQ6g3I", // from Twitter.
  //     consumer_secret: "X5ZHLem3SHyoyVWoENFvTM8YTgJEnK4yqTvf6zbJAvRfnwGKVo", // from Twitter.
  //     access_token_key: "1509424906576236547-trZRxVzOGa78sXNYf1bylpb1NztAjq", // from your User (oauth_token)
  //     access_token_secret: "HrEYWMuDUC26a9c0dmSXw9T9mC1iJYWeOAQTJxodbGH7H", // from your User (oauth_token_secret)
  //     bearer_token : "AAAAAAAAAAAAAAAAAAAAAN%2F%2FmgEAAAAAhLBNaWtUnYRWl77bHMLoCzAVFTM%3DXkpInKjxrysTB9LaYgjJ3s8r4MVujvBYrttxtBCfdSkeZBLazw"

  // const twitterClient = new Client(import.meta.env.VITE_BEARER_TOKEN);

  return (
    <div>
      <button className="bg-blue-300 text-white p-6 m-6 rounded-md" onClick={signIn}>Sign In</button>
    </div>
  )
}


export default TwitterCode