const GET_USER_BLOG_CONTENT = `
  query($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        content {
          html
        }
      }
    }
  }
`;

export const resolvers = {
  Query: {
    publication: async (_, { host }) => {
      return { host };
    },
  },
  Publication: {
    post: async ({ host }, { slug }) => {
      try {
        const response = await fetch("https://gql.hashnode.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_USER_BLOG_CONTENT,
            variables: { host, slug }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        return data.publication.post;
      } catch (error) {
        console.error("Error fetching post data:", error);
        throw new Error("Unable to fetch post data");
      }
    },
  },
};