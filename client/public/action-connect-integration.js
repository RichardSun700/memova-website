(function () {
  const OUTPUTS = [
    {
      id: "html",
      tab: "HTML Page",
      title: "Create a Page from the full context.",
      body: "Memova combines the Apollo 11 Technical Crew Debriefing with selected Note highlights, then prepares an interactive mission debrief. The Page is generated only after you choose the output.",
      phoneBody: "Bring your notes and their context into an interactive Page. Choose the output, review it, then confirm generation.",
      ui: "./action-connect-assets/html-action-prd.png",
      uiAlt: "Memova HTML Action screen based on the Apollo 11 Technical Crew Debriefing",
      background: "./action-connect-assets/understanding-tab1-starry-sky.png",
      backgroundAlt: "A dense blue-gray Milky Way sky above silhouetted trees",
      proofTitle: "Interactive mission debrief",
      proofMeta: "9 stages · 8 findings · 5 actions",
      rule: "User chooses HTML and confirms generation",
      cutout: "./action-connect-assets/apollo11-postflight-debrief-cutout.png",
      cutoutAlt: "Neil Armstrong, Michael Collins, and Buzz Aldrin in the Apollo 11 postflight debriefing",
      voice: "Neil Armstrong · Landing",
      quote: "a transparent sheet of moving dust",
      link: "Evidence becomes an HTML Page",
      markerOutput: "HTML PAGE"
    },
    {
      id: "email",
      tab: "Follow-up Email",
      title: "Draft Neil's follow-up from the debrief.",
      phoneTitle: "Turn your notes into a follow-up.",
      phoneBody: "Prepare an email from the findings in your notes. Connect Gmail or Outlook, review the draft, and confirm before anything is sent.",
      body: "Memova turns Neil Armstrong's simulator-fidelity finding into a reviewed follow-up for the training team. Gmail or Outlook must be connected, and nothing is sent until you confirm.",
      ui: "./action-connect-assets/email-action-prd.png",
      uiAlt: "Memova Email Action screen with Gmail connected and a follow-up preview",
      background: "./action-connect-assets/understanding-tab2-starry-sky.png",
      backgroundAlt: "A soft rose and indigo clouded star field",
      proofTitle: "Neil's simulator-fidelity follow-up",
      proofMeta: "NASA debrief evidence · Review first",
      rule: "Nothing is sent until the user confirms",
      cutout: "./action-connect-assets/apollo10-11-transfer-meeting-cutout.png",
      cutoutAlt: "Apollo 10 and Apollo 11 astronauts in a technical knowledge-transfer meeting",
      voice: "Neil Armstrong · Simulator fidelity",
      quote: "There are a lot of areas that could very well stand an improved visual simulation for training.",
      link: "Neil's finding becomes a follow-up",
      markerOutput: "FOLLOW-UP EMAIL"
    },
    {
      id: "calendar",
      tab: "Calendar",
      title: "Schedule Neil's follow-up review.",
      phoneTitle: "Plan your next review.",
      phoneBody: "Turn next steps into a calendar draft. With your permission, Memova checks availability and shows conflicts before you confirm.",
      body: "Memova turns Neil Armstrong's recommendation into a calendar draft for smaller, focused training sessions. With permission, it checks availability and shows conflicts before you confirm.",
      ui: "./action-connect-assets/calendar-action-prd.png",
      uiAlt: "Memova Calendar Action screen showing an Apollo 11 lessons review and scheduling conflict",
      background: "./action-connect-assets/calendar-stage-bg.jpg",
      backgroundAlt: "Apollo lunar module on the Moon",
      proofTitle: "Neil's focused training review",
      proofMeta: "Smaller sessions · Conflict-aware",
      rule: "Memova never moves or edits an event silently",
      cutout: "./action-connect-assets/buzz-aldrin-zero-g-camera-cutout-v1.png",
      cutoutAlt: "Buzz Aldrin in an Apollo spacesuit holding a chest-mounted camera during training",
      voice: "Neil Armstrong · Training cadence",
      quote: "It would be better to have a number of smaller sessions.",
      link: "Neil's recommendation becomes a review",
      markerOutput: "CALENDAR REVIEW"
    }
  ];

  function installActionConnect() {
    const section = document.getElementById("act");
    if (!section || section.dataset.actionIntegration === "granola-prd") return;
    const phoneQuery = window.matchMedia("(max-width: 760px)");

    const previous = section.querySelector(".ac-shell, .ac-granola-shell");
    if (previous) previous.remove();

    section.dataset.actionIntegration = "granola-prd";
    section.classList.add("action-connect-ready");
    section.classList.add("ac-play-sequence");

    const shell = document.createElement("div");
    shell.className = "ac-granola-shell";
    shell.innerHTML = `
      <header class="ac-granola-intro" id="capture">
        <span>02 · Knowledge into action</span>
        <h2>From context to content.</h2>
        <p>Collect notes, voice, and files. Memova connects their context into a knowledge base, ready to create Pages and share your progress—after your review.</p>
        <p class="ac-context-path">Context → Knowledge → Content</p>
      </header>

      <div class="ac-granola-feature">
        <nav class="ac-output-tabs" role="tablist" aria-label="Suggested Action output types">
          ${OUTPUTS.map((item, index) => `<button class="ac-output-tab${index === 0 ? " is-active" : ""}" id="ac-tab-${item.id}" type="button" role="tab" aria-controls="ac-output-panel" aria-selected="${index === 0 ? "true" : "false"}" tabindex="${index === 0 ? "0" : "-1"}" data-output="${item.id}"><span>${item.tab}</span></button>`).join("")}
        </nav>

        <div class="ac-feature-main" id="ac-output-panel" role="tabpanel" aria-labelledby="ac-tab-html">
          <div class="ac-feature-copy">
            <h3 data-ac-title></h3>
            <p data-ac-body></p>
          </div>

          <figure class="ac-product-stage" data-ac-stage>
            <img loading="lazy" decoding="async" class="ac-stage-background" data-ac-background alt="">
            <div class="ac-meeting-focus" aria-label="A real meeting voice connected to the selected Memova Action">
              <span class="ac-meeting-kicker">Apollo 11 · Technical Crew Debriefing · 31 Jul 1969</span>
              <img loading="lazy" decoding="async" class="ac-meeting-cutout" data-ac-cutout alt="">
              <div class="ac-action-quote" aria-live="polite">
                <img loading="lazy" decoding="async" class="ac-quote-frame" src="./action-connect-assets/speech-bubble-handdrawn.png" alt="">
                <span class="ac-quote-content">
                  <small data-ac-voice></small>
                  <q data-ac-quote></q>
                  <strong data-ac-link></strong>
                </span>
              </div>
            </div>

            <div class="ac-input-output-marker" role="img" aria-label="Meeting evidence is understood by Memova and becomes an action only after approval">
              <img loading="lazy" decoding="async" class="ac-input-output-marker__wave" src="./action-connect-assets/action-flow-wave-v3.svg" alt="" aria-hidden="true">
              <span class="ac-input-output-marker__node ac-input-output-marker__node--input"><small>01</small><b>MEETING EVIDENCE</b></span>
              <span class="ac-input-output-marker__node ac-input-output-marker__node--understand"><small>02</small><b>MEMOVA UNDERSTANDS</b></span>
              <strong class="ac-input-output-marker__node ac-input-output-marker__node--output"><small>03 · AFTER APPROVAL</small><b data-ac-marker-output>HTML PAGE</b></strong>
            </div>

            <div class="ac-stage-ui-wrap"><img loading="lazy" decoding="async" class="ac-stage-ui" data-ac-ui alt=""></div>
            <figcaption>One meeting becomes three source-grounded actions. Nothing runs until you confirm.</figcaption>
          </figure>

          <div class="ac-prd-rule">
            <span>Apollo 11 · After the Giant Leap</span>
            <span data-ac-rule></span>
          </div>
        </div>
      </div>`;

    if (phoneQuery.matches) {
      // On phones the product itself is the preview; remove decorative assets
      // before assigning URLs or decoding images.
      shell.querySelectorAll(".ac-stage-background, .ac-meeting-focus, .ac-input-output-marker").forEach(node => node.remove());
      const preview = document.createElement("a");
      preview.dataset.acOpenPreview = "true";
      preview.target = "_blank";
      preview.rel = "noopener";
      preview.setAttribute("aria-label", "Open full-size product preview");
      const wrap = shell.querySelector(".ac-stage-ui-wrap");
      preview.append(wrap.querySelector("img"));
      wrap.append(preview);
      shell.querySelector("figcaption").textContent = "Product preview · tap to enlarge";
    }
    section.appendChild(shell);

    const tabs = Array.from(shell.querySelectorAll(".ac-output-tab"));
    const stage = shell.querySelector("[data-ac-stage]");
    const title = shell.querySelector("[data-ac-title]");
    const body = shell.querySelector("[data-ac-body]");
    const ui = shell.querySelector("[data-ac-ui]");
    const background = shell.querySelector("[data-ac-background]");
    const rule = shell.querySelector("[data-ac-rule]");
    const cutout = shell.querySelector("[data-ac-cutout]");
    const voice = shell.querySelector("[data-ac-voice]");
    const quote = shell.querySelector("[data-ac-quote]");
    const link = shell.querySelector("[data-ac-link]");
    const markerOutput = shell.querySelector("[data-ac-marker-output]");
    const panel = shell.querySelector(".ac-feature-main");
    let activeId;
    let hasEntered = false;
    let imagesReady = false;
    let renderVersion = 0;
    let playFrame = 0;
    let nearViewport = false;
    let loadedId;

    function loadArtwork() {
      if (!nearViewport || activeId === loadedId) return;
      const item = OUTPUTS.find(output => output.id === activeId);
      if (!item) return;
      const version = renderVersion;
      loadedId = item.id;
      const images = [[ui, item.ui], [background, item.background], [cutout, item.cutout]]
        .filter(([image]) => image);
      if (phoneQuery.matches && item.uiSrcSet) { ui.srcset = item.uiSrcSet; ui.sizes = "calc(100vw - 40px)"; }
      images.forEach(([image, src]) => { image.src = src; });
      const preview = shell.querySelector("[data-ac-open-preview]");
      if (preview) preview.href = item.ui;
      Promise.all(images.map(([image]) => image.decode().catch(() => {}))).then(() => {
        if (version !== renderVersion) return;
        imagesReady = true;
        playSequence();
      });
    }

    function playSequence() {
      if (phoneQuery.matches) { stage.classList.add("is-playing"); return; }
      if (!hasEntered || !imagesReady) return;
      window.cancelAnimationFrame(playFrame);
      stage.classList.remove("is-playing");
      // Give the reset one paint so a tab change restarts only the short sequence.
      playFrame = window.requestAnimationFrame(function () {
        playFrame = window.requestAnimationFrame(function () {
          stage.classList.add("is-playing");
        });
      });
    }

    function render(id) {
      const item = OUTPUTS.find(output => output.id === id) || OUTPUTS[0];
      if (item.id === activeId) return;
      const version = ++renderVersion;
      activeId = item.id;
      imagesReady = false;
      window.cancelAnimationFrame(playFrame);
      stage.classList.remove("is-playing");
      section.dataset.actionMode = item.id;
      panel.setAttribute("aria-labelledby", `ac-tab-${item.id}`);

      tabs.forEach(tab => {
        const selected = tab.dataset.output === item.id;
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
      });

      title.textContent = phoneQuery.matches ? (item.phoneTitle || item.title) : item.title;
      body.textContent = phoneQuery.matches ? item.phoneBody : item.body;
      ui.alt = item.uiAlt;
      if (background) background.alt = item.backgroundAlt;
      rule.textContent = item.rule;
      if (cutout) cutout.alt = item.cutoutAlt;
      if (voice) voice.textContent = item.voice;
      if (quote) quote.textContent = item.quote;
      if (link) link.textContent = item.link;
      if (markerOutput) markerOutput.textContent = item.markerOutput;

      // decode() initiates a request even for a lazy image. Wait until this
      // chapter is near the viewport, and load only the selected output.
      loadArtwork();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", function () { render(tab.dataset.output); });
      tab.addEventListener("keydown", function (event) {
        let nextIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index + tabs.length - 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex === undefined) return;
        event.preventDefault();
        tabs[nextIndex].focus({ preventScroll: true });
        render(tabs[nextIndex].dataset.output);
      });
    });

    const observer = new IntersectionObserver(function (entries) {
      if (!entries.some(entry => entry.isIntersecting)) return;
      hasEntered = true;
      playSequence();
      observer.disconnect();
    }, { threshold: .12, rootMargin: "-72px 0px 0px" });
    const mediaObserver = new IntersectionObserver(function (entries) {
      if (!entries.some(entry => entry.isIntersecting)) return;
      nearViewport = true;
      loadArtwork();
      mediaObserver.disconnect();
    }, { rootMargin: "240px 0px" });

    render(OUTPUTS[0].id);
    observer.observe(stage);
    mediaObserver.observe(stage);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installActionConnect, { once: true });
  } else {
    installActionConnect();
  }
})();
