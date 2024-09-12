import React, { useState ,useEffect} from "react";
import { useThreadCreator } from "../hooks/useThreadCreator";
import { useQuery, gql } from "@apollo/client";
import { useFirebase } from "../context/FirebaseProvider";

const GET_USER_BLOG_CONTENT = gql`
  query ($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        content {
          html
        }
      }
    }
  }
`;

interface Variables {
   host : string;
   slug : string;
}


const ThreadCreator = () => {
  const { status, createThread,sequenceArray } = useThreadCreator();
  const { postThreadToDatabase } = useFirebase();
  const [url, setUrl] = useState<string>("");
  const [variables, setVariables] = useState<Variables>({ host: "", slug: "" });
  const [debouncedUrl, setDebouncedUrl] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrl(url);
    }, 500); 
    return () => {
      clearTimeout(handler);
    };
  }, [url]);

  const getHostAndSlug = (url: string) => {
    try {
      const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
      const pathParts = parsedUrl.pathname.split("/").filter(Boolean); 
      const slug = pathParts.pop() || "";
      return { host: parsedUrl.hostname, slug };
    } catch (e) {
      console.error("Invalid URL", e);
      return { host: "", slug: "" };
    }
  };

  useEffect(() => {
    if (debouncedUrl) {
      const parsedVariables = getHostAndSlug(debouncedUrl);
      setVariables(parsedVariables);
    }
  }, [debouncedUrl]);

  const { loading, data, error } = useQuery(GET_USER_BLOG_CONTENT, {
    skip: !variables.host || !variables.slug,
    variables,
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (data?.publication?.post?.content?.html) {
      const updatedSequenceArray = await createThread(data.publication.post.content.html);
      if (updatedSequenceArray.length > 0) {
        postThreadToDatabase(updatedSequenceArray);
      }
    } else {
      console.error("No content found or content is loading.");
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === "pending" || loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50"
        >
          Create Thread
        </button>
      </form>
      {status === "pending" && (
        <p className="text-yellow-600">Creating thread...</p>
      )}
      {status === "error" && (
        <p className="text-red-600">Error creating thread</p>
      )}
      {status === "done" && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Thread Created:</h3>
          <div className="max-h-60 max-w-sm md:max-w-xl overflow-y-auto bg-white p-4 rounded-md shadow">
            {sequenceArray.map((item, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <span className="font-medium">{item.type}:</span> {item.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadCreator;
