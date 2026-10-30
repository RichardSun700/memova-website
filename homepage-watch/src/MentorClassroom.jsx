import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, PushPin, X } from "@phosphor-icons/react";
import { WindChimes } from "./WindChimes";
import "./MentorClassroom.css";

const ASSETS = "/assets/mentor-classroom/";
const TIPS = [
  { id: "partner-conversation", topic: "LISTENING", title: "Put the phone down, then respond", quote: "Sorry, I got distracted. Can you say that again?", position: [46, 17], tilt: -3 },
  { id: "dating-boundaries", topic: "BOUNDARIES", title: "State your boundary clearly", quote: "No, I’m not drinking tonight. Please respect that.", position: [72, 18], tilt: 3 },
  { id: "colleague-feedback", topic: "FEEDBACK", title: "Ask about the exact wording", quote: "Thanks. What do you mean by ‘you didn’t think I could’?", position: [34, 40], tilt: -3 },
  { id: "parent-child-conversation", topic: "PARENTING", title: "Help with the stuck step", quote: "Let’s find your shoes together. Where did you last see them?", position: [55, 41], tilt: 2 },
  { id: "speaking-up", topic: "SPEAKING UP", title: "Give the idea a clear opening", quote: "I’d like your feedback on this idea.", position: [76, 40], tilt: -2 },
];

/** Existing My Day tips, pinned to an illustrated classroom. No generated advice. */
export function MentorClassroom({ preview = false }) {
  const [selected, setSelected] = useState(null);
  const [showSource, setShowSource] = useState(false);
  const dialog = useRef(null);
  const origin = useRef(null);
  const uid = useId();
  const tip = selected === null ? null : TIPS[selected];

  useEffect(() => {
    if (selected !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);

  function close() {
    dialog.current?.close();
  }

  function turn(direction) {
    setSelected((value) => (value + direction + TIPS.length) % TIPS.length);
    setShowSource(false);
  }

  function open(index, event) {
    origin.current = event.currentTarget;
    setShowSource(false);
    setSelected(index);
  }

  return <section className={`mentor-classroom${preview ? " mentor-classroom--preview" : ""}`} aria-label="Memova personal mentor classroom" lang="en">
    {!preview && <header className="mentor-classroom-header">
      <div className="mentor-classroom-heading">
        <div className="mentor-classroom-brand"><img src="/assets/memova-icon-transparent.png" width="22" height="22" alt="" /><span>Memova <b>Personal mentor</b></span></div>
        <h1>A little help with<br />what to say next.</h1>
        <p>Five tips from My Day. Open a note. Find words to try.</p>
      </div>
      <div className="mentor-classroom-chimes"><WindChimes lang="en" variant="compact" active={selected === null} /></div>
    </header>}

    <div className="mentor-classroom-scene">
      <img className="mentor-classroom-art" src={ASSETS + "classroom-female-mentor-v2.png"} alt="A gentle female therapist in an American comic illustration, welcoming you to a blackboard of My Day tips" draggable="false" />
      {preview && <img className="mentor-classroom-preview-chime" src="/assets/chimes/voice-chime.png" alt="" />}
      <div className="mentor-classroom-notes" aria-label="Five tips from My Day">
        {TIPS.map((item, index) => {
          const contents = <><PushPin className="mentor-classroom-pin" size={16} weight="fill" aria-hidden="true" /><span className="mentor-classroom-note-topic">{String(index + 1).padStart(2, "0")} / {item.topic}</span><img src={ASSETS + item.id + ".png"} alt={preview ? "" : item.title + ". Suggested wording: “" + item.quote + "”"} loading="lazy" draggable="false" /><span className="mentor-classroom-note-title">{item.title}<ArrowUpRight size={13} aria-hidden="true" /></span></>;
          const style = { "--note-x": item.position[0] + "%", "--note-y": item.position[1] + "%", "--note-tilt": item.tilt + "deg", "--note-order": index };
          return preview
            ? <div className="mentor-classroom-note" key={item.id} style={style}>{contents}</div>
            : <button className="mentor-classroom-note" type="button" key={item.id} style={style} onClick={(event) => open(index, event)} aria-label={"Open tip " + (index + 1) + ": " + item.title} aria-haspopup="dialog">{contents}</button>;
        })}
      </div>
    </div>

    {!preview && <>
      <nav className="mentor-classroom-mobile-index" aria-label="Read a My Day tip">
        {TIPS.map((item, index) => <button type="button" key={item.id} onClick={(event) => open(index, event)} aria-haspopup="dialog"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><ArrowUpRight size={16} aria-hidden="true" /></button>)}
      </nav>
      <footer className="mentor-classroom-footer"><span>SMALL TIPS. EVERYDAY CONVERSATIONS.</span><p>Suggestions from the existing My Day examples. Open the original day to see the conversation behind each one.</p></footer>
      <dialog ref={dialog} className={`mentor-classroom-dialog${showSource ? " is-reading-source" : ""}`} aria-labelledby={uid + "-tip-title"}
        onClose={() => { setSelected(null); setShowSource(false); origin.current?.focus({ preventScroll: true }); }}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); } }}
        onClick={(event) => { if (event.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); } }}>
        {tip && <>
          <header className="mentor-classroom-dialog-header"><div><span>MY DAY / {tip.topic}</span><h2 id={uid + "-tip-title"}>{tip.title}</h2></div><button type="button" className="mentor-classroom-close" onClick={close} aria-label="Return the tip to the blackboard" autoFocus><X size={20} /></button></header>
          {showSource
            ? <div className="mentor-classroom-source"><button type="button" onClick={() => setShowSource(false)}><ArrowLeft size={15} />Back to the tip</button><iframe title={"My Day: " + tip.title} src={"/examples/stories/" + tip.id + ".html?lang=en&chimeLang=en"} onLoad={(event) => { event.currentTarget.contentDocument?.addEventListener("keydown", (keyEvent) => { if (keyEvent.key === "Escape" && !keyEvent.defaultPrevented) { keyEvent.preventDefault(); setShowSource(false); } }); }} /></div>
            : <div className="mentor-classroom-original"><img src={ASSETS + tip.id + ".png"} alt={tip.title + ". Suggested wording: “" + tip.quote + "”"} /><button className="mentor-classroom-open-source" type="button" onClick={() => setShowSource(true)}>Open this My Day<ArrowUpRight size={16} /></button></div>}
          <footer className="mentor-classroom-dialog-footer"><span>Original My Day tip · Suggested wording</span><div><button type="button" onClick={() => turn(-1)} aria-label="Previous tip"><ArrowLeft size={17} /></button><span>{String(selected + 1).padStart(2, "0")} / 05</span><button type="button" onClick={() => turn(1)} aria-label="Next tip"><ArrowRight size={17} /></button></div></footer>
        </>}
      </dialog>
    </>}
  </section>;
}

export default MentorClassroom;
