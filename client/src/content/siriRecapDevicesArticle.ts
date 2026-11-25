import type { JournalEntry } from "./journalEntries";

export const siriRecapDevicesArticle: JournalEntry = {
  slug: "siri-recap-supported-devices",
  week: "Product Notes",
  date: "Nov 25, 2026",
  isoDate: "2026-11-25",
  author: "Avery",
  authorRole: "GTM at Memova",
  authorAvatar: "/journal/apple-watch-guides/00-avery-author-portrait.png",
  category: "Product Notes",
  readingTime: "7 min read",
  title: "Siri Recap Supported Devices: Which Apple Watch and iPhone Work?",
  summary:
    "Siri Recap and Live Rewind need an Apple Watch Series 12 or Ultra 4 paired with iPhone 16 or later. Here is Apple’s full list of requirements as of November 2026, and what to use if your devices don’t qualify.",
  seoTitle: "Siri Recap Supported Devices: Apple Watch and iPhone List",
  metaDescription:
    "Which Apple Watch and iPhone support Siri Recap and Live Rewind? Apple’s requirements as of November 2026: models, watchOS 27.3 beta, language, and regions.",
  canonicalPath: "/journal/siri-recap-supported-devices/",
  cover: {
    src: "/journal/siri-recap-supported-devices/siri-cover-branded.webp",
    alt: "A watch and iPhone device illustration beside Siri Recap compatibility requirements, with the Memova logo.",
    width: 2000,
    height: 1250,
  },
  editorialNote:
    "Memova, an Apple Watch voice recorder, is our own app, and it is one of the alternatives described here. Siri Recap and Live Rewind are beta features. Details come from Apple’s documentation as of November 2026 and may change. This article is not legal advice.",
  intro: [
    {
      type: "image",
      src: "/journal/siri-recap-supported-devices/siri-cover-branded.webp",
      alt: "A watch and iPhone device illustration beside Siri Recap compatibility requirements, with the Memova logo.",
      width: 2000,
      height: 1250,
    },
    {
      type: "paragraph",
      text: "As of November 2026, Siri Recap is supported only on Apple Watch Series 12 and Apple Watch Ultra 4, paired with iPhone 16 or a later model. Apple says Siri Recap and Live Rewind will arrive in beta later this year with watchOS 27.3, in English first, and that both require Apple Intelligence and Siri AI (Beta).",
    },
    {
      type: "paragraph",
      text: "There are also limits on region and age: the features will not be available in the EU at first, are not available in China, and are not available to anyone under 18. Below is Apple’s full list, what each requirement means, and what you can use if your devices don’t qualify.",
    },
  ],
  sections: [
    {
      id: "requirements",
      heading: "What do you need to use Siri Recap?",
      blocks: [
        {
          type: "paragraph",
          text: "Your devices, software, language, region, and age all have to qualify. Apple lists the same requirements for Live Rewind.",
        },
        {
          type: "table",
          caption:
            "Siri Recap and Live Rewind requirements, as of November 2026",
          headers: ["Requirement", "What Apple lists", "Notes"],
          rows: [
            [
              "Apple Watch",
              "Apple Watch Series 12 or Apple Watch Ultra 4",
              "Earlier models are not on Apple’s list",
            ],
            [
              "iPhone",
              "iPhone 16 or later (full list below)",
              "The Watch must be paired with a supported iPhone",
            ],
            [
              "Software",
              "watchOS 27.3, as a beta",
              "Apple says the beta arrives later this year",
            ],
            [
              "Apple Intelligence",
              "Apple Intelligence and Siri AI (Beta)",
              "Apple says Siri AI will roll out gradually in beta",
            ],
            [
              "Language",
              "English",
              "Apple says more languages will follow",
            ],
            [
              "Region",
              "Not available in China, and not available in the EU at first",
              "Siri AI is also not initially available in the EU on watchOS",
            ],
            ["Age", "18 or older", "Not available for users under 18"],
            [
              "Daily use",
              "Daily usage limits apply",
              "Apple applies them to features that rely on server-side models",
            ],
          ],
        },
        {
          type: "note",
          text: "These are beta features, and Apple may change the list. Check [Apple’s Audio Intelligence documentation](https://support.apple.com/en-us/148354) for the current requirements before you buy new hardware.",
        },
      ],
    },
    {
      id: "iphone-models",
      heading: "Which iPhone models work with Siri Recap and Live Rewind?",
      blocks: [
        {
          type: "paragraph",
          text: "Apple lists these iPhone models. Your supported Apple Watch has to be paired with one of them.",
        },
        {
          type: "list",
          items: [
            "iPhone 16, iPhone 16 Plus, iPhone 16 Pro, and iPhone 16 Pro Max",
            "iPhone 17, iPhone 17e, iPhone 17 Pro, and iPhone 17 Pro Max",
            "iPhone Air",
            "iPhone 18 Pro and iPhone 18 Pro Max",
            "iPhone Duo",
          ],
        },
        {
          type: "paragraph",
          text: "iPhone 15 models and earlier are not on the list. A supported Apple Watch alone is not enough.",
        },
      ],
    },
    {
      id: "live-rewind-requirements",
      heading: "Are the Live Rewind requirements different from Siri Recap?",
      blocks: [
        {
          type: "paragraph",
          text: "No. Apple lists the same Apple Watch models, iPhone models, beta release, language, regions, and age limit for both. What differs is how they work:",
        },
        {
          type: "list",
          items: [
            "**Live Rewind** shows the last 15 seconds of speech as text when you double-press the Digital Crown. Apple says it is processed on your Apple Watch and iPhone. If you ask Siri about a snippet or save it, the snippet is sent to Apple’s Private Cloud Compute.",
            "**Siri Recap** takes notes on your conversations during times you choose and creates short, high-level summaries. Apple says the iPhone sends a condensed, encrypted version of the transcript to Private Cloud Compute to write each summary.",
          ],
        },
        {
          type: "paragraph",
          text: "Apple groups both under Audio Intelligence, along with Sound Recognition and automatic Music Recognition with Shazam. Those two also need Apple Watch Series 12 or Ultra 4, but they work with more iPhones: iPhone 11 or later, or iPhone SE (2nd generation or later), with iOS 27.",
        },
      ],
    },
    {
      id: "region-language",
      heading: "Does Siri Recap work in your country and language?",
      blocks: [
        {
          type: "paragraph",
          text: "Only in some. As of November 2026, Apple says:",
        },
        {
          type: "list",
          items: [
            "**Language:** Siri Recap and Live Rewind start in English, with more languages to follow.",
            "**European Union:** they will not be available in the EU at first. Siri AI, which they require, will not initially be available in the EU on iOS, iPadOS, and watchOS.",
            "**China:** they are not available.",
            "**Age:** they are not available for users under 18.",
          ],
        },
        {
          type: "paragraph",
          text: "Apple has not published a date for more languages or regions.",
        },
      ],
    },
    {
      id: "turn-on",
      heading: "How do you turn on Siri Recap and Live Rewind?",
      blocks: [
        {
          type: "paragraph",
          text: "Both are off until you turn them on, and both are set up in the Watch app on your iPhone.",
        },
        {
          type: "list",
          items: [
            "**Live Rewind:** open the Watch app on your iPhone, tap **Siri**, tap **Live Rewind**, and turn on **Double Click Digital Crown**. Then double-press the Digital Crown on your Watch to see the last 15 seconds as text.",
            "**Siri Recap:** turn it on in the Watch app on your iPhone. You can set a schedule by time or location, such as only at work, or turn it on and off yourself. You can also switch it on or off from Control Center, and the Watch tells you when a schedule starts or stops it.",
          ],
        },
        {
          type: "paragraph",
          text: "When Live Rewind starts, the Watch plays a chime, even on silent, and shows an animation and a microphone indicator so people nearby can tell.",
        },
      ],
    },
    {
      id: "audio",
      heading: "Does Siri Recap record or store audio?",
      blocks: [
        {
          type: "paragraph",
          text: "No. Apple says Audio Intelligence features do not create audio recordings, so there is nothing to play back or share. Apple also describes what you get instead:",
        },
        {
          type: "list",
          items: [
            "**A summary, not a transcript.** Siri Recap produces a brief, high-level summary of a conversation.",
            "**No speaker labels.** Summaries do not say who said what, unless a name is mentioned in the conversation.",
            "**Short-lived by default.** You can set recaps to delete automatically after up to 7 days unless you save them. An unsaved Live Rewind snippet disappears about 30 seconds after the display dims.",
          ],
        },
        {
          type: "paragraph",
          text: "Apple adds that summaries and snippets may be incomplete or inaccurate, and suggests confirming important details another way. We look at what a summary can leave out in [Apple Watch Live Rewind and Siri Recap: A Summary Is Only the Beginning](https://memova.ai/journal/apple-watch-live-rewind-siri-recap/).",
        },
        {
          type: "image",
          src: "/journal/siri-recap-supported-devices/07-siri-recap-summary-vs-recording.webp",
          alt: "Siri Recap summary compared with original audio and a searchable transcript.",
          width: 2000,
          height: 1250,
        },
      ],
    },
    {
      id: "alternatives",
      heading: "What can you use if your Apple Watch or iPhone isn’t supported?",
      blocks: [
        {
          type: "paragraph",
          text: "You can still capture conversations from your wrist. The difference is that these options keep a recording, so you get the original words instead of a summary.",
        },
        {
          type: "table",
          caption: "Options when Siri Recap is not available on your devices",
          headers: ["Option", "What it needs", "What you get"],
          rows: [
            [
              "Voice Memos",
              "Built into Apple Watch. Transcripts need iPhone 12 or later",
              "The audio, plus a transcript in supported languages",
            ],
            [
              "A recording app such as Memova",
              "Memova lists iOS 17 and watchOS 10 or later",
              "The audio, a transcript made on your iPhone, and offline search",
            ],
            [
              "New hardware for Siri Recap",
              "Apple Watch Series 12 or Ultra 4 with iPhone 16 or later",
              "Text only: summaries and 15-second snippets, with no audio",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Our step-by-step guide, [How to Record Audio and Conversations on Apple Watch](https://memova.ai/journal/how-to-record-audio-on-apple-watch/), covers Voice Memos and recording apps. If you want to compare apps first, see [Best Voice Recorder for Apple Watch](https://memova.ai/journal/best-voice-recorder-for-apple-watch/).",
        },
        {
          type: "image",
          src: "/journal/siri-recap-supported-devices/08-memova-watch-recording-iphone-days-latest.webp",
          alt: "Memova recording on Apple Watch beside the current English Days timeline on iPhone.",
          width: 2000,
          height: 1250,
          caption: "Record on your wrist. Review on your phone.",
        },
        {
          type: "paragraph",
          text: "[Memova](https://memova.ai/) is an Apple Watch voice recorder. You tap to record on the Watch, recording continues with the screen off, and you transcribe and search on your iPhone, even offline. Recording, on-device transcription, and offline search are free and work without an account. Your original audio stays on your device by default. If you choose Azure cloud transcription, audio is uploaded for transcription and deleted immediately when transcription finishes. See the [Memova privacy policy](https://memova.ai/privacy/).",
        },
        {
          type: "paragraph",
          text: "Memova is also designing its own Rewind feature, which is coming soon and will require Memova Pro. See [How to Get Rewind Features on an Older Apple Watch](https://memova.ai/journal/rewind-on-an-older-apple-watch/).",
        },
      ],
    },
    {
      id: "consent",
      heading: "Do you need permission to record a conversation?",
      blocks: [
        {
          type: "paragraph",
          text: "If you switch to recording, often yes. Apple also asks Siri Recap users to be mindful of people nearby, even though no audio is kept.",
        },
        {
          type: "paragraph",
          text: "In the United States, federal law requires the consent of at least one person in the conversation, which can be you. Some states require consent from everyone involved. The [Reporters Committee’s recording guide](https://www.rcfp.org/introduction-to-reporters-recording-guide/) summarizes the law state by state, and other countries have their own rules. The simplest habit is to say you are recording and stop if anyone objects.",
        },
        {
          type: "note",
          text: "This is general information, not legal advice. If a recording matters for work or a dispute, check the rules where you are or ask a lawyer.",
        },
      ],
    },
    {
      id: "faq",
      heading: "Frequently Asked Questions",
      blocks: [
        {
          type: "paragraph",
          text: "**Does Siri Recap work on older Apple Watch models?**",
        },
        {
          type: "paragraph",
          text: "No. As of November 2026, Apple lists only Apple Watch Series 12 and Apple Watch Ultra 4 for Siri Recap and Live Rewind.",
        },
        {
          type: "paragraph",
          text: "**Does Siri Recap work with iPhone 15?**",
        },
        {
          type: "paragraph",
          text: "No. Apple’s list starts with iPhone 16. Your supported Apple Watch has to be paired with iPhone 16 or a later model on the list.",
        },
        {
          type: "paragraph",
          text: "**Is Siri Recap available now?**",
        },
        {
          type: "paragraph",
          text: "Apple says Siri Recap and Live Rewind will be available in beta later this year with watchOS 27.3. Check Apple’s documentation for the latest status.",
        },
        {
          type: "paragraph",
          text: "**What languages does Siri Recap support?**",
        },
        {
          type: "paragraph",
          text: "English to start. Apple says more languages will follow but has not given dates.",
        },
        {
          type: "paragraph",
          text: "**Is Siri Recap available in the EU?**",
        },
        {
          type: "paragraph",
          text: "Not at first. Apple says Siri Recap and Live Rewind will not initially be available in the EU, and they are not available in China.",
        },
        {
          type: "paragraph",
          text: "**Does Siri Recap save a recording?**",
        },
        {
          type: "paragraph",
          text: "No. Apple says no audio is recorded or stored. You get a short text summary that you can save, edit, or delete in the Siri app.",
        },
      ],
    },
  ],
  relatedUpdates: [
    {
      label: "Available today",
      title: "Download Memova for Apple Watch and iPhone",
      href: "https://apps.apple.com/us/app/memova-ai/id6796284954",
    },
  ],
};
