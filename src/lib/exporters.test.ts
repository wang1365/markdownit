import { describe, expect, it } from "vitest";
import { buildWordBlob } from "./exporters";

describe("word exporter", () => {
  it("builds a styled docx for representative markdown", async () => {
    const blob = await buildWordBlob(
      "Launch note",
      [
        "# Launch note",
        "",
        "Markdownit keeps **Markdown** private with `inline code`.",
        "",
        "- Write in a calm editor",
        "- Export to Word or PDF",
        "",
        "> Draft locally.",
        ">",
        "> ## Who are you",
        "",
        "```ts",
        "const ready = true;",
        "```"
      ].join("\n")
    );

    expect(blob.size).toBeGreaterThan(4000);
    expect(blob.type).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  });
});
