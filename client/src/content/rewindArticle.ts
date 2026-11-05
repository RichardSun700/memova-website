import type { JournalEntry } from "./journalEntries";

export const rewindArticle: JournalEntry = {
  slug: "rewind-on-an-older-apple-watch",
  week: "Product Notes",
  date: "",
  isoDate: "",
  author: "Avery",
  authorRole: "GTM at Memova",
  authorAvatar: "/journal/avery.jpg",
  category: "Product Notes",
  readingTime: "6 min read",
  title: "How to Get Rewind Features on an Older Apple Watch",
  summary:
    "Missed a detail in a conversation? Meet Memova’s upcoming Rewind experience, with adjustable time windows and planned speaker identification.",
  seoTitle: "Rewind on an Older Apple Watch: Memova’s Upcoming Feature",
  metaDescription:
    "Explore Memova’s upcoming Rewind experience, with adjustable time windows and planned speaker identification. Learn what is available today on Apple Watch.",
  cover: {
    src: "/journal/rewind/04-conversation.webp",
    alt: "Memova Rewind conversation text with speaker labels on Apple Watch and a captured conversation card on iPhone.",
  },
  status: "Coming soon · Memova Pro",
  editorialNote:
    "Rewind is coming soon and will require Memova Pro. Screens and final device support may change.",
  sections: [
    {
      id: "apple-live-rewind",
      heading: "What Is Apple Watch Live Rewind?",
      blocks: [
        {
          type: "paragraph",
          text: "You’re traveling. Someone gives you directions, and a moment later you realize you’ve already forgotten a key detail. *You wish you could go back and read what they just said.*",
        },
        {
          type: "paragraph",
          text: "Apple’s Live Rewind lets users on supported Apple Watch models view a transcript of the previous 15 seconds by double-clicking the Digital Crown. See [Apple’s official documentation](https://support.apple.com/en-us/148354) for supported devices and setup.",
        },
        {
          type: "paragraph",
          text: "But what if you want to keep your existing Watch—or look back five minutes, half an hour, or an hour? Here’s how Memova’s upcoming Rewind experience is being designed, and what you can use today.",
        },
      ],
    },
    {
      id: "apple-and-memova",
      heading: "Apple Live Rewind vs. Memova Rewind",
      blocks: [
        {
          type: "paragraph",
          text: "Apple Live Rewind is a native Apple Watch feature with a 15-second window and specific hardware requirements. Memova is developing a separate, app-based experience built around conversations you have captured with Memova.",
        },
        {
          type: "paragraph",
          text: "Memova’s planned Rewind experience offers selectable time windows and speaker identification. **It is coming soon and will require Memova Pro.** Installing Memova does not unlock Apple’s native Live Rewind feature.",
        },
        {
          type: "table",
          caption: "Apple Live Rewind and the planned Memova Rewind experience",
          headers: ["Feature", "Apple Live Rewind", "Memova Rewind"],
          rows: [
            [
              "Rewind duration",
              "Last 15 seconds",
              "Customizable: 15 seconds, 5 minutes, 30 minutes, or 1 hour",
            ],
            [
              "Speaker identification",
              "Does not identify speakers",
              "Planned support for speaker identification",
            ],
            [
              "Activation",
              "Double-press the Digital Crown",
              "Simulated double-pinch gesture in the current prototype; final controls to be confirmed.",
            ],
            [
              "Where you read the text",
              "Apple Watch; text can be saved to the Siri app",
              "In Memova on your Apple Watch and in the Memova iPhone app",
            ],
            [
              "Device requirements",
              "Requires Apple Watch Series 12 or Apple Watch Ultra 4, paired with a supported iPhone 16 or later, excluding iPhone 16e.",
              "Rewind compatibility to be confirmed. Current app: watchOS 10+ and iOS 17+.",
            ],
          ],
        },
      ],
    },
    {
      id: "longer-window",
      heading: "Why a Longer Rewind Window Matters",
      blocks: [
        {
          type: "paragraph",
          text: "Fifteen seconds can help when you miss a name or the end of a sentence. Longer conversations create different problems.",
        },
        {
          type: "paragraph",
          text: "You might remember the conclusion of a discussion but forget how someone reached it. You might need to revisit several instructions together, or review a decision after a meeting has moved on.",
        },
        {
          type: "paragraph",
          text: "Memova’s planned duration settings let you choose a window that fits the situation. Rewind will build on [Memova’s existing recording and conversation-memory workflow](https://memova.ai/), giving you another way to return to captured content.",
        },
      ],
    },
    {
      id: "speaker-identification",
      heading: "Speaker Identification: Understanding Who Said What",
      blocks: [
        {
          type: "paragraph",
          text: "In a meeting, one person proposes a deadline, another raises a concern, and a third agrees to follow up. A transcript is more useful when you can distinguish those contributions.",
        },
        {
          type: "paragraph",
          text: "**Memova Rewind is planned to include speaker identification**, helping you differentiate speakers when reviewing a conversation. You could revisit someone’s instructions, compare perspectives, or follow how a discussion unfolded.",
        },
        {
          type: "paragraph",
          text: "Speaker identification is part of the upcoming experience. Its final implementation and performance details will be confirmed at launch.",
        },
      ],
    },
    {
      id: "planned-workflow",
      heading: "How Memova Rewind Is Being Designed",
      blocks: [
        {
          type: "note",
          text: "Planned workflow · The screens below preview a feature that is still in development.",
        },
        { type: "heading", text: "Install Memova AI" },
        {
          type: "paragraph",
          text: "[Install Memova AI from the App Store](https://apps.apple.com/us/app/memova-ai/id6796284954). You can explore the app’s current recording, transcription, and search features while Rewind is in development.",
        },
        { type: "heading", text: "Choose Your Rewind Window" },
        {
          type: "paragraph",
          text: "In the planned workflow, open **App preferences → Rewind** in the Memova app.",
        },
        {
          type: "image",
          src: "/journal/rewind/01-settings.webp",
          alt: "Memova App preferences highlighted on iPhone beside an Apple Watch recording screen.",
        },
        { type: "paragraph", text: "Choose the duration you need:" },
        {
          type: "list",
          items: ["15 seconds", "5 minutes", "30 minutes", "1 hour"],
        },
        {
          type: "image",
          src: "/journal/rewind/02-window-options.webp",
          alt: "Memova Rewind settings on iPhone with options for the last 15 seconds, 5 minutes, 30 minutes, and hour.",
        },
        { type: "heading", text: "The Rewind Gesture Preview" },
        {
          type: "paragraph",
          text: "The current product prototype demonstrates the index finger and thumb touching twice before Rewind opens. The prototype does not use the Digital Crown or side button to activate Rewind.",
        },
        {
          type: "paragraph",
          text: "This is a simulated gesture preview, not a connection to hardware gesture recognition. Final controls and device support will be confirmed when the feature launches.",
        },
        { type: "heading", text: "Read the Recalled Conversation" },
        {
          type: "image",
          src: "/journal/rewind/04-conversation.webp",
          alt: "Memova Rewind conversation text with speaker labels on Apple Watch and a captured conversation card on iPhone.",
        },
        {
          type: "paragraph",
          text: "The planned experience will let you read recalled conversation text **in Memova on your Apple Watch** and **in the Memova app on your iPhone**. Use your Watch for a quick check, or open your phone for a larger reading view.",
        },
      ],
    },
    {
      id: "older-watch",
      heading: "Can You Use Memova Rewind on an Older Apple Watch?",
      blocks: [
        {
          type: "paragraph",
          text: "The current [Memova App Store listing](https://apps.apple.com/us/app/memova-ai/id6796284954) requires **watchOS 10.0 or later** and **iOS 17.0 or later**. These requirements apply to the current app; they do not confirm compatibility for the upcoming Rewind feature or its controls.",
        },
        {
          type: "paragraph",
          text: "If you’re deciding whether to keep your existing Watch, check compatibility before making a hardware purchase. [Contact Memova Support](https://memova.ai/support/) with questions about your device and the experience currently available.",
        },
      ],
    },
    {
      id: "available-today",
      heading: "What Can You Use in Memova Today?",
      blocks: [
        {
          type: "paragraph",
          text: "You can already record on Apple Watch or iPhone, transcribe on your device, and search saved content. Local transcription and text search can work offline, so you can return to conversations you have captured while Rewind is in development.",
        },
        {
          type: "paragraph",
          text: "Read [Memova’s Privacy Policy](https://memova.ai/privacy/) to understand how your content is handled. Choose your recording settings and obtain permission before recording conversations.",
        },
      ],
    },
    {
      id: "faq",
      heading: "Frequently Asked Questions",
      blocks: [
        {
          type: "faq",
          items: [
            {
              question: "Is Memova Rewind available now?",
              answer:
                "Not yet. Rewind is coming soon and will require Memova Pro. Join our [Discord community](https://discord.com/invite/E9u5FFvhdu) to share your ideas and follow development.",
            },
            {
              question: "Can Memova rewind more than 15 seconds?",
              answer:
                "That is the plan. Rewind is being developed with selectable windows of 15 seconds, 5 minutes, 30 minutes, and 1 hour, chosen through App preferences → Rewind.",
            },
            {
              question: "Will Memova Rewind identify speakers?",
              answer:
                "Speaker identification is planned to help you distinguish who said what. The final implementation and performance details will be confirmed at launch.",
            },
            {
              question: "How will I activate Memova Rewind?",
              answer:
                "The current prototype uses a clickable hand demonstration that animates two touches between the index finger and thumb. It simulates the interaction; final hardware controls and gesture compatibility have not been confirmed.",
            },
            {
              question: "Where will I see the recalled text?",
              answer:
                "The planned experience shows conversation text in Memova on your Apple Watch and in the iPhone app. You can choose a quick wrist view or a larger reading view.",
            },
            {
              question: "Does installing Memova enable Apple Live Rewind?",
              answer:
                "No. Memova is developing its own app-based experience. It does not install or unlock Apple’s native Live Rewind feature.",
            },
          ],
        },
      ],
    },
    {
      id: "look-back",
      heading: "Choose How Far Back You Want to Look",
      blocks: [
        {
          type: "paragraph",
          text: "A missed sentence and a half-hour discussion call for different ways to review what happened. Memova Rewind is being built around that choice: select a time window, distinguish the speakers, and read the conversation on your Watch or iPhone.",
        },
        {
          type: "paragraph",
          text: "While Rewind is in development, [download Memova AI](https://apps.apple.com/us/app/memova-ai/id6796284954) to explore its current recording, transcription, and memory tools.",
        },
      ],
    },
  ],
  relatedUpdates: [
    {
      label: "Available today",
      title: "Explore the current Memova app",
      href: "https://apps.apple.com/us/app/memova-ai/id6796284954",
    },
    {
      label: "Questions?",
      title: "Contact Memova Support",
      href: "https://memova.ai/support/",
    },
  ],
};
