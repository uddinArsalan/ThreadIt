import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typedefs/index.js";
import { resolvers } from './graphql/resolvers/index.js';

const port = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "*", 
    methods: "GET,POST",
    allowedHeaders: ["Content-Type"],
  },
});

const { url } = await startStandaloneServer(server, {
  listen: { port },
});

console.log("Server running at port 4000 " + url);
