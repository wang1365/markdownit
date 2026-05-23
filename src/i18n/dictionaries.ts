import type { Locale } from "./config";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  app: {
    brand: string;
    eyebrow: string;
    headline: string;
    subtitle: string;
    newDoc: string;
    import: string;
    exportMd: string;
    exportWord: string;
    exportPdf: string;
    exportGoogle: string;
    exportNotion: string;
    copiedGoogle: string;
    copiedNotion: string;
    rename: string;
    duplicate: string;
    delete: string;
    documents: string;
    editor: string;
    preview: string;
    wordCount: string;
    saved: string;
    focus: string;
    language: string;
    emptyTitle: string;
    emptyBody: string;
    filenamePlaceholder: string;
    deleteConfirm: string;
    sampleTitle: string;
    sampleMarkdown: string;
  };
  faq: Array<{ question: string; answer: string }>;
};

const sharedKeywords = ["Markdown", "Word", "PDF", "online editor", "markdownit.online"];

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      title: "Markdownit Online - Markdown Editor with Word and PDF Export",
      description: "Edit, preview, and export Markdown documents to Word and PDF in a private multilingual browser workspace.",
      keywords: sharedKeywords
    },
    app: {
      brand: "Markdownit",
      eyebrow: "Private writing studio",
      headline: "A focused Markdown workbench for finished documents.",
      subtitle: "Write in Markdown, preview instantly, keep drafts in your browser, and export polished Word or PDF files.",
      newDoc: "New",
      import: "Import",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google Docs",
      exportNotion: "Notion",
      copiedGoogle: "Google Docs document created and opened.",
      copiedNotion: "Markdown copied. Paste or import it in Notion.",
      rename: "Rename",
      duplicate: "Duplicate",
      delete: "Delete",
      documents: "Documents",
      editor: "Editor",
      preview: "Preview",
      wordCount: "words",
      saved: "Saved locally",
      focus: "Focus",
      language: "Language",
      emptyTitle: "Start with a blank page",
      emptyBody: "Create or import a Markdown file. Your drafts stay in this browser.",
      filenamePlaceholder: "Document title",
      deleteConfirm: "Delete this document?",
      sampleTitle: "Launch note",
      sampleMarkdown: "# Launch note\n\nMarkdownit keeps your Markdown workflow private, fast, and export-ready.\n\n- Write in a calm editor\n- Preview GitHub-flavored Markdown\n- Export to Word or PDF\n\n> Draft locally. Ship beautifully."
    },
    faq: [
      { question: "Does Markdownit store my documents?", answer: "Version 1 stores drafts locally in your browser using IndexedDB." },
      { question: "Can I export to Word and PDF?", answer: "Yes. Word export is generated in browser and PDF uses a print-optimized layout." }
    ]
  },
  fr: {
    meta: {
      title: "Markdownit Online - Éditeur Markdown avec export Word et PDF",
      description: "Modifiez, prévisualisez et exportez vos documents Markdown en Word et PDF dans un espace privé multilingue.",
      keywords: sharedKeywords
    },
    app: {
      brand: "Markdownit",
      eyebrow: "Studio d'écriture privé",
      headline: "Un atelier Markdown précis pour des documents finalisés.",
      subtitle: "Écrivez en Markdown, prévisualisez instantanément, gardez vos brouillons localement et exportez en Word ou PDF.",
      newDoc: "Nouveau",
      import: "Importer",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google Docs",
      exportNotion: "Notion",
      copiedGoogle: "Document Google Docs créé et ouvert.",
      copiedNotion: "Markdown copié. Collez-le ou importez-le dans Notion.",
      rename: "Renommer",
      duplicate: "Dupliquer",
      delete: "Supprimer",
      documents: "Documents",
      editor: "Éditeur",
      preview: "Aperçu",
      wordCount: "mots",
      saved: "Enregistré localement",
      focus: "Focus",
      language: "Langue",
      emptyTitle: "Commencez avec une page blanche",
      emptyBody: "Créez ou importez un fichier Markdown. Vos brouillons restent dans ce navigateur.",
      filenamePlaceholder: "Titre du document",
      deleteConfirm: "Supprimer ce document ?",
      sampleTitle: "Note de lancement",
      sampleMarkdown: "# Note de lancement\n\nMarkdownit rend votre flux Markdown privé, rapide et prêt à exporter.\n\n- Écrivez dans un éditeur calme\n- Prévisualisez le Markdown enrichi\n- Exportez en Word ou PDF"
    },
    faq: [
      { question: "Markdownit stocke-t-il mes documents ?", answer: "La version 1 conserve les brouillons localement dans votre navigateur." },
      { question: "Puis-je exporter en Word et PDF ?", answer: "Oui, l'export Word est généré côté navigateur et le PDF utilise une mise en page optimisée pour l'impression." }
    ]
  },
  de: {
    meta: {
      title: "Markdownit Online - Markdown-Editor mit Word- und PDF-Export",
      description: "Markdown-Dokumente privat im Browser bearbeiten, prüfen und als Word oder PDF exportieren.",
      keywords: sharedKeywords
    },
    app: {
      brand: "Markdownit",
      eyebrow: "Privates Schreibstudio",
      headline: "Eine fokussierte Markdown-Werkbank für fertige Dokumente.",
      subtitle: "Schreibe in Markdown, prüfe die Vorschau sofort, speichere lokal und exportiere als Word oder PDF.",
      newDoc: "Neu",
      import: "Import",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google Docs",
      exportNotion: "Notion",
      copiedGoogle: "Google Docs-Dokument wurde erstellt und geöffnet.",
      copiedNotion: "Markdown kopiert. Füge es in Notion ein oder importiere es.",
      rename: "Umbenennen",
      duplicate: "Duplizieren",
      delete: "Löschen",
      documents: "Dokumente",
      editor: "Editor",
      preview: "Vorschau",
      wordCount: "Wörter",
      saved: "Lokal gespeichert",
      focus: "Fokus",
      language: "Sprache",
      emptyTitle: "Mit einer leeren Seite beginnen",
      emptyBody: "Erstelle oder importiere eine Markdown-Datei. Entwürfe bleiben in diesem Browser.",
      filenamePlaceholder: "Dokumenttitel",
      deleteConfirm: "Dieses Dokument löschen?",
      sampleTitle: "Startnotiz",
      sampleMarkdown: "# Startnotiz\n\nMarkdownit hält deinen Markdown-Ablauf privat, schnell und exportbereit.\n\n- Ruhig schreiben\n- Markdown sofort prüfen\n- Als Word oder PDF exportieren"
    },
    faq: [
      { question: "Speichert Markdownit meine Dokumente?", answer: "Version 1 speichert Entwürfe lokal im Browser." },
      { question: "Kann ich Word und PDF exportieren?", answer: "Ja. Word wird im Browser erzeugt, PDF über eine druckoptimierte Ansicht." }
    ]
  },
  ja: {
    meta: {
      title: "Markdownit Online - Word/PDF 書き出し対応 Markdown エディター",
      description: "Markdown をブラウザーで編集、プレビューし、Word と PDF に書き出せる多言語対応の作業空間です。",
      keywords: sharedKeywords
    },
    app: {
      brand: "Markdownit",
      eyebrow: "プライベート執筆スタジオ",
      headline: "完成文書のための集中できる Markdown 作業台。",
      subtitle: "Markdown で書き、すぐに確認し、下書きをブラウザーに保存して Word や PDF に書き出せます。",
      newDoc: "新規",
      import: "読み込み",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google Docs",
      exportNotion: "Notion",
      copiedGoogle: "Google ドキュメントを作成して開きました。",
      copiedNotion: "Markdown をコピーしました。Notion に貼り付けるか読み込んでください。",
      rename: "名前変更",
      duplicate: "複製",
      delete: "削除",
      documents: "文書",
      editor: "エディター",
      preview: "プレビュー",
      wordCount: "語",
      saved: "ローカル保存済み",
      focus: "集中",
      language: "言語",
      emptyTitle: "空白ページから始める",
      emptyBody: "Markdown ファイルを作成または読み込みます。下書きはこのブラウザー内に残ります。",
      filenamePlaceholder: "文書タイトル",
      deleteConfirm: "この文書を削除しますか？",
      sampleTitle: "ローンチノート",
      sampleMarkdown: "# ローンチノート\n\nMarkdownit は Markdown 作業をプライベートで高速、書き出しやすく保ちます。\n\n- 落ち着いたエディターで書く\n- すぐにプレビュー\n- Word または PDF に書き出し"
    },
    faq: [
      { question: "Markdownit は文書を保存しますか？", answer: "v1 では下書きをブラウザー内の IndexedDB に保存します。" },
      { question: "Word と PDF に書き出せますか？", answer: "はい。Word はブラウザー内で生成し、PDF は印刷向けレイアウトを使います。" }
    ]
  },
  ko: {
    meta: {
      title: "Markdownit Online - Word/PDF 내보내기 Markdown 편집기",
      description: "브라우저에서 Markdown을 편집하고 미리 보며 Word와 PDF로 내보내는 다국어 작업 공간입니다.",
      keywords: sharedKeywords
    },
    app: {
      brand: "Markdownit",
      eyebrow: "개인 글쓰기 스튜디오",
      headline: "완성 문서를 위한 집중형 Markdown 작업대.",
      subtitle: "Markdown으로 쓰고 즉시 미리 보며 브라우저에 저장한 뒤 Word나 PDF로 내보내세요.",
      newDoc: "새 문서",
      import: "가져오기",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google Docs",
      exportNotion: "Notion",
      copiedGoogle: "Google Docs 문서를 만들고 열었습니다.",
      copiedNotion: "Markdown을 복사했습니다. Notion에 붙여넣거나 가져오세요.",
      rename: "이름 변경",
      duplicate: "복제",
      delete: "삭제",
      documents: "문서",
      editor: "편집기",
      preview: "미리보기",
      wordCount: "단어",
      saved: "로컬 저장됨",
      focus: "집중",
      language: "언어",
      emptyTitle: "빈 페이지에서 시작",
      emptyBody: "Markdown 파일을 만들거나 가져오세요. 초안은 이 브라우저에만 저장됩니다.",
      filenamePlaceholder: "문서 제목",
      deleteConfirm: "이 문서를 삭제할까요?",
      sampleTitle: "출시 노트",
      sampleMarkdown: "# 출시 노트\n\nMarkdownit은 Markdown 작업을 비공개로 빠르게 유지하고 내보내기까지 돕습니다.\n\n- 차분한 편집기에서 작성\n- 즉시 미리보기\n- Word 또는 PDF로 내보내기"
    },
    faq: [
      { question: "Markdownit이 문서를 저장하나요?", answer: "v1은 초안을 브라우저의 IndexedDB에 로컬로 저장합니다." },
      { question: "Word와 PDF로 내보낼 수 있나요?", answer: "네. Word는 브라우저에서 생성하고 PDF는 인쇄 최적화 레이아웃을 사용합니다." }
    ]
  },
  "zh-CN": {
    meta: {
      title: "Markdownit Online - 支持 Word 与 PDF 导出的 Markdown 编辑器",
      description: "在浏览器中私密编辑、实时预览 Markdown，并导出 Word 与 PDF 的多语言专业创作台。",
      keywords: ["Markdown 编辑器", "Markdown 转 Word", "Markdown 转 PDF", ...sharedKeywords]
    },
    app: {
      brand: "Markdownit",
      eyebrow: "私密专业创作台",
      headline: "为成稿而生的 Markdown 工作台。",
      subtitle: "在线编辑 Markdown，实时预览，草稿保存在本地浏览器，并一键导出 Word 或 PDF。",
      newDoc: "新建",
      import: "导入",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google 文档",
      exportNotion: "Notion",
      copiedGoogle: "Google 文档已创建并打开。",
      copiedNotion: "已复制 Markdown，请在 Notion 中粘贴或导入。",
      rename: "重命名",
      duplicate: "复制",
      delete: "删除",
      documents: "文档",
      editor: "编辑器",
      preview: "预览",
      wordCount: "字",
      saved: "已本地保存",
      focus: "专注",
      language: "语言",
      emptyTitle: "从一张空白页开始",
      emptyBody: "新建或导入 Markdown 文件。你的草稿只保存在当前浏览器。",
      filenamePlaceholder: "文档标题",
      deleteConfirm: "删除这个文档？",
      sampleTitle: "发布笔记",
      sampleMarkdown: "# 发布笔记\n\nMarkdownit 让你的 Markdown 写作保持私密、快速，并随时可以导出成稿。\n\n- 在安静的编辑器中写作\n- 实时预览 GitHub 风格 Markdown\n- 导出 Word 或 PDF\n\n> 本地起草，漂亮交付。"
    },
    faq: [
      { question: "Markdownit 会上传我的文档吗？", answer: "不会。v1 草稿默认保存在当前浏览器的 IndexedDB 中。" },
      { question: "可以导出 Word 和 PDF 吗？", answer: "可以。Word 在浏览器内生成，PDF 使用打印优化版式。" }
    ]
  },
  "zh-TW": {
    meta: {
      title: "Markdownit Online - 支援 Word 與 PDF 匯出的 Markdown 編輯器",
      description: "在瀏覽器中私密編輯、即時預覽 Markdown，並匯出 Word 與 PDF 的多語專業創作台。",
      keywords: ["Markdown 編輯器", "Markdown 轉 Word", "Markdown 轉 PDF", ...sharedKeywords]
    },
    app: {
      brand: "Markdownit",
      eyebrow: "私密專業創作台",
      headline: "為完稿而生的 Markdown 工作台。",
      subtitle: "線上編輯 Markdown、即時預覽、草稿保存在本機瀏覽器，並一鍵匯出 Word 或 PDF。",
      newDoc: "新增",
      import: "匯入",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google 文件",
      exportNotion: "Notion",
      copiedGoogle: "Google 文件已建立並開啟。",
      copiedNotion: "已複製 Markdown，請在 Notion 中貼上或匯入。",
      rename: "重新命名",
      duplicate: "複製",
      delete: "刪除",
      documents: "文件",
      editor: "編輯器",
      preview: "預覽",
      wordCount: "字",
      saved: "已本機保存",
      focus: "專注",
      language: "語言",
      emptyTitle: "從空白頁開始",
      emptyBody: "新增或匯入 Markdown 檔案。你的草稿只會留在目前瀏覽器。",
      filenamePlaceholder: "文件標題",
      deleteConfirm: "刪除此文件？",
      sampleTitle: "發布筆記",
      sampleMarkdown: "# 發布筆記\n\nMarkdownit 讓你的 Markdown 寫作保持私密、快速，並隨時可匯出成稿。\n\n- 在安靜的編輯器中寫作\n- 即時預覽 Markdown\n- 匯出 Word 或 PDF"
    },
    faq: [
      { question: "Markdownit 會上傳我的文件嗎？", answer: "不會。v1 草稿預設保存在目前瀏覽器的 IndexedDB 中。" },
      { question: "可以匯出 Word 和 PDF 嗎？", answer: "可以。Word 在瀏覽器內產生，PDF 使用列印最佳化版面。" }
    ]
  },
  ar: {
    meta: {
      title: "Markdownit Online - محرر Markdown مع تصدير Word و PDF",
      description: "حرر Markdown وعاينه وصدّره إلى Word وPDF داخل مساحة عمل خاصة متعددة اللغات في المتصفح.",
      keywords: sharedKeywords
    },
    app: {
      brand: "Markdownit",
      eyebrow: "استوديو كتابة خاص",
      headline: "منضدة Markdown مركزة للمستندات النهائية.",
      subtitle: "اكتب Markdown، شاهد المعاينة فوراً، احفظ المسودات في المتصفح، وصدّر Word أو PDF.",
      newDoc: "جديد",
      import: "استيراد",
      exportMd: "Markdown",
      exportWord: "Word",
      exportPdf: "PDF",
      exportGoogle: "Google Docs",
      exportNotion: "Notion",
      copiedGoogle: "تم إنشاء مستند Google Docs وفتحه.",
      copiedNotion: "تم نسخ Markdown. الصقه أو استورده في Notion.",
      rename: "إعادة تسمية",
      duplicate: "نسخ",
      delete: "حذف",
      documents: "المستندات",
      editor: "المحرر",
      preview: "المعاينة",
      wordCount: "كلمات",
      saved: "محفوظ محلياً",
      focus: "تركيز",
      language: "اللغة",
      emptyTitle: "ابدأ بصفحة فارغة",
      emptyBody: "أنشئ أو استورد ملف Markdown. تبقى المسودات في هذا المتصفح.",
      filenamePlaceholder: "عنوان المستند",
      deleteConfirm: "حذف هذا المستند؟",
      sampleTitle: "ملاحظة الإطلاق",
      sampleMarkdown: "# ملاحظة الإطلاق\n\nيحافظ Markdownit على سير عمل Markdown خاصاً وسريعاً وجاهزاً للتصدير.\n\n- اكتب في محرر هادئ\n- عاين Markdown فوراً\n- صدّر إلى Word أو PDF"
    },
    faq: [
      { question: "هل يخزن Markdownit مستنداتي؟", answer: "في الإصدار الأول تحفظ المسودات محلياً في المتصفح باستخدام IndexedDB." },
      { question: "هل يمكن التصدير إلى Word وPDF؟", answer: "نعم. يتم إنشاء Word داخل المتصفح ويستخدم PDF تخطيطاً محسناً للطباعة." }
    ]
  }
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
