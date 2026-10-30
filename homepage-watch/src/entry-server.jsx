import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.jsx";
import "./styles.css";
import "./StoryOrbit.css";
import "./WatchReveal.css";
import "./OpeningExperience.css";
import "./StoryDissolve.css";
import "./ConsolidatedStory.css";
import "./ExperienceJourney.css";
import "./CloudPrivacy.css";
import "./SitePolish.css";
import "./LowerPolish.css";
import "./CloudPolish.css";
import "./ProductDemoVideo.css";
import "./Mobile.css";
import "./MobileLower.css";
import "./FaqSection.css";
import "./Community.css";

export function renderHomepage() {
  return renderToString(<App />);
}
