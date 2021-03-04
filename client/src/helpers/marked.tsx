import * as React from "react";
import marked from "marked";
import { sanitizeHtml } from "./sanitizeHtml";

interface Props {
  children: string;
  links?: boolean;
}

const sanitizeBacktick = (text: string) => text.replace(/`/g, "&#x60;");

const sanitizeLinebreak = (text: string) =>
  text.replace(/(\r\n|\n)/g, "<br />");

export const InlineMarked = ({ children, links }: Props) => {
  const html = React.useMemo(() => {
    const renderer = new marked.Renderer();
    renderer.paragraph = (text) => text;
    if (links === false) {
      renderer.link = (href, title, text) => text;
    }
    return sanitizeHtml(
      marked(sanitizeBacktick(sanitizeLinebreak(children)), {
        renderer,
        breaks: true,
      })
    );
    // eslint-disable-next-line
  }, [children]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export const Marked = ({ children, links }: Props) => {
  const html = React.useMemo(() => {
    const renderer = new marked.Renderer();
    if (links === false) {
      renderer.link = (href, title, text) => text;
    }
    return sanitizeHtml(
      marked(sanitizeBacktick(children), {
        renderer,
        breaks: true,
      })
    );
    // eslint-disable-next-line
  }, [children]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
