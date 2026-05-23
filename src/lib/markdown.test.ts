import { describe, expect, it } from "vitest";
import { countWords, markdownToHtml } from "./markdown";

describe("markdown helpers", () => {
  it("renders gfm markdown to sanitized html", async () => {
    const html = await markdownToHtml("# Hello\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n<script>alert(1)</script>");
    expect(html).toContain('<h1 id="hello">Hello</h1>');
    expect(html).toContain("<table>");
    expect(html).not.toContain("<script>");
  });

  it("counts latin and cjk words", () => {
    expect(countWords("Hello world 你好")).toBe(4);
  });
});
