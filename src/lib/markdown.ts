import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import Slugger from "github-slugger";

export async function markdownToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return addHeadingIds(String(file));
}

export function countWords(markdown: string) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-[\]()]/g, " ")
    .trim();

  if (!plain) return 0;

  const cjk = plain.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]/g)?.length ?? 0;
  const words = plain.replace(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]/g, " ").match(/\b[\p{L}\p{N}]+\b/gu)?.length ?? 0;
  return cjk + words;
}

function addHeadingIds(html: string) {
  const slugger = new Slugger();
  return html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (_match, level: string, content: string) => {
    const text = content.replace(/<[^>]+>/g, "");
    return `<h${level} id="${slugger.slug(text)}">${content}</h${level}>`;
  });
}
