"use client";

import { saveAs } from "file-saver";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from "docx";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import type { Content, Root, Table as MdTable } from "mdast";

const COLORS = {
  ink: "101820",
  accent: "287B78",
  border: "D8D0C2",
  code: "101820",
  codeText: "FFF8E7",
  inlineCode: "EFE8D8",
  quote: "EEF4EF"
};

const FONT = "Aptos";
const EAST_ASIA_FONT = "Microsoft YaHei";
const MONO_FONT = "Consolas";
const BULLET_NUMBERING = "markdownit-bullets";
const ORDERED_NUMBERING = "markdownit-ordered";

export function downloadMarkdown(title: string, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  saveAs(blob, `${safeFilename(title)}.md`);
}

export async function exportWord(title: string, markdown: string) {
  const blob = await buildWordBlob(title, markdown);
  saveAs(blob, `${safeFilename(title)}.docx`);
}

export async function buildWordBlob(title: string, markdown: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Root;
  const children = tree.children.flatMap((node) => nodeToDocx(node));

  const doc = new Document({
    creator: "Markdownit Online",
    title,
    styles: createDocumentStyles(),
    numbering: {
      config: [
        {
          reference: BULLET_NUMBERING,
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
                run: { font: FONT, color: COLORS.ink }
              }
            }
          ]
        },
        {
          reference: ORDERED_NUMBERING,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
                run: { font: FONT, color: COLORS.ink }
              }
            }
          ]
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: children.length ? children : [new Paragraph({ style: "Body", text: "" })]
      }
    ]
  });

  return Packer.toBlob(doc);
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
          style: headingStyle(node.depth),
          children: inlineToRuns(node.children, { bold: node.depth <= 2 })
        })
      ];
    case "paragraph":
      return [new Paragraph({ style: "Body", children: inlineToRuns(node.children) })];
    case "blockquote":
      return node.children.flatMap((child) => blockquoteChildToDocx(child));
    case "list":
      return node.children.flatMap((item) =>
        item.children.map(
          (child) =>
            new Paragraph({
              style: "ListBody",
              numbering: {
                reference: node.ordered ? ORDERED_NUMBERING : BULLET_NUMBERING,
                level: 0
              },
              children: inlineToRunsFromBlock(child as Content)
            })
        )
      );
    case "code":
      return [
        new Paragraph({
          style: "CodeBlock",
          shading: { type: ShadingType.CLEAR, fill: COLORS.code, color: "auto" },
          children: [
            new TextRun({
              text: node.value,
              font: MONO_FONT,
              color: COLORS.codeText,
              size: 21
            })
          ]
        })
      ];
    case "thematicBreak":
      return [new Paragraph({ text: "--------------------------------", alignment: AlignmentType.CENTER })];
    case "table":
      return [tableToDocx(node)];
    default:
      return collectText(node) ? [new Paragraph({ style: "Body", children: [createTextRun(collectText(node))] })] : [];
  }
}

function blockquoteChildToDocx(node: Content): Array<Paragraph | Table> {
  if (node.type === "heading") {
    return [new Paragraph({ style: "QuoteHeading", children: inlineToRuns(node.children, { bold: true }) })];
  }

  if (node.type === "paragraph") {
    return [new Paragraph({ style: "Quote", children: inlineToRuns(node.children) })];
  }

  if (node.type === "list") {
    return node.children.flatMap((item) =>
      item.children.map(
        (child) =>
          new Paragraph({
            style: "Quote",
            numbering: {
              reference: node.ordered ? ORDERED_NUMBERING : BULLET_NUMBERING,
              level: 0
            },
            children: inlineToRunsFromBlock(child as Content)
          })
      )
    );
  }

  return nodeToDocx(node);
}

function inlineToRunsFromBlock(node: Content) {
  if ("children" in node && Array.isArray(node.children)) {
    return inlineToRuns(node.children as Content[]);
  }

  return [createTextRun(collectText(node))];
}

function inlineToRuns(children: Content[] = [], options: { bold?: boolean; italics?: boolean } = {}): TextRun[] {
  return children.flatMap((node) => {
    switch (node.type) {
      case "text":
        return [createTextRun(node.value, options)];
      case "strong":
        return inlineToRuns(node.children, { ...options, bold: true });
      case "emphasis":
        return inlineToRuns(node.children, { ...options, italics: true });
      case "inlineCode":
        return [
          new TextRun({
            text: node.value,
            font: MONO_FONT,
            size: 21,
            color: COLORS.ink,
            shading: { type: ShadingType.CLEAR, fill: COLORS.inlineCode, color: "auto" }
          })
        ];
      case "link":
        return [createTextRun(collectText(node), { ...options, color: COLORS.accent, underline: true })];
      case "break":
        return [new TextRun({ text: "", break: 1 })];
      default:
        return [createTextRun(collectText(node), options)];
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
                margins: { top: 120, right: 120, bottom: 120, left: 120 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
                  left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
                  right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border }
                },
                children: [new Paragraph({ style: "Body", children: inlineToRuns(cell.children as Content[]) })]
              })
          )
        })
    )
  });
}

function createTextRun(text: string, options: { bold?: boolean; italics?: boolean; color?: string; underline?: boolean } = {}) {
  return new TextRun({
    text,
    font: FONT,
    bold: options.bold,
    italics: options.italics,
    color: options.color ?? COLORS.ink,
    underline: options.underline ? {} : undefined
  });
}

function createDocumentStyles() {
  return {
    default: {
      document: {
        run: {
          font: FONT,
          eastAsia: EAST_ASIA_FONT,
          size: 24,
          color: COLORS.ink
        },
        paragraph: {
          spacing: { line: 300, before: 0, after: 160 }
        }
      }
    },
    paragraphStyles: [
      {
        id: "Body",
        name: "Markdownit Body",
        basedOn: "Normal",
        next: "Body",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 24, color: COLORS.ink },
        paragraph: { spacing: { line: 300, before: 0, after: 180 } }
      },
      {
        id: "Title",
        name: "Markdownit Title",
        basedOn: "Normal",
        next: "Body",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 42, bold: true, color: COLORS.ink },
        paragraph: { spacing: { before: 120, after: 300 }, keepNext: true }
      },
      {
        id: "Heading2",
        name: "Markdownit Heading 2",
        basedOn: "Normal",
        next: "Body",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 30, bold: true, color: COLORS.ink },
        paragraph: { spacing: { before: 260, after: 160 }, keepNext: true }
      },
      {
        id: "Heading3",
        name: "Markdownit Heading 3",
        basedOn: "Normal",
        next: "Body",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 26, bold: true, color: COLORS.ink },
        paragraph: { spacing: { before: 220, after: 120 }, keepNext: true }
      },
      {
        id: "ListBody",
        name: "Markdownit List",
        basedOn: "Body",
        next: "ListBody",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 24, color: COLORS.ink },
        paragraph: { spacing: { line: 300, before: 0, after: 80 } }
      },
      {
        id: "Quote",
        name: "Markdownit Quote",
        basedOn: "Body",
        next: "Quote",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 24, color: COLORS.ink },
        paragraph: {
          indent: { left: 300 },
          spacing: { line: 300, before: 0, after: 120 },
          shading: { type: ShadingType.CLEAR, fill: COLORS.quote, color: "auto" },
          border: {
            left: { color: COLORS.accent, space: 12, style: BorderStyle.SINGLE, size: 18 }
          }
        }
      },
      {
        id: "QuoteHeading",
        name: "Markdownit Quote Heading",
        basedOn: "Quote",
        next: "Quote",
        quickFormat: true,
        run: { font: FONT, eastAsia: EAST_ASIA_FONT, size: 26, bold: true, color: COLORS.ink },
        paragraph: {
          indent: { left: 300 },
          spacing: { line: 300, before: 120, after: 120 },
          shading: { type: ShadingType.CLEAR, fill: COLORS.quote, color: "auto" },
          border: {
            left: { color: COLORS.accent, space: 12, style: BorderStyle.SINGLE, size: 18 }
          }
        }
      },
      {
        id: "CodeBlock",
        name: "Markdownit Code Block",
        basedOn: "Normal",
        next: "Body",
        quickFormat: true,
        run: { font: MONO_FONT, size: 21, color: COLORS.codeText },
        paragraph: {
          spacing: { before: 120, after: 180 },
          shading: { type: ShadingType.CLEAR, fill: COLORS.code, color: "auto" }
        }
      }
    ]
  };
}

function headingLevel(depth: number) {
  const levels = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
  return levels[Math.min(Math.max(depth - 1, 0), levels.length - 1)];
}

function headingStyle(depth: number) {
  if (depth === 1) return "Title";
  if (depth === 2) return "Heading2";
  return "Heading3";
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
