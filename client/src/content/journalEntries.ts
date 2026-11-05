export type JournalSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
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
  authorAvatarPosition: "left" | "right";
  category: JournalCategory;
  readingTime: string;
  title: string;
  summary: string;
  href?: string;
  editorialNote: string;
  sections: readonly JournalSection[];
  relatedUpdates: readonly JournalRelatedUpdate[];
};

// Add reviewed articles here when the next Blog content is ready.
export const journalEntries: readonly JournalEntry[] = [];

export const latestJournalEntry: JournalEntry | null = journalEntries[0] ?? null;

export function getJournalEntry(slug: string) {
  return journalEntries.find(entry => !entry.href && entry.slug === slug);
}
