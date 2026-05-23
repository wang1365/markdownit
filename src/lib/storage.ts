"use client";

import { openDB, type DBSchema } from "idb";
import type { StoredDocument } from "@/types/document";

interface MarkdownitDb extends DBSchema {
  documents: {
    key: string;
    value: StoredDocument;
    indexes: {
      "by-updated": number;
    };
  };
}

const DB_NAME = "markdownit-online";
const STORE = "documents";

async function getDb() {
  return openDB<MarkdownitDb>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("by-updated", "updatedAt");
    }
  });
}

export async function listDocuments() {
  const db = await getDb();
  const docs = await db.getAllFromIndex(STORE, "by-updated");
  return docs.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveDocument(document: StoredDocument) {
  const db = await getDb();
  await db.put(STORE, document);
}

export async function deleteDocument(id: string) {
  const db = await getDb();
  await db.delete(STORE, id);
}
