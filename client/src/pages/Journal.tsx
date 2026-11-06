import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  FileText,
  LayoutGrid,
  Megaphone,
} from "lucide-react";
import { useMemo, useState } from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { type JournalCategory, journalEntries } from "@/content/journalEntries";
import "@/styles/journal.css";

type JournalFilter = "All" | JournalCategory;

const journalFilters = [
  { label: "All", icon: LayoutGrid },
  { label: "Product Notes", icon: FileText },
  { label: "Case Studies", icon: BookOpenText },
  { label: "Announcements", icon: Megaphone },
] as const satisfies readonly {
  label: JournalFilter;
  icon: typeof LayoutGrid;
}[];

export default function Journal() {
  const [activeFilter, setActiveFilter] = useState<JournalFilter>("All");
  const visibleEntries = useMemo(
    () =>
      activeFilter === "All"
        ? journalEntries
        : journalEntries.filter(entry => entry.category === activeFilter),
    [activeFilter]
  );

  return (
    <div className="memova-home-theme memova-journal-page">
      <SiteHeader current="journal" navigationMode="watch" />

      <main className="memova-journal-main">
        <section
          className="memova-journal-index"
          aria-labelledby="memova-journal-heading"
        >
          <h1 id="memova-journal-heading">Blog</h1>

          {journalEntries.length > 0 ? (
            <div
              className="memova-journal-filters"
              role="toolbar"
              aria-label="Filter journal notes"
            >
              {journalFilters.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={activeFilter === label}
                  className={activeFilter === label ? "is-active" : undefined}
                  onClick={() => setActiveFilter(label)}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          <div
            className={`memova-journal-timeline${journalEntries.length ? "" : " is-empty"}`}
            aria-live="polite"
          >
            {visibleEntries.length ? (
              visibleEntries.map(entry => {
                const EntryMarker =
                  entry.category === "Case Studies" ? BookOpenText : FileText;
                const EntryArrow = entry.href ? ArrowUpRight : ArrowRight;

                return (
                  <article className="memova-journal-entry" key={entry.slug}>
                    <a href={entry.href ?? `/journal/${entry.slug}/`}>
                      <span className="memova-journal-entry-marker">
                        <EntryMarker aria-hidden="true" />
                      </span>
                      <span className="memova-journal-entry-copy">
                        <span className="memova-journal-entry-type">
                          {entry.category}
                        </span>
                        <strong>{entry.title}</strong>
                        <span className="memova-journal-entry-summary">
                          {entry.summary}
                        </span>
                        {entry.cover && (
                          <img
                            className="memova-journal-entry-cover"
                            src={entry.cover.src}
                            alt={entry.cover.alt}
                            width={entry.cover.width ?? 1672}
                            height={entry.cover.height ?? 941}
                            decoding="async"
                          />
                        )}
                        <span className="memova-journal-author-row">
                          <span
                            className={`memova-journal-author-avatar${entry.authorAvatar ? " has-photo" : ` is-${entry.authorAvatarPosition}`}`}
                            aria-hidden="true"
                          >
                            {entry.authorAvatar && (
                              <img
                                src={entry.authorAvatar}
                                alt=""
                                width="1122"
                                height="1402"
                              />
                            )}
                          </span>
                          <span>
                            {entry.author}
                            {entry.authorRole ? ` · ${entry.authorRole}` : ""}
                          </span>
                          <span aria-hidden="true">·</span>
                          {entry.date && (
                            <>
                              <time dateTime={entry.isoDate}>{entry.date}</time>
                              <span aria-hidden="true">·</span>
                            </>
                          )}
                          <span>{entry.readingTime}</span>
                        </span>
                      </span>
                      <EntryArrow
                        className="memova-journal-entry-arrow"
                        aria-hidden="true"
                      />
                    </a>
                  </article>
                );
              })
            ) : (
              <div className="memova-journal-empty">
                <span
                  className="memova-journal-future-marker"
                  aria-hidden="true"
                />
                <div>
                  <strong>
                    {journalEntries.length
                      ? "No published notes in this category yet."
                      : "New stories are on the way."}
                  </strong>
                </div>
              </div>
            )}
          </div>

          <div className="memova-journal-back-row">
            <a href="/#top">
              <ArrowLeft aria-hidden="true" />
              Back to Memova
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
