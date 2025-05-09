import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./styles.css";
export default function ReadmeEditor({ content }) {
  return (
    <>
      <div className="w-full">
        <Markdown rehypePlugins={[rehypeRaw]}>
          {content}
        </Markdown>
      </div>
    </>
  );
}
