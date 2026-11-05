import { rewindArticle } from "./rewindArticle";

export type JournalBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "note"; text: string }
  | {
      type: "table";
      caption: string;
      headers: readonly string[];
      rows: readonly (readonly string[])[];
    }
  | { type: "faq"; items: readonly { question: string; answer: string }[] };

export type JournalSection = {
  id?: string;
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  blocks?: readonly JournalBlock[];
};

export type JournalRelatedUpdate = {
  label: string;
  title: string;
  href: string;
};
export type JournalCategory =
  | "Product Notes"
  | "Case Studies"
  | "Announcements";
export type JournalEntry = {
  slug: string;
  week: string;
  date: string;
  isoDate: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  authorAvatarPosition?: "left" | "right";
  category: JournalCategory;
  readingTime: string;
  title: string;
  summary: string;
  seoTitle?: string;
  metaDescription?: string;
  cover?: { src: string; alt: string };
  status?: string;
  href?: string;
  featureOnHome?: boolean;
  editorialNote: string;
  sections: readonly JournalSection[];
  relatedUpdates: readonly JournalRelatedUpdate[];
};

export const journalEntries: readonly JournalEntry[] = [rewindArticle];
// Publishing a Blog post does not opt it into a separate homepage announcement.
export const latestJournalEntry: JournalEntry | null =
  journalEntries.find(entry => entry.featureOnHome) ?? null;
export function getJournalEntry(slug: string) {
  return journalEntries.find(entry => !entry.href && entry.slug === slug);
}
