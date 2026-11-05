import { ArrowLeft, ArrowUpRight, ChevronDown, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getJournalEntry, type JournalBlock } from "@/content/journalEntries";
import "@/styles/journal.css";

type JournalArticleProps = { slug: string };

// A deliberately small inline format for authored copy. No raw HTML is accepted.
function RichText({ text }: { text: string }) {
  const parts = text.split(
    /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g
  );
  return (
    <>
      {parts.map((part, index) => {
        const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        if (link)
          return (
            <a
              key={index}
              href={link[2]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link[1]}
            </a>
          );
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={index}>{part.slice(1, -1)}</em>;
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <figure className="memova-article-figure">
      <button
        className="memova-article-image-button"
        type="button"
        aria-label={`Enlarge image: ${alt}`}
        onClick={() => dialog.current?.showModal()}
      >
        <img
          src={src}
          alt={alt}
          width="1672"
          height="941"
          loading="lazy"
          decoding="async"
        />
        <span aria-hidden="true" className="memova-article-image-expand">
          <ArrowUpRight size={18} />
        </span>
      </button>
      <dialog
        className="memova-article-lightbox"
        ref={dialog}
        aria-label="Enlarged product image"
        onClick={event => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="memova-article-lightbox-close"
          type="button"
          aria-label="Close enlarged image"
          onClick={() => dialog.current?.close()}
        >
          <X size={22} />
        </button>
        <img src={src} alt={alt} width="1672" height="941" />
      </dialog>
    </figure>
  );
}

function ArticleBlock({ block }: { block: JournalBlock }): ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "heading":
      return <h3>{block.text}</h3>;
    case "image":
      return <ArticleImage src={block.src} alt={block.alt} />;
    case "list":
      return (
        <ul>
          {block.items.map(item => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <aside className="memova-article-note">
          <RichText text={block.text} />
        </aside>
      );
    case "table":
      return (
        <div
          className="memova-article-table-wrap"
          role="region"
          aria-label={block.caption}
          tabIndex={0}
        >
          <table className="memova-article-table">
            <caption className="sr-only">{block.caption}</caption>
            <colgroup>
              {block.headers.map((header, index) => (
                <col
                  key={header}
                  className={`memova-article-table-col-${index}`}
                />
              ))}
            </colgroup>
            <thead>
              <tr>
                {block.headers.map(header => (
                  <th scope="col" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map(row => (
                <tr key={row[0]}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th scope="row" key={index}>
                        <RichText text={cell} />
                      </th>
                    ) : (
                      <td key={index}>
                        <RichText text={cell} />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div className="memova-article-faq">
          {block.items.map(item => (
            <details key={item.question}>
              <summary>
                {item.question}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <p>
                <RichText text={item.answer} />
              </p>
            </details>
          ))}
        </div>
      );
  }
}

export default function JournalArticle({ slug }: JournalArticleProps) {
  const entry = getJournalEntry(slug);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || !entry) return;
    const sections = Array.from(
      body.querySelectorAll<HTMLElement>(".memova-article-section[id]")
    );
    if (!sections.length) return;
    let frame: number | undefined;

    const updateActiveSection = () => {
      frame = undefined;
      // Match the anchor landing position below the fixed site header.
      const readingLine =
        (parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 112) + 2;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        current = section.id;
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        current = sections[sections.length - 1].id;
      }
      setActiveSectionId(current);
    };
    const scheduleUpdate = () => {
      if (frame === undefined)
        frame = requestAnimationFrame(updateActiveSection);
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(body);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    scheduleUpdate();
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [entry]);

  return (
    <div className="memova-home-theme memova-journal-page memova-article-page">
      <SiteHeader current="journal" navigationMode="watch" />
      {entry ? (
        <main>
          <article>
            <header className="memova-article-header">
              <a href="/journal/" className="memova-article-back">
                <ArrowLeft size={15} aria-hidden="true" />
                Back to Blog
              </a>
              <div className="memova-article-eyebrow">
                <span>{entry.category}</span>
                {entry.status && (
                  <span className="memova-article-status">{entry.status}</span>
                )}
              </div>
              <h1>{entry.title}</h1>
              <p className="memova-article-deck">{entry.summary}</p>
              <div className="memova-article-byline">
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
                <div>
                  <strong>{entry.author}</strong>
                  {entry.authorRole && <span>{entry.authorRole}</span>}
                </div>
                <div className="memova-article-byline-meta">
                  {entry.date && (
                    <time dateTime={entry.isoDate}>{entry.date}</time>
                  )}
                  <span>{entry.readingTime}</span>
                </div>
              </div>
            </header>
            <div className="memova-article-layout">
              <aside
                className="memova-article-toc"
                aria-label="Article contents"
              >
                <div className="memova-article-toc-desktop">
                  <span className="memova-article-toc-label">
                    In this article
                  </span>
                  <nav aria-label="On this page">
                    {entry.sections.map((section, index) => (
                      <a
                        key={section.heading}
                        href={`#${section.id ?? `section-${index + 1}`}`}
                        aria-current={
                          activeSectionId ===
                          (section.id ?? `section-${index + 1}`)
                            ? "location"
                            : undefined
                        }
                      >
                        {section.heading}
                      </a>
                    ))}
                  </nav>
                </div>
                <details className="memova-article-toc-mobile">
                  <summary>
                    In this article <ChevronDown size={14} aria-hidden="true" />
                  </summary>
                  <nav aria-label="Article chapters">
                    {entry.sections.map((section, index) => (
                      <a
                        key={section.heading}
                        href={`#${section.id ?? `section-${index + 1}`}`}
                        aria-current={
                          activeSectionId ===
                          (section.id ?? `section-${index + 1}`)
                            ? "location"
                            : undefined
                        }
                      >
                        {section.heading}
                      </a>
                    ))}
                  </nav>
                </details>
              </aside>
              <div className="memova-article-body" ref={bodyRef}>
                {entry.editorialNote && (
                  <p className="memova-article-intro-note">
                    {entry.editorialNote}
                  </p>
                )}
                {entry.sections.map((section, index) => (
                  <section
                    id={section.id ?? `section-${index + 1}`}
                    key={section.heading}
                    className="memova-article-section"
                  >
                    <h2>{section.heading}</h2>
                    {section.paragraphs?.map(paragraph => (
                      <p key={paragraph}>
                        <RichText text={paragraph} />
                      </p>
                    ))}
                    {section.blocks?.map((block, blockIndex) => (
                      <ArticleBlock key={blockIndex} block={block} />
                    ))}
                    {section.bullets && (
                      <ul>
                        {section.bullets.map(bullet => (
                          <li key={bullet}>
                            <RichText text={bullet} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
                <div className="memova-article-cta">
                  <div>
                    <span>Memova for Apple Watch</span>
                    <h2>
                      Keep the words.
                      <br />
                      Come back to them.
                    </h2>
                    <p>
                      Explore recording, on-device transcription, and search
                      today.
                    </p>
                  </div>
                  <a
                    href="https://apps.apple.com/us/app/memova-ai/id6796284954"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Memova AI{" "}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </div>
                <footer className="memova-article-end">
                  <a href="/journal/">
                    <ArrowLeft size={15} aria-hidden="true" />
                    All articles
                  </a>
                  <span>
                    Written by {entry.author} · {entry.authorRole}
                  </span>
                </footer>
              </div>
            </div>
          </article>
        </main>
      ) : (
        <main className="memova-article-not-found">
          <span>Memova Blog</span>
          <h1>Article not found.</h1>
          <p>This article is no longer available.</p>
          <a href="/journal/">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Blog
          </a>
        </main>
      )}
      <SiteFooter />
    </div>
  );
}
