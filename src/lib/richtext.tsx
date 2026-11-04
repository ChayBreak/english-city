import { Fragment, type ReactNode } from "react";

// A tiny, safe subset of Markdown for lesson texts written in the admin:
// "## heading", "- list item", "> quote", **bold**, *italic* and blank-line paragraphs.

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const token = match[0];
    out.push(
      token.startsWith("**") ? (
        <strong key={index}>{token.slice(2, -2)}</strong>
      ) : (
        <em key={index}>{token.slice(1, -1)}</em>
      ),
    );
    last = index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="rich">
      {blocks.map((block, b) => {
        const lines = block.split("\n").filter((line) => line.trim());
        const nodes: ReactNode[] = [];
        let list: string[] = [];
        const flush = () => {
          if (list.length)
            nodes.push(
              <ul key={`l${nodes.length}`}>
                {list.map((item, i) => (
                  <li key={i}>{inline(item)}</li>
                ))}
              </ul>,
            );
          list = [];
        };
        let paragraph: string[] = [];
        const flushParagraph = () => {
          if (paragraph.length)
            nodes.push(
              <p key={`p${nodes.length}`}>
                {paragraph.map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {inline(line)}
                  </Fragment>
                ))}
              </p>,
            );
          paragraph = [];
        };
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ")) {
            flushParagraph();
            list.push(trimmed.slice(2));
            continue;
          }
          flush();
          if (trimmed.startsWith("## ")) {
            flushParagraph();
            nodes.push(<h3 key={`h${nodes.length}`}>{inline(trimmed.slice(3))}</h3>);
          } else if (trimmed.startsWith("> ")) {
            flushParagraph();
            nodes.push(<blockquote key={`q${nodes.length}`}>{inline(trimmed.slice(2))}</blockquote>);
          } else paragraph.push(trimmed);
        }
        flush();
        flushParagraph();
        return <Fragment key={b}>{nodes}</Fragment>;
      })}
    </div>
  );
}
