// import Twitter from 'twitter-lite';
import { db } from './components/TwitterAuth';
import { onValue, ref } from 'firebase/database';

const userAuthDetails = ref(db,'usersAuth');
onValue(userAuthDetails,(snapshot) =>{
    const data = snapshot.val()
    console.log(data)
})

// const client = new Twitter({
//     consumer_key: "RDrrj6qgSQriGcegFs9HQ6g3I",
//     consumer_secret: "X5ZHLem3SHyoyVWoENFvTM8YTgJEnK4yqTvf6zbJAvRfnwGKVo",
//     access_token_key: "xyz",
//     access_token_secret: "xyz"
//   });
  
//   async function tweetThread(thread : string[]) {
//     let lastTweetID = "";
//     for (const status of thread) {
//       const tweet = await client.post("statuses/update", {
//         status: status,
//         in_reply_to_status_id: lastTweetID,
//         auto_populate_reply_metadata: true
//       });
//       lastTweetID = tweet.id_str;
//     }
//   }
  
//   const thread = ["First tweet", "Second tweet", "Third tweet"];
//   tweetThread(thread).catch(console.error);