(() => {
 "use strict";
 const dialog=document.getElementById("report-dialog"),panel=document.getElementById("report-panel"),tabs=[...document.querySelectorAll("[data-report-tab]")];
 const status=document.getElementById("meeting-status");
 const modes=["transcript","highlights","summary"];
 let meeting,mode="transcript",selectedSources=[],returnFocus;
 const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const findTurn=id=>meeting.transcript.find(turn=>turn.id===id);
 function sourceButton(ids,text="Read the original words ↗") {
  const button=el("button","",text);button.type="button";button.addEventListener("click",()=>openReport("transcript",ids));return button;
 }
 function renderReport() {
  panel.replaceChildren();
  const title={transcript:"The original words.",highlights:"What mattered.",summary:"The meeting, summarized."};
  document.getElementById("report-title").textContent=title[mode];
  tabs.forEach(tab=>{const active=tab.dataset.reportTab===mode;tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1;});
  panel.setAttribute("aria-labelledby","report-tab-"+mode);
  panel.scrollTop=0;
  panel.append(el("p","report-meta","OCT 28, 2026 · "+meeting.timeRange+" · "+meeting.durationMinutes+" minutes"));
  if(mode==="transcript") {
   panel.append(el("p","report-meta",meeting.participants.map(p=>p.name+" / "+p.role).join(" · ")));
   meeting.transcript.forEach(turn=>{
    const article=el("article","transcript-turn"+(selectedSources.includes(turn.id)?" is-highlighted":""));article.dataset.turn=turn.id;
    const meta=el("div","turn-meta");const time=el("time","",turn.time);meta.append(el("strong","",turn.speaker),time);
    article.append(meta,el("p","",turn.text));panel.append(article);
   });
   panel.append(el("p","report-scope",meeting.timeNote));
   if(selectedSources.length)requestAnimationFrame(()=>{
    const target=[...panel.querySelectorAll("[data-turn]")].find(node=>node.dataset.turn===selectedSources[0]);
    if(target)panel.scrollTop+=target.getBoundingClientRect().top-panel.getBoundingClientRect().top-15;
   });
  } else if(mode==="highlights") {
   meeting.highlights.forEach((highlight,i)=>{
    const article=el("article","report-highlight");
    article.append(el("small","eyebrow",String(i+1).padStart(2,"0")+" / HIGHLIGHT"),el("h3","",highlight.title),el("p","",highlight.text),sourceButton(highlight.sourceTurnIds));
    panel.append(article);
   });
   panel.append(el("p","report-scope",meeting.scopeNote));
  } else {
   panel.append(el("p","",meeting.summary),el("blockquote","report-quote",meeting.keyQuote.text),el("h3","","Agreed follow-ups"));
   meeting.actions.forEach(action=>{
    const article=el("article","report-task");
    article.append(el("small","",action.owner+" / "+action.category),el("h3","",action.title),el("p","",action.text),sourceButton(action.sourceTurnIds));
    panel.append(article);
   });
   panel.append(el("p","report-scope",meeting.scopeNote));
  }
 }
 function openReport(next,ids=[]) {
  if(!meeting)return;
  if(!dialog.open)returnFocus=document.activeElement;
  mode=modes.includes(next)?next:"summary";selectedSources=ids;
  renderReport();
  if(!dialog.open)dialog.showModal();
  document.getElementById("close-report").focus({preventScroll:true});
 }
 function closeReport() {
  dialog.close();
  if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
 }
 document.getElementById("close-report").addEventListener("click",closeReport);
 dialog.addEventListener("cancel",event=>{event.preventDefault();closeReport();});
 dialog.addEventListener("click",event=>{
  if(event.target!==dialog)return;
  const rect=dialog.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeReport();
 });
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&dialog.open){event.preventDefault();event.stopPropagation();closeReport();}
 },true);
 tabs.forEach((tab,i)=>{
  tab.addEventListener("click",()=>{mode=tab.dataset.reportTab;selectedSources=[];renderReport();});
  tab.addEventListener("keydown",event=>{
   const next=event.key==="ArrowRight"?i+1:event.key==="ArrowLeft"?i-1:event.key==="Home"?0:event.key==="End"?2:null;
   if(next===null)return;event.preventDefault();mode=modes[(next+3)%3];selectedSources=[];renderReport();tabs[(next+3)%3].focus();
  });
 });
 document.querySelectorAll("[data-report]").forEach(button=>button.addEventListener("click",()=>openReport(button.dataset.report)));
 document.querySelectorAll("[data-source]").forEach(button=>button.addEventListener("click",()=>openReport("transcript",[button.dataset.source])));
 fetch("./meeting-outcome-library/meeting.json")
  .then(response=>{if(!response.ok)throw new Error("Meeting unavailable");return response.json();})
  .then(data=>{
   meeting=data;
   const list=document.getElementById("followup-list");
   meeting.actions.forEach(action=>{
    const row=el("article","followup-row");
    const person=el("div","followup-person");person.append(el("strong","",action.owner),el("span","",action.category));
    const copy=el("div","followup-copy");copy.append(el("h3","",action.shortTitle),el("p","",action.text),sourceButton(action.sourceTurnIds));
    const review=el("div","followup-review");review.append(el("span","followup-state",action.state));
    const label=el("label"),checkbox=el("input");checkbox.type="checkbox";checkbox.setAttribute("aria-label","Mark reviewed: "+action.title);
    const text=el("span","","Mark reviewed");
    checkbox.addEventListener("change",()=>{text.textContent=checkbox.checked?"Reviewed":"Mark reviewed";status.textContent=action.owner+"’s follow-up "+(checkbox.checked?"marked reviewed.":"review mark cleared.");});
    label.append(checkbox,text);review.append(label);
    row.append(person,copy,review);list.append(row);
   });
   document.querySelectorAll("[data-report],[data-source]").forEach(button=>button.disabled=false);
  })
  .catch(()=>{document.getElementById("followup-list").append(el("p","review-note","The meeting content could not be loaded. Refresh this local preview to try again."));});
})();

