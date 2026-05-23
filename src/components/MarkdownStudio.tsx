"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap, type EditorView } from "@codemirror/view";
import {
  Bold,
  Code2,
  Copy,
  FileDown,
  FilePlus2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Import,
  Italic,
  Languages,
  Link,
  List,
  ListOrdered,
  Mail,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Quote,
  Save,
  Table2,
  Trash2
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { StoredDocument } from "@/types/document";
import { countWords, markdownToHtml } from "@/lib/markdown";
import { deleteDocument, listDocuments, saveDocument } from "@/lib/storage";
import { downloadMarkdown, exportGoogleDocs, exportPdf, exportWord } from "@/lib/exporters";
import { Logo } from "./Logo";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

const themes = [
  { id: "atelier", label: "Atelier" },
  { id: "night", label: "Night Grid" },
  { id: "jade", label: "Jade Paper" },
  { id: "contrast", label: "High Contrast" }
] as const;

type ThemeId = (typeof themes)[number]["id"];
type MarkdownTool = "h1" | "h2" | "h3" | "h4" | "bold" | "italic" | "quote" | "bullet" | "ordered" | "link" | "code" | "table";

const toolShortcuts: Record<MarkdownTool, string> = {
  h1: "Ctrl/Cmd+Alt+1",
  h2: "Ctrl/Cmd+Alt+2",
  h3: "Ctrl/Cmd+Alt+3",
  h4: "Ctrl/Cmd+Alt+4",
  bold: "Ctrl/Cmd+B",
  italic: "Ctrl/Cmd+I",
  quote: "Ctrl/Cmd+Shift+.",
  bullet: "Ctrl/Cmd+Shift+8",
  ordered: "Ctrl/Cmd+Shift+7",
  link: "Ctrl/Cmd+K",
  code: "Ctrl/Cmd+Alt+C",
  table: "Ctrl/Cmd+Alt+T"
};

const focusShortcut = "Ctrl/Cmd+Alt+F";
const feedbackEmail = "wangxiaochuan01@163.com";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function MarkdownStudio({ locale, dictionary }: Props) {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("atelier");
  const [notice, setNotice] = useState("");
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDocument = documents.find((item) => item.id === activeId) ?? null;
  const wordCount = useMemo(() => countWords(activeDocument?.markdown ?? ""), [activeDocument?.markdown]);
  const slogan = useMemo(() => getSlogan(locale, dictionary.app.headline), [dictionary.app.headline, locale]);

  useEffect(() => {
    let mounted = true;
    listDocuments().then((saved) => {
      if (!mounted) return;
      if (saved.length) {
        setDocuments(saved);
        setActiveId(saved[0].id);
      } else {
        const starter = createDocument(dictionary.app.sampleTitle, dictionary.app.sampleMarkdown);
        setDocuments([starter]);
        setActiveId(starter.id);
        saveDocument(starter);
      }
    });

    return () => {
      mounted = false;
    };
  }, [dictionary.app.sampleMarkdown, dictionary.app.sampleTitle]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("markdownit-theme");
    if (savedTheme && themes.some((item) => item.id === savedTheme)) {
      setTheme(savedTheme as ThemeId);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    markdownToHtml(activeDocument?.markdown ?? "").then((html) => {
      if (!cancelled) setPreviewHtml(html);
    });
    return () => {
      cancelled = true;
    };
  }, [activeDocument?.markdown]);

  useEffect(() => {
    if (!focusMode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFocusMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode]);

  const updateActive = useCallback(
    (updates: Partial<StoredDocument>) => {
      if (!activeDocument) return;
      const nextDocument = { ...activeDocument, ...updates, updatedAt: Date.now() };
      setDocuments((items) => items.map((item) => (item.id === nextDocument.id ? nextDocument : item)));
      saveDocument(nextDocument);
    },
    [activeDocument]
  );

  const createNewDocument = () => {
    const doc = createDocument(dictionary.app.emptyTitle, "");
    setDocuments((items) => [doc, ...items]);
    setActiveId(doc.id);
    saveDocument(doc);
  };

  const duplicateDocument = () => {
    if (!activeDocument) return;
    const doc = createDocument(`${activeDocument.title} copy`, activeDocument.markdown);
    setDocuments((items) => [doc, ...items]);
    setActiveId(doc.id);
    saveDocument(doc);
  };

  const removeDocument = () => {
    if (!activeDocument || !window.confirm(dictionary.app.deleteConfirm)) return;
    const remaining = documents.filter((item) => item.id !== activeDocument.id);
    setDocuments(remaining);
    setActiveId(remaining[0]?.id ?? null);
    deleteDocument(activeDocument.id);
  };

  const importFile = async (file: File) => {
    const text = await file.text();
    const title = file.name.replace(/\.(md|markdown|txt)$/i, "");
    const doc = createDocument(title, text);
    setDocuments((items) => [doc, ...items]);
    setActiveId(doc.id);
    saveDocument(doc);
  };

  const switchLocale = (value: string) => {
    const target = value as Locale;
    window.history.pushState(null, "", `/${target}`);
    window.location.assign(`/${target}`);
  };

  const switchTheme = (value: string) => {
    const nextTheme = themes.some((item) => item.id === value) ? (value as ThemeId) : "atelier";
    setTheme(nextTheme);
    window.localStorage.setItem("markdownit-theme", nextTheme);
  };

  const sendToGoogleDocs = async () => {
    if (!activeDocument) return;
    try {
      await exportGoogleDocs(activeDocument.title, activeDocument.markdown, previewHtml);
      setNotice(dictionary.app.copiedGoogle);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Google Docs export failed.");
    }
  };

  const contactAuthor = () => {
    const subject = encodeURIComponent("Markdownit Online feedback");
    const body = encodeURIComponent(
      [
        "Hi,",
        "",
        "I have feedback about Markdownit Online:",
        "",
        `Document: ${activeDocument?.title ?? "Untitled"}`,
        `Page: ${window.location.href}`,
        "",
        "Feedback:"
      ].join("\n")
    );
    window.location.href = `mailto:${feedbackEmail}?subject=${subject}&body=${body}`;
  };

  const applyMarkdownTool = useCallback(
    (tool: MarkdownTool, viewOverride?: EditorView) => {
      if (!activeDocument) return false;

      const view = viewOverride ?? editorView;
      const markdown = activeDocument.markdown;
      const selection = view?.state.selection.main;
      const from = selection?.from ?? markdown.length;
      const to = selection?.to ?? markdown.length;
      const selected = markdown.slice(from, to);
      const edit = createMarkdownEdit(tool, markdown, from, to, selected);

      if (view) {
        view.dispatch({
          changes: { from: edit.from, to: edit.to, insert: edit.insert },
          selection: { anchor: edit.cursor }
        });
        view.focus();
        return true;
      }

      updateActive({ markdown: `${markdown.slice(0, edit.from)}${edit.insert}${markdown.slice(edit.to)}` });
      return true;
    },
    [activeDocument, editorView, updateActive]
  );

  const editorExtensions = useMemo(() => {
    const formattingKeys = keymap.of([
      { key: "Mod-Alt-1", run: (view) => applyMarkdownTool("h1", view) },
      { key: "Mod-Alt-2", run: (view) => applyMarkdownTool("h2", view) },
      { key: "Mod-Alt-3", run: (view) => applyMarkdownTool("h3", view) },
      { key: "Mod-Alt-4", run: (view) => applyMarkdownTool("h4", view) },
      { key: "Mod-b", run: (view) => applyMarkdownTool("bold", view) },
      { key: "Mod-i", run: (view) => applyMarkdownTool("italic", view) },
      { key: "Mod-Shift-.", run: (view) => applyMarkdownTool("quote", view) },
      { key: "Mod-Shift-8", run: (view) => applyMarkdownTool("bullet", view) },
      { key: "Mod-Shift-7", run: (view) => applyMarkdownTool("ordered", view) },
      { key: "Mod-k", run: (view) => applyMarkdownTool("link", view) },
      { key: "Mod-Alt-c", run: (view) => applyMarkdownTool("code", view) },
      { key: "Mod-Alt-t", run: (view) => applyMarkdownTool("table", view) },
      {
        key: "Mod-Alt-f",
        run: () => {
          setFocusMode((value) => !value);
          return true;
        }
      }
    ]);

    return theme === "night" || theme === "contrast" ? [markdown(), formattingKeys, oneDark] : [markdown(), formattingKeys];
  }, [applyMarkdownTool, theme]);

  return (
    <main className={`studio-shell ${focusMode ? "focus-mode" : ""} ${railCollapsed ? "rail-collapsed" : ""}`} data-theme={theme}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      {focusMode ? (
        <button className="focus-exit-button" onClick={() => setFocusMode(false)} title="Exit focus mode (Esc)" aria-label="Exit focus mode (Esc)">
          <Minimize2 size={18} />
        </button>
      ) : null}
      <div className="studio-frame">
        <aside className="rail" aria-label={dictionary.app.documents}>
          <div className="brand-block">
            <div className="rail-brand-row">
              <Logo showWordmark={!railCollapsed} />
              <button className="icon-button rail-toggle" onClick={() => setRailCollapsed((value) => !value)} title={railCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                {railCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
              </button>
            </div>
            <p className="brand-copy">{dictionary.app.subtitle}</p>
          </div>

          <div className="rail-actions">
            <button className="text-button primary" onClick={createNewDocument} title={dictionary.app.newDoc}>
              <FilePlus2 size={17} />
              {dictionary.app.newDoc}
            </button>
            <button className="icon-button" onClick={() => fileInputRef.current?.click()} title={dictionary.app.import}>
              <Import size={17} />
            </button>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept=".md,.markdown,.txt,text/markdown,text/plain"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) importFile(file);
                event.currentTarget.value = "";
              }}
            />
          </div>

          <div className="section-label">{dictionary.app.documents}</div>
          <div className="document-list">
            {documents.map((item, index) => (
              <button
                key={item.id}
                className={`doc-tab ${item.id === activeId ? "active" : ""}`}
                data-index={index + 1}
                title={`${index + 1}. ${item.title}\n${new Date(item.updatedAt).toLocaleString(locale)}\n${documentSummary(item.markdown)}`}
                onClick={() => setActiveId(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{new Date(item.updatedAt).toLocaleDateString(locale)}</span>
                <em className="doc-flyout">
                  <b>{index + 1}. {item.title}</b>
                  <small>{new Date(item.updatedAt).toLocaleString(locale)}</small>
                  <small>{documentSummary(item.markdown)}</small>
                </em>
              </button>
            ))}
          </div>
        </aside>

        <section className="workspace">
          <header className="hero-strip">
            <div>
              <Logo />
              <h1>{slogan}</h1>
            </div>
            <button className="icon-button rail-toggle hero-rail-toggle" onClick={() => setRailCollapsed((value) => !value)} title={railCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {railCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
          </header>

          <div className="topbar">
            <input
              className="title-input"
              value={activeDocument?.title ?? ""}
              placeholder={dictionary.app.filenamePlaceholder}
              onChange={(event) => updateActive({ title: event.target.value })}
              aria-label={dictionary.app.filenamePlaceholder}
            />

            <div className="export-group">
              <select className="select-control" value={locale} onChange={(event) => switchLocale(event.target.value)} aria-label={dictionary.app.language}>
                {locales.map((item) => (
                  <option key={item} value={item}>
                    {localeLabels[item]}
                  </option>
                ))}
              </select>
              <select className="select-control theme-select" value={theme} onChange={(event) => switchTheme(event.target.value)} aria-label="Theme">
                {themes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button className="icon-button" onClick={duplicateDocument} title={dictionary.app.duplicate}>
                <Copy size={17} />
              </button>
              <button className="icon-button" onClick={removeDocument} title={dictionary.app.delete}>
                <Trash2 size={17} />
              </button>
              <button
                className="icon-button focus-toggle"
                onClick={() => setFocusMode((value) => !value)}
                title={`${focusMode ? "Exit focus mode" : dictionary.app.focus} (${focusShortcut})`}
                aria-label={`${focusMode ? "Exit focus mode" : dictionary.app.focus} (${focusShortcut})`}
              >
                {focusMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
              <button className="text-button" onClick={() => activeDocument && downloadMarkdown(activeDocument.title, activeDocument.markdown)}>
                <Save size={17} />
                {dictionary.app.exportMd}
              </button>
              <button className="text-button" onClick={() => activeDocument && exportWord(activeDocument.title, activeDocument.markdown)}>
                <WordIcon size={17} />
                {dictionary.app.exportWord}
              </button>
              <button className="text-button primary" onClick={exportPdf}>
                <FileDown size={17} />
                {dictionary.app.exportPdf}
              </button>
              <button className="text-button" onClick={sendToGoogleDocs}>
                <GoogleIcon size={17} />
                {dictionary.app.exportGoogle}
              </button>
              <button className="icon-button" onClick={contactAuthor} title={getFeedbackLabel(locale)} aria-label={getFeedbackLabel(locale)}>
                <Mail size={17} />
              </button>
            </div>
          </div>
          {notice ? <div className="notice-bar">{notice}</div> : null}

          {activeDocument ? (
            <div className="editor-grid">
              <section className="pane editor-pane">
                <div className="pane-header">
                  <span>{dictionary.app.editor}</span>
                  <div className="markdown-toolbar" aria-label="Markdown formatting toolbar">
                    <button type="button" onClick={() => applyMarkdownTool("h1")} title={`Heading 1 (${toolShortcuts.h1})`} aria-label={`Heading 1 (${toolShortcuts.h1})`}>
                      <Heading1 size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("h2")} title={`Heading 2 (${toolShortcuts.h2})`} aria-label={`Heading 2 (${toolShortcuts.h2})`}>
                      <Heading2 size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("h3")} title={`Heading 3 (${toolShortcuts.h3})`} aria-label={`Heading 3 (${toolShortcuts.h3})`}>
                      <Heading3 size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("h4")} title={`Heading 4 (${toolShortcuts.h4})`} aria-label={`Heading 4 (${toolShortcuts.h4})`}>
                      <Heading4 size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("bold")} title={`Bold (${toolShortcuts.bold})`} aria-label={`Bold (${toolShortcuts.bold})`}>
                      <Bold size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("italic")} title={`Italic (${toolShortcuts.italic})`} aria-label={`Italic (${toolShortcuts.italic})`}>
                      <Italic size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("quote")} title={`Quote (${toolShortcuts.quote})`} aria-label={`Quote (${toolShortcuts.quote})`}>
                      <Quote size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("bullet")} title={`Bulleted list (${toolShortcuts.bullet})`} aria-label={`Bulleted list (${toolShortcuts.bullet})`}>
                      <List size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("ordered")} title={`Numbered list (${toolShortcuts.ordered})`} aria-label={`Numbered list (${toolShortcuts.ordered})`}>
                      <ListOrdered size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("link")} title={`Link (${toolShortcuts.link})`} aria-label={`Link (${toolShortcuts.link})`}>
                      <Link size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("code")} title={`Code block (${toolShortcuts.code})`} aria-label={`Code block (${toolShortcuts.code})`}>
                      <Code2 size={14} />
                    </button>
                    <button type="button" onClick={() => applyMarkdownTool("table")} title={`Table (${toolShortcuts.table})`} aria-label={`Table (${toolShortcuts.table})`}>
                      <Table2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="editor-host">
                  <CodeMirror
                    value={activeDocument.markdown}
                    extensions={editorExtensions}
                    basicSetup={{ lineNumbers: true, foldGutter: true }}
                    onCreateEditor={(view) => setEditorView(view)}
                    onChange={(value) => updateActive({ markdown: value })}
                  />
                </div>
              </section>
              <section className="pane preview-pane">
                <div className="pane-header">
                  <span>{dictionary.app.preview}</span>
                  <span>
                    <Languages size={14} /> {dictionary.app.saved} ·{" "}
                    {wordCount} {dictionary.app.wordCount}
                  </span>
                </div>
                <div className="preview-host">
                  <article className="preview-document" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </section>
            </div>
          ) : (
            <div className="empty-state">
              <div>
                <h2>{dictionary.app.emptyTitle}</h2>
                <p>{dictionary.app.emptyBody}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function createDocument(title: string, markdown: string): StoredDocument {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title,
    markdown,
    createdAt: now,
    updatedAt: now
  };
}

function getSlogan(locale: Locale, fallback: string) {
  const slogans: Partial<Record<Locale, string>> = {
    en: "Write in Markdown. Deliver everywhere.",
    fr: "Écrivez en Markdown. Livrez partout.",
    de: "In Markdown schreiben. Überall liefern.",
    ja: "Markdown で書く。どこへでも届ける。",
    ko: "Markdown으로 쓰고, 어디로든 전달하세요.",
    "zh-CN": "用 Markdown 写作，用任何格式交付。",
    "zh-TW": "用 Markdown 寫作，用任何格式交付。",
    ar: "اكتب بـ Markdown. وسلّم في كل مكان."
  };

  return slogans[locale] ?? fallback;
}

function documentSummary(markdown: string) {
  const summary = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-[\]()`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return summary ? summary.slice(0, 80) : "Empty document";
}

function getFeedbackLabel(locale: Locale) {
  const labels: Record<Locale, string> = {
    en: "Contact author",
    fr: "Contacter l'auteur",
    de: "Autor kontaktieren",
    ja: "作者に連絡",
    ko: "작성자에게 문의",
    "zh-CN": "联系作者反馈",
    "zh-TW": "聯繫作者回饋",
    ar: "تواصل مع المؤلف"
  };

  return labels[locale];
}

function GoogleIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285f4" d="M21.6 12.23c0-.74-.07-1.45-.2-2.13H12v4.03h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.43Z" />
      <path fill="#34a853" d="M12 22c2.7 0 4.96-.89 6.62-2.34l-3.23-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#fbbc05" d="M6.4 13.98A6.01 6.01 0 0 1 6.08 12c0-.69.12-1.35.32-1.98V7.43H3.06A10 10 0 0 0 2 12c0 1.61.39 3.13 1.06 4.57l3.34-2.59Z" />
      <path fill="#ea4335" d="M12 5.9c1.47 0 2.79.51 3.83 1.5l2.86-2.86C16.96 2.92 14.7 2 12 2a10 10 0 0 0-8.94 5.43l3.34 2.59C7.19 7.66 9.4 5.9 12 5.9Z" />
    </svg>
  );
}

function WordIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect width="18" height="20" x="4" y="2" rx="2.5" fill="#185abd" />
      <path fill="#41a5ee" d="M8 2h11.5A2.5 2.5 0 0 1 22 4.5V8H8V2Z" opacity=".9" />
      <rect width="12" height="12" x="2" y="7" rx="2" fill="#103f91" />
      <path fill="#fff" d="m5.2 10 1.1 5 .95-5h1.5l.97 5 1.08-5h1.4l-1.65 7H8.9l-.9-4.65L7.1 17H5.45L3.8 10h1.4Z" />
    </svg>
  );
}

type MarkdownEdit = {
  from: number;
  to: number;
  insert: string;
  cursor: number;
};

function createMarkdownEdit(tool: MarkdownTool, markdown: string, from: number, to: number, selected: string): MarkdownEdit {
  if (tool === "bold") return wrapSelection(from, to, selected, "**", "**", "bold text");
  if (tool === "italic") return wrapSelection(from, to, selected, "*", "*", "italic text");
  if (tool === "link") return linkSelection(from, to, selected);
  if (tool === "code") return blockTemplate(from, to, selected, "```\n", "\n```", "code");
  if (tool === "table") return insertTemplate(from, to, "| Column | Value |\n| --- | --- |\n| Item | Detail |", 2);

  const lineRange = getLineRange(markdown, from, to);
  const block = markdown.slice(lineRange.from, lineRange.to);

  if (tool === "h1") return replaceLines(lineRange, block, (line) => setHeading(line, "#"));
  if (tool === "h2") return replaceLines(lineRange, block, (line) => setHeading(line, "##"));
  if (tool === "h3") return replaceLines(lineRange, block, (line) => setHeading(line, "###"));
  if (tool === "h4") return replaceLines(lineRange, block, (line) => setHeading(line, "####"));
  if (tool === "quote") return replaceLines(lineRange, block, (line) => togglePrefix(line, "> "));
  if (tool === "bullet") return replaceLines(lineRange, block, (line) => togglePrefix(line, "- "));
  return replaceLines(lineRange, block, (line, index) => setOrderedPrefix(line, index + 1));
}

function wrapSelection(from: number, to: number, selected: string, before: string, after: string, placeholder: string): MarkdownEdit {
  const content = selected || placeholder;
  return {
    from,
    to,
    insert: `${before}${content}${after}`,
    cursor: from + before.length + content.length
  };
}

function linkSelection(from: number, to: number, selected: string): MarkdownEdit {
  const label = selected || "link text";
  const insert = `[${label}](https://example.com)`;
  return {
    from,
    to,
    insert,
    cursor: from + insert.length - 1
  };
}

function blockTemplate(from: number, to: number, selected: string, before: string, after: string, placeholder: string): MarkdownEdit {
  const content = selected || placeholder;
  return {
    from,
    to,
    insert: `${before}${content}${after}`,
    cursor: from + before.length + content.length
  };
}

function insertTemplate(from: number, to: number, template: string, focusLine: number): MarkdownEdit {
  const lines = template.split("\n").slice(0, focusLine).join("\n");
  return {
    from,
    to,
    insert: template,
    cursor: from + lines.length
  };
}

function getLineRange(markdown: string, from: number, to: number) {
  const start = markdown.lastIndexOf("\n", Math.max(0, from - 1)) + 1;
  const nextBreak = markdown.indexOf("\n", to);
  return {
    from: start,
    to: nextBreak === -1 ? markdown.length : nextBreak
  };
}

function replaceLines(lineRange: { from: number; to: number }, block: string, transform: (line: string, index: number) => string): MarkdownEdit {
  const lines = block ? block.split("\n") : [""];
  const next = lines.map((line, index) => transform(line || "Text", index)).join("\n");
  return {
    from: lineRange.from,
    to: lineRange.to,
    insert: next,
    cursor: lineRange.from + next.length
  };
}

function setHeading(line: string, marker: string) {
  return `${marker} ${line.replace(/^#{1,6}\s+/, "")}`;
}

function togglePrefix(line: string, prefix: string) {
  return line.startsWith(prefix) ? line.slice(prefix.length) : `${prefix}${line}`;
}

function setOrderedPrefix(line: string, index: number) {
  return `${index}. ${line.replace(/^\d+\.\s+/, "").replace(/^- /, "")}`;
}
