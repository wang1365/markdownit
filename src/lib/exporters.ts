"use client";

import { saveAs } from "file-saver";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType
} from "docx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root, Content, Table as MdTable } from "mdast";

export function downloadMarkdown(title: string, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  saveAs(blob, `${safeFilename(title)}.md`);
}

export async function exportWord(title: string, markdown: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  const children = tree.children.flatMap((node) => nodeToDocx(node));

  const doc = new Document({
    creator: "Markdownit Online",
    title,
    sections: [
      {
        properties: {},
        children: children.length ? children : [new Paragraph("")]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFilename(title)}.docx`);
}

export function exportPdf() {
  window.print();
}

export async function exportGoogleDocs(title: string, markdown: string, html: string) {
  await copyRichDocument(markdown, html);
  window.open(`https://docs.new?title=${encodeURIComponent(title)}`, "_blank", "noopener,noreferrer");
}

export async function exportNotion(markdown: string) {
  await navigator.clipboard.writeText(markdown);
  window.open("https://www.notion.so/import", "_blank", "noopener,noreferrer");
}

async function copyRichDocument(markdown: string, html: string) {
  const fullHtml = `<!doctype html><html><body>${html}</body></html>`;
  if ("ClipboardItem" in window) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([fullHtml], { type: "text/html" }),
        "text/plain": new Blob([markdown], { type: "text/plain" })
      })
    ]);
    return;
  }

  await navigator.clipboard.writeText(markdown);
}

function nodeToDocx(node: Content): Array<Paragraph | Table> {
  switch (node.type) {
    case "heading":
      return [
        new Paragraph({
          heading: headingLevel(node.depth),
          children: inlineToRuns(node.children)
        })
      ];
    case "paragraph":
      return [new Paragraph({ children: inlineToRuns(node.children) })];
    case "blockquote":
      return node.children.flatMap((child) =>
        nodeToDocx(child).map((item) => {
          if (item instanceof Paragraph) {
            return new Paragraph({
              indent: { left: 420 },
              border: {
                left: {
                  color: "287B78",
                  space: 8,
                  style: "single",
                  size: 12
                }
              },
              text: collectText(child)
            });
          }
          return item;
        })
      );
    case "list":
      return node.children.map((item, index) => {
        const text = item.children.map((child) => collectText(child)).join(" ");
        return new Paragraph({
          text: `${node.ordered ? `${(node.start ?? 1) + index}.` : "•"} ${text}`,
          indent: { left: 360 }
        });
      });
    case "code":
      return [
        new Paragraph({
          shading: { fill: "101820" },
          children: [
            new TextRun({
              text: node.value,
              font: "Consolas",
              color: "FFF8E7"
            })
          ]
        })
      ];
    case "thematicBreak":
      return [new Paragraph({ text: "--------------------------------", alignment: AlignmentType.CENTER })];
    case "table":
      return [tableToDocx(node)];
    default:
      return collectText(node) ? [new Paragraph({ text: collectText(node) })] : [];
  }
}

function inlineToRuns(children: Content[] = []): TextRun[] {
  return children.flatMap((node) => {
    switch (node.type) {
      case "text":
        return [new TextRun(node.value)];
      case "strong":
        return [new TextRun({ text: collectText(node), bold: true })];
      case "emphasis":
        return [new TextRun({ text: collectText(node), italics: true })];
      case "inlineCode":
        return [new TextRun({ text: node.value, font: "Consolas", shading: { fill: "EFE8D8" } })];
      case "link":
        return [new TextRun({ text: collectText(node), color: "287B78", underline: {} })];
      case "break":
        return [new TextRun({ text: "", break: 1 })];
      default:
        return [new TextRun(collectText(node))];
    }
  });
}

function tableToDocx(node: MdTable) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: node.children.map(
      (row) =>
        new TableRow({
          children: row.children.map(
            (cell) =>
              new TableCell({
                children: [new Paragraph({ children: inlineToRuns(cell.children as Content[]) })]
              })
          )
        })
    )
  });
}

function headingLevel(depth: number) {
  const levels = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
  return levels[Math.min(Math.max(depth - 1, 0), levels.length - 1)];
}

function collectText(node: Content): string {
  if ("value" in node && typeof node.value === "string") return node.value;
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((child) => collectText(child as Content)).join("");
  }
  return "";
}

function safeFilename(title: string) {
  const cleaned = title.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-");
  return cleaned || "markdownit-document";
}
