import { useState, useCallback } from "react";
import * as cheerio from "cheerio";
import { SequenceObjectType } from "../interfaces";

interface ThreadCreatorResult {
  status: "idle" | "pending" | "done" | "error";
  sequenceArray: SequenceObjectType[];
  createThread: (data: string) => Promise<SequenceObjectType[]>;
}

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export const useThreadCreator = (): ThreadCreatorResult => {
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">(
    "idle"
  );
  const [sequenceArray, setSequenceArray] = useState<SequenceObjectType[]>([]);

  const createThread = useCallback(async (data: any): Promise<SequenceObjectType[]> => {
    setStatus("pending");
    setSequenceArray([]);
    try {
      const html = await data;
      const $ = cheerio.load(html);
      const rootElement = $("body");
      const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
      let isTableContent = false;

      const newSequence: SequenceObjectType[] = [];

      rootElement.find("*").each((index, element) => {
        const tagName = element.tagName;
        const $element = $(element);

        switch (tagName) {
          case "img":
            const src = $element.attr("src");
            if (src && src.startsWith("h")) {
              newSequence.push({ type: "img", content: src });
            }
            break;
          case "code":
            newSequence.push({ type: "code", content: $element.text() });
            break;
          case "p":
            newSequence.push({ type: "paragraph", content: $element.text() });
            break;
          case "li":
            if (!$element.children("p").length) {
              const textContent = $element.text();
              newSequence.push({ type: "paragraph", content: textContent });
            }
            break;
          default:
            if (headingTags.includes(tagName)) {
              const textContent = $element.text();
              if (textContent.includes("Table")) {
                isTableContent = true;
              } else if (index > 1) {
                newSequence.push({ type: "heading", content: textContent });
              }
            }
        }
      });

      setSequenceArray(newSequence);
      setStatus("done");
      return newSequence; 
    } catch (error) {
      console.error("Error creating thread:", error);
      setStatus("error");
      return [];
    }
  }, []);

  return { status, sequenceArray, createThread };
};

