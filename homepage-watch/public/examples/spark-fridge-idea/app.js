(() => {
  "use strict";
  const panel = document.getElementById("conversation");
  const status = document.getElementById("case-status");
  let content;
  let stage = "idea";
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("icon"); svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#icon-" + name); svg.append(use); return svg;
  }
  function label(text, symbol) {
    const p = el("p", "message-label");
    if (symbol) p.append(icon(symbol));
    p.append(document.createTextNode(text)); return p;
  }
  function message(title, paragraphs, assistant = false) {
    const card = el("article", "message" + (assistant ? " assistant" : " original"));
    card.append(label(title, assistant ? "spark" : null));
    paragraphs.forEach(text => card.append(el("p", "", text)));
    return card;
  }
  function action(text, kind, symbol, callback) {
    const button = el("button", "action-button");
    button.type = "button"; button.dataset.action = kind;
    const name = el("span", "", text);
    button.append(name, icon("arrow"));
    if (callback) button.addEventListener("click", callback);
    else { button.disabled = true; button.title = "Not used at this point in the recorded conversation."; }
    return button;
  }
  function chip(text, symbol) {
    const p = el("p", "action-chip"); p.append(icon(symbol), document.createTextNode(text)); return p;
  }
  function markUsed(kind) {
    document.querySelectorAll('[data-action="' + kind + '"]').forEach(button => {
      button.disabled = true; button.classList.add("is-used");
      if (kind === "question-01") {
        const row = button.closest("li");
        row?.classList.add("is-chosen");
        const number = row?.querySelector(".number");
        if (number) number.textContent = "✓";
        button.append(el("small", "question-picked", "Add to question 01"));
      }
    });
  }
  function part(id, name) {
    const section = el("section", "conversation-part");
    section.id = id; section.tabIndex = -1; section.setAttribute("aria-label", name); return section;
  }
  function reveal(section, announcement) {
    panel.append(section);
    status.textContent = announcement;
  }
  function showExplore() {
    if (stage !== "idea") return;
    stage = "questions"; markUsed("explore");
    const section = part("exploration", "Spark’s key questions");
    section.append(chip("Explore this idea’s key questions","compass"),message("Spark",content.explore,true));
    const list = el("ol","question-list");
    content.questions.forEach((question,i) => {
      const li = el("li",i===0?"recorded":"is-unavailable");
      li.append(el("span","number",String(i+1).padStart(2,"0")));
      const button = el("button"); button.type="button"; button.dataset.action="question-"+String(i+1).padStart(2,"0");
      button.setAttribute("aria-label","Reply to question "+String(i+1).padStart(2,"0")+": "+question);
      button.append(el("p","",question),icon("back"));
      if(i===0) button.addEventListener("click",showClarification);
      else {button.disabled=true;button.title="No recorded reply was supplied for this question.";}
      li.append(button);
      list.append(li);
    });
    section.append(list); reveal(section,"Spark’s questions are now shown.");
  }
  function showClarification() {
    if(stage !== "questions") return;
    stage = "clarified"; markUsed("question-01");
    const section = part("clarification","Your reply and Spark’s follow-up");
    const reply = el("article","reply-message");
    const quote = el("div","reply-reference");
    quote.append(el("strong","","Reply to question 01"),document.createTextNode(content.questions[0]));
    reply.append(quote,el("p","",content.reply));
    section.append(reply,message("Spark",content.followup,true));
    const next = el("div","next-action");
    next.append(action("Use my knowledge base + web search to enhance this idea","enhance","spark",showEnhanced));
    section.append(next);
    reveal(section,"Your recorded answer and Spark’s follow-up are now shown.");
  }
  function enhancedArticle() {
    const article = el("article","message assistant");
    article.append(label("Spark","spark"),el("h2","",content.title+": less dinner indecision, use what you already have"));
    content.enhanced.forEach(parts=>{
      const p=el("p");
      parts.forEach(part=>{
        if(part.text) p.append(document.createTextNode(part.text));
        if(part.sources) part.sources.forEach(id=>{
          const reference=el("sup","source-reference",String(id));
          reference.title="The source details were not included in the supplied screenshots.";
          p.append(reference);
        });
      });
      article.append(p);
    });
    const sourceButton=el("button","sources-open","Sources");sourceButton.type="button";sourceButton.prepend(icon("globe"));
    sourceButton.disabled=true;sourceButton.title="The source details were not included in the supplied screenshots.";
    article.append(sourceButton);return article;
  }
  function showEnhanced() {
    if(stage !== "clarified") return;
    stage="enhanced";markUsed("enhance");
    const section=part("enhancement","Spark’s suggested additions");
    section.append(chip("Use my knowledge base + web search to enhance this idea","spark"),enhancedArticle());
    const choices=el("div","final-choices");
    const options=[
      ["blend","Blend these additions into my idea."],
      ["keep","Keep my original idea for now, without these additions."]
    ];
    options.forEach(([value,text])=>{
      const button=el("button","action-button");button.type="button";button.dataset.choice=value;
      button.setAttribute("aria-label",text);
      button.disabled=true;
      button.title="The screenshots end before either option is selected.";
      const name=el("span","",text);button.append(name,icon("arrow"));
      choices.append(button);
    });
    section.append(choices);reveal(section,"Spark’s suggested additions are now shown.");
  }
  fetch("./spark-fridge-idea/conversation.json")
    .then(response=>{if(!response.ok)throw new Error("Conversation unavailable");return response.json();})
    .then(data=>{
      content=data;
      panel.append(message("Your original idea",content.original));
      const actions=el("div","action-grid");
      actions.append(
        action("Use my knowledge base + web search to enhance this idea","enhance","spark",null),
        action("Explore this idea’s key questions","explore","compass",showExplore),
        action("Extract the key points from this content","extract","spark",null),
        action("Create a page from the content above","create-page","spark",null)
      );
      panel.append(actions);
      status.textContent="Original idea";
    })
    .catch(()=>{
      const fallback=el("article","message");
      fallback.append(el("h2","","The conversation could not be loaded."),el("p","","Refresh this local preview to try again."));
      panel.replaceChildren(fallback);
    });
})();
