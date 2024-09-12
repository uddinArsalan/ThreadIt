export const typeDefs = `#graphql
  type Content {
    html: String!
  }

  type Post {
    content: Content
  }

  type Publication {
    post(slug: String!): Post
  }

  type Query {
    publication(host: String!): Publication
  }
`;