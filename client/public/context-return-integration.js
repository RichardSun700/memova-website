(() => {
  const SECTION_ID = "return";
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const bilingual = (en, zh) => `<span class="mobile-copy-en">${en}</span><span class="mobile-copy-zh">${zh}</span>`;
  const feedbackExamples = {
    training: {
      reply: ["Let's carry the simulator differences into the next training plan.", "把模拟器与真实任务的差异，也纳入下一轮训练吧。"],
      note: ["Include simulator differences in the next training review.", "把模拟器与真实任务的差异，纳入下一次训练复盘。"],
      post: ["Before that small step came countless small rehearsals.", "这一小步之前，是无数次小练习。"],
    },
    decisions: {
      reply: ["Let's keep the reasoning behind each decision for the next review.", "也把每次判断背后的依据，留给下一次复盘吧。"],
      note: ["Keep each mission decision connected to its evidence.", "让任务中的每次判断，始终关联它的依据。"],
      post: ["The footprint is easy to see. The decisions behind it are not.", "脚印看得见，背后的判断却不容易被看见。"],
    },
    teamwork: {
      reply: ["Let's add the team's handoff lessons to the mission record.", "把团队的交接经验，也补进任务复盘吧。"],
      note: ["Connect team handoff lessons to the mission record.", "将团队的交接经验，与任务资料关联起来。"],
      post: ["A footprint on the Moon. A whole team behind it.", "月面上是一串脚印，背后是一整个团队。"],
    },
  };

  const mobileFeedbackMarkup = () => `
    <div class="memova-return-mobile" data-return-mobile data-feedback-state="pending" data-no-translate>
      <header class="return-mobile-intro">
        <p>${bilingual("04 · FEEDBACK INTO CONTEXT", "04 · 反馈沉淀")}</p>
        <h2 id="memova-return-mobile-title">${bilingual('<span class="mobile-heading-phrase">Feedback,</span> <span class="mobile-heading-phrase">back into knowledge.</span>', '<span class="mobile-heading-phrase">让反馈，</span><span class="mobile-heading-phrase">回到知识库。</span>')}</h2>
        <div>${bilingual("You choose which replies are worth keeping.", "你决定，哪些回复值得留下。")}</div>
      </header>
      <div class="return-mobile-thread">
        <div class="return-mobile-origin">
          <a href="#social-distribution" data-feedback-source></a>
          <p data-feedback-post></p>
        </div>
        <article class="return-mobile-reply">
          <header><span aria-hidden="true">↳</span><div><strong>${bilingual("Mission review team", "任务复盘组")}</strong><small>${bilingual("Illustrative reply", "假想回复示例")}</small></div></header>
          <blockquote data-feedback-quote></blockquote>
        </article>
        <div class="return-mobile-destination">
          <img data-feedback-mobile-src="/demo/icons/memova-book.svg" width="40" height="40" alt="">
          <div><span>${bilingual("NEIL'S MISSION KNOWLEDGE BASE", "尼尔的任务知识库")}</span><strong data-feedback-note></strong><small>${bilingual("Private · Source-linked", "私密 · 保留来源")}</small></div>
        </div>
      </div>
      <p class="return-mobile-status" role="status" data-feedback-status></p>
      <div class="return-mobile-actions">
        <button type="button" data-feedback-keep>${bilingual("Try saving to knowledge", "演示保存到知识库")}</button>
        <button type="button" data-feedback-dismiss>${bilingual("Skip this reply", "此次不保存")}</button>
        <button type="button" data-feedback-reset hidden>${bilingual("Try again", "再试一次")}</button>
      </div>
      <details class="return-mobile-sources">
        <summary>${bilingual("Keep the source and context", "保留来源与背景")}<span aria-hidden="true">3</span></summary>
        <ul>
          <li><a href="#social-distribution">${bilingual("Original post · Previous chapter", "原帖 · 上一章的分享内容")}</a></li>
          <li><span>${bilingual("This reply · Illustrative feedback", "这条回复 · 假想反馈示例")}</span></li>
          <li><a href="/demo/note-overview/#source">${bilingual("Mission evidence · NASA crew debrief", "任务资料 · NASA 乘组复盘")}</a></li>
        </ul>
      </details>
      <p class="return-mobile-disclosure">${bilingual("Illustrative interaction · Not a real reply.", "假想交互演示 · 非真实回复。")}</p>
    </div>
  `;

  function installMobileFeedback(section, phoneQuery) {
    const mobile = section.querySelector("[data-return-mobile]");
    if (!mobile) return;
    let topic = "training";
    let platform = "x";
    let state = "pending";
    const keep = mobile.querySelector("[data-feedback-keep]");
    const dismiss = mobile.querySelector("[data-feedback-dismiss]");
    const reset = mobile.querySelector("[data-feedback-reset]");
    function render() {
      const example = feedbackExamples[topic];
      const labels = platform === "linkedin" ? ["From the LinkedIn link post", "来自 LinkedIn 链接帖"] : platform === "other" ? ["From the video post", "来自视频帖"] : ["From the X image post", "来自 X 图片帖"];
      mobile.dataset.feedbackState = state;
      mobile.querySelector("[data-feedback-source]").innerHTML = bilingual(...labels);
      const original = document.querySelector(`[data-showcase-panel="${platform}"] .social-context-showcase__post-copy`);
      const lang = document.documentElement.dataset.siteLanguage === "zh" ? 1 : 0;
      mobile.querySelector("[data-feedback-post]").textContent = original?.textContent.trim().split("\n")[0] || example.post[lang];
      mobile.querySelector("[data-feedback-quote]").innerHTML = bilingual(...example.reply);
      mobile.querySelector("[data-feedback-note]").innerHTML = state === "saved" ? bilingual(...example.note) : bilingual("Apollo 11 · Awaiting your approval", "阿波罗 11 号 · 等待你确认");
      const status = state === "saved" ? ["Demo saved as a private Note. Its context stays connected.", "示例已保存为私密笔记，背景与来源一起保留。"] : state === "dismissed" ? ["Demo skipped. The knowledge base is unchanged.", "示例已跳过，知识库没有变化。"] : ["Awaiting review · Nothing saved yet", "等待你审核 · 尚未保存"];
      mobile.querySelector("[data-feedback-status]").innerHTML = bilingual(...status);
      keep.hidden = dismiss.hidden = state !== "pending";
      reset.hidden = state === "pending";
    }
    function syncExample(detail) {
      if (!detail || !feedbackExamples[detail.topic] || !["x", "linkedin", "other"].includes(detail.platform)) return;
      if (topic !== detail.topic || platform !== detail.platform) state = "pending";
      topic = detail.topic;
      platform = detail.platform;
      render();
    }
    keep.addEventListener("click", () => { state = "saved"; render(); reset.focus(); });
    dismiss.addEventListener("click", () => { state = "dismissed"; render(); reset.focus(); });
    reset.addEventListener("click", () => { state = "pending"; render(); keep.focus(); });
    window.addEventListener("memova:socialexamplechange", (event) => syncExample(event.detail));
    window.addEventListener("memova:languagechange", render);
    const initialTopic = document.querySelector("[data-mobile-highlight]")?.value;
    const initialPlatform = document.querySelector('[data-showcase-tab][aria-selected="true"]')?.dataset.showcaseTab;
    syncExample({ topic: initialTopic || topic, platform: initialPlatform || platform });
    function responsive() {
      section.setAttribute("aria-labelledby", phoneQuery.matches ? "memova-return-mobile-title" : "memova-return-title");
      mobile.querySelectorAll("img[data-feedback-mobile-src]").forEach((image) => {
        if (phoneQuery.matches) image.setAttribute("src", image.dataset.feedbackMobileSrc);
        else image.removeAttribute("src");
      });
      section.querySelectorAll(".memova-return-story__layout img").forEach((image) => {
        if (phoneQuery.matches) {
          if (image.hasAttribute("src")) image.dataset.returnDesktopSrc = image.getAttribute("src");
          image.removeAttribute("src");
        } else if (image.dataset.returnDesktopSrc) image.src = image.dataset.returnDesktopSrc;
      });
    }
    phoneQuery.addEventListener?.("change", responsive);
    responsive();
  }

  function updatePagination(section) {
    document.querySelectorAll(".five-page-number").forEach((number) => {
      const value = number.textContent.trim().split("/")[0].trim();
      number.textContent = `${value} / 05`;
    });

    const shareChapter = document.querySelector("#share .share-social-fan__intro > p");
    if (shareChapter) shareChapter.textContent = "03 · SHARE";

    const rail = document.querySelector('.five-page-rail[aria-label="Homepage sections"]');
    if (!rail || rail.querySelector('a[href="#return"]')) return;

    const shareLink = rail.querySelector('a[href="#share"]');
    if (shareLink) shareLink.setAttribute("aria-label", "3. Share");

    const waitlistLink = rail.querySelector('a[href="#waitlist"]');
    const returnLink = document.createElement("a");
    returnLink.href = "#return";
    returnLink.setAttribute("aria-label", "4. Feedback + Living Book");
    returnLink.innerHTML = "<span>04</span>";
    rail.insertBefore(returnLink, waitlistLink);

    if (waitlistLink) {
      waitlistLink.setAttribute("aria-label", "5. Download the app");
      const number = waitlistLink.querySelector("span");
      if (number) number.textContent = "05";
    }

    const ownNumber = section.querySelector(".five-page-number");
    if (ownNumber) ownNumber.textContent = "04 / 05";
  }

  const sidebarMarkup = () => `
    <aside class="memova-return-demo__sidebar" aria-label="Living Book navigation">
      <strong>MEMOVA</strong>
      <small>NEIL'S LIVING BOOK</small>
      <a class="is-current" href="#return">Today <span>1</span></a>
      <a href="#return">Apollo 11</a>
      <a href="#return">Personal Manual</a>
      <footer>Local · Source-linked</footer>
    </aside>
  `;

  const demoMarkup = (state, viewMarkup) => `
    <div class="memova-return-demo" data-return-demo data-return-state="${state}">
      <header class="memova-return-demo__chrome">
        <div aria-hidden="true"><i></i><i></i><i></i></div>
        <strong>memova.local / neil-armstrong / apollo-11</strong>
        <span>PRIVATE</span>
      </header>
      <div class="memova-return-demo__body">
        ${sidebarMarkup()}
        <main class="memova-return-demo__surface">${viewMarkup}</main>
      </div>
      <div class="memova-return-signal" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>
  `;

  const feedbackView = () => `
    <section class="memova-return-view memova-return-view--feedback is-active" aria-label="Feedback received from a shared Page">
      <img loading="lazy" decoding="async" class="memova-return-blocks memova-return-blocks--feedback" src="./return-knowledge-blocks-v1.png" alt="" aria-hidden="true">
      <div class="memova-return-view__copy">
        <span>NEW RESPONSE · SHARED PAGE</span>
        <h3>A useful detail came back.</h3>
        <p>Someone responded to Neil's <strong>After the Giant Leap</strong> Page. The response stays attached to the source that prompted it.</p>
        <div class="memova-return-quote">
          “Keep Neil's simulator-fidelity finding attached to the training recommendation—it changes how the next review should be planned.”
          <small>Mission Review Team · Illustrative feedback · 2 minutes ago</small>
        </div>
        <div class="memova-return-response-meta" aria-label="Response context">
          <article><span>FROM</span><strong>Mission team</strong><small>Verified collaborator</small></article>
          <article><span>RELATED NODE</span><strong>Simulator fidelity</strong><small>Training evidence</small></article>
          <article><span>STATE</span><strong>Awaiting review</strong><small>Not saved yet</small></article>
        </div>
      </div>
      <figure class="memova-return-source-preview">
        <img loading="lazy" decoding="async" src="./action-connect-assets/action-html.png" alt="Apollo 11 HTML Page preview">
        <figcaption><span>PUBLIC PAGE</span><strong>After the Giant Leap</strong><small>Source-linked · 1 new response</small></figcaption>
      </figure>
    </section>
  `;

  const reviewView = () => `
    <section class="memova-return-view memova-return-view--review is-active" aria-label="Review feedback before it returns to memory">
      <img loading="lazy" decoding="async" class="memova-return-blocks memova-return-blocks--review" src="./return-knowledge-blocks-v1.png" alt="" aria-hidden="true">
      <div class="memova-return-review-card">
        <header><span>REVIEW BEFORE REMEMBERING</span><strong>Choose what returns to your memory.</strong></header>
        <blockquote>“Keep Neil's simulator-fidelity finding attached to the training recommendation…”</blockquote>
        <div class="memova-return-provenance">
          <article class="is-source"><b>01</b><span>SOURCE</span><strong>Shared Page</strong><small>After the Giant Leap</small></article>
          <article class="is-relation"><b>02</b><span>RELATION</span><strong>Simulator fidelity</strong><small>Neil's evidence thread</small></article>
          <article class="is-destination"><b>03</b><span>DESTINATION</span><strong>Neil's Apollo 11 Book</strong><small>Private by default</small></article>
        </div>
        <footer>
          <span class="memova-return-review-note">Nothing is remembered until you choose.</span>
          <button type="button" class="memova-return-secondary" data-return-dismiss>Dismiss</button>
          <button type="button" class="memova-return-primary" data-return-keep>Keep as context</button>
        </footer>
      </div>
    </section>
  `;

  const bookView = () => `
    <section class="memova-return-view memova-return-view--book is-active" aria-label="Feedback saved to the Living Book">
      <img loading="lazy" decoding="async" class="memova-return-blocks memova-return-blocks--book" src="./return-knowledge-blocks-v1.png" alt="" aria-hidden="true">
      <header class="memova-return-book-header">
        <div><span>NEIL'S LIVING BOOK</span><h3>Apollo 11</h3></div>
        <b>Updated just now</b>
      </header>
      <article class="memova-return-note">
        <div class="memova-return-note__status"><span>NEW NOTE</span><b>Saved from feedback</b></div>
        <h4>Simulator fidelity should remain linked to Neil's training recommendation.</h4>
        <p>The approved response is now a private Note in Neil's imagined Living Book. Its Page, feedback, and source evidence remain connected for the next Ask or output.</p>
        <div class="memova-return-note__links">
          <span>Shared Page</span><span>Response</span><span>Simulator fidelity</span>
        </div>
        <div class="memova-return-note__context">
          <article><span>3</span><strong>Connected sources</strong><small>Page · response · evidence</small></article>
          <article><span>1</span><strong>New memory</strong><small>Private note, ready to reuse</small></article>
          <article><span>∞</span><strong>Next questions</strong><small>Begin with this context</small></article>
        </div>
      </article>
      <footer class="memova-return-book-footer"><span>Every approved response becomes context for Neil's next question.</span><strong>Ready for Ask Memova</strong></footer>
    </section>
  `;

  const chapterMarkup = (state, label, title, body, viewMarkup) => `
    <article class="memova-return-chapter${state === 0 ? " is-active" : ""}" data-return-chapter="${state}">
      <header class="memova-return-chapter__copy">
        <p>${label}</p>
        <h3>${title}</h3>
        <div>${body}</div>
      </header>
      ${demoMarkup(state, viewMarkup)}
    </article>
  `;

  function createSection() {
    const share = document.getElementById("share");
    const waitlist = document.getElementById("waitlist");
    if (!share || !waitlist || document.getElementById(SECTION_ID)) return null;

    const section = document.createElement("section");
    section.id = SECTION_ID;
    section.className = "memova-return-story";
    section.setAttribute("aria-labelledby", "memova-return-title");
    section.innerHTML = `
      <span class="five-page-number" aria-hidden="true">04 / 05</span>

      <header class="memova-return-story__intro">
        <p>04 · FEEDBACK + LIVING BOOK</p>
        <h2 id="memova-return-title"><span class="mobile-heading-phrase">What comes back</span> <br><span class="mobile-heading-phrase">becomes context.</span></h2>
        <div>Feedback stays connected to what you shared. You choose what becomes a private Note, ready to inform the next thing you build or publish.</div>
      </header>

      <div class="memova-return-story__layout">
        <nav class="memova-return-story__steps" aria-label="Feedback return stages">
          <button type="button" data-return-step="0" class="is-active">
            <span>01</span><strong>Feedback arrives</strong>
          </button>
          <button type="button" data-return-step="1">
            <span>02</span><strong>Review what returns</strong>
          </button>
          <button type="button" data-return-step="2">
            <span>03</span><strong>Living Book grows</strong>
          </button>
        </nav>

        <div class="memova-return-story__chapters">
          ${chapterMarkup(
            0,
            "Feedback arrives",
            "A response returns with its source.",
            "A Page does not become a dead end after it is shared. New feedback comes back attached to the evidence and context that produced it.",
            feedbackView()
          )}
          ${chapterMarkup(
            1,
            "Review what returns",
            "You decide what becomes memory.",
            "Memova keeps the source, relationship, and destination visible. Nothing enters your private memory until you choose to keep it.",
            reviewView()
          )}
          ${chapterMarkup(
            2,
            "Living Book grows",
            "The next question starts with more context.",
            "Approved feedback becomes a private, source-linked Note—ready to inform your next Ask, decision, or output.",
            bookView()
          )}
        </div>
      </div>
      ${mobileFeedbackMarkup()}
    `;

    waitlist.before(section);
    return section;
  }

  function install(section) {
    if (!section || section.dataset.returnStoryReady === "true") return;
    section.dataset.returnStoryReady = "true";
    updatePagination(section);

    const chapters = [...section.querySelectorAll("[data-return-chapter]")];
    const stepButtons = [...section.querySelectorAll("[data-return-step]")];
    const keepButton = section.querySelector("[data-return-keep]");
    const dismissButton = section.querySelector("[data-return-dismiss]");
    const demos = [...section.querySelectorAll("[data-return-demo]")];
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phoneQuery = window.matchMedia("(max-width: 760px)");
    installMobileFeedback(section, phoneQuery);
    let frame = 0;
    let activeState = -1;

    function setState(nextState) {
      const state = Math.max(0, Math.min(2, nextState));
      activeState = state;
      section.dataset.returnState = String(state);
      chapters.forEach((chapter, index) => {
        chapter.classList.toggle("is-active", index === state);
        chapter.hidden = phoneQuery.matches && index !== state;
      });
      stepButtons.forEach((button, index) => {
        button.classList.toggle("is-active", index === state);
        button.setAttribute("aria-current", index === state ? "step" : "false");
      });
    }

    function scrollToState(state) {
      if (phoneQuery.matches) { setState(state); return; }
      chapters[state]?.scrollIntoView({
        block: "start",
        behavior: motionQuery.matches ? "auto" : "smooth",
      });
    }

    function update() {
      frame = 0;
      if (phoneQuery.matches) return;
      const anchor = Math.min(window.innerHeight * 0.34, 310) + 72;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const containsAnchor = rect.top <= anchor && rect.bottom >= anchor;
        const distance = containsAnchor ? 0 : Math.min(Math.abs(rect.top - anchor), Math.abs(rect.bottom - anchor));
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setState(bestIndex);
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const localProgress = clamp((anchor - rect.top) / Math.max(1, rect.height));
        demos[index]?.style.setProperty("--return-progress", localProgress.toFixed(4));
      });
    }

    function queueUpdate() {
      if (phoneQuery.matches) return;
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    stepButtons.forEach((button, index) => button.addEventListener("click", () => scrollToState(index)));
    keepButton?.addEventListener("click", () => scrollToState(2));
    dismissButton?.addEventListener("click", () => {
      dismissButton.textContent = "Not saved";
      setTimeout(() => { dismissButton.textContent = "Dismiss"; }, 1400);
    });
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    motionQuery.addEventListener?.("change", queueUpdate);
    phoneQuery.addEventListener?.("change", () => { setState(activeState < 0 ? 0 : activeState); queueUpdate(); });
    setState(0);
    queueUpdate();
  }

  function boot() {
    const existing = document.getElementById(SECTION_ID);
    const section = existing || createSection();
    if (!section) return false;
    install(section);
    return true;
  }

  if (!boot()) {
    const observer = new MutationObserver(() => {
      if (boot()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
