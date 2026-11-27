import type { JournalEntry } from "./journalEntries";

export const siriRecapNotWorkingArticle: JournalEntry = {
  slug: "siri-recap-not-working",
  week: "Product Notes",
  date: "Nov 27, 2026",
  isoDate: "2026-11-27",
  author: "Avery",
  authorRole: "GTM at Memova",
  authorAvatar: "/journal/apple-watch-guides/00-avery-author-portrait.png",
  category: "Product Notes",
  readingTime: "8 min read",
  title: "Siri Recap Not Working? Common Reasons and What to Try",
  summary:
    "If Siri Recap will not turn on, or it is on but no recap appears, Apple’s own support pages explain most of the reasons. Here they are in the order to check them, plus what to use if your Watch cannot run it.",
  seoTitle: "Siri Recap Not Working? Common Reasons and What to Try",
  metaDescription:
    "Siri Recap not working on your Apple Watch? Check the reasons Apple lists: release status, devices, Siri AI, language, region, age, settings, and pauses.",
  canonicalPath: "/journal/siri-recap-not-working/",
  cover: {
    src: "/journal/siri-recap-not-working/17-siri-recap-not-working-cover.webp",
    alt: "Concept cover with the headline Siri Recap not working, a watch displaying a question mark, and three checkmark tiles.",
    width: 2000,
    height: 1250,
  },
  editorialNote:
    "Memova, an Apple Watch voice recorder, is our own app, and it is one of the alternatives described here. Siri Recap and Live Rewind are beta features. Every reason and step below comes from Apple’s support pages as of November 2026, which may change. We did not test Siri Recap ourselves. This article is not legal advice.",
  intro: [
    {
      type: "image",
      src: "/journal/siri-recap-not-working/17-siri-recap-not-working-cover.webp",
      alt: "Concept cover with the headline Siri Recap not working, a watch displaying a question mark, and three checkmark tiles.",
      width: 2000,
      height: 1250,
    },
    {
      type: "paragraph",
      text: "When Siri Recap is not working, start with the basics Apple lists. As of November 2026, Apple says Siri Recap will be available in beta later this year with watchOS 27.3. It needs an Apple Watch Series 12 or Ultra 4 paired with a supported iPhone, Apple Intelligence and Siri AI (Beta), English, an eligible region, and a user aged 18 or older. If all of that checks out, the feature may simply be off, outside its schedule, or paused.",
    },
    {
      type: "paragraph",
      text: "This guide goes through each reason in the order worth checking, using only what Apple publishes. We have not added fixes of our own. At the end, we cover what you can use if your Watch or iPhone cannot run Siri Recap.",
    },
  ],
  sections: [
    {
      id: "cannot-turn-on",
      heading: "Why can’t you turn on Siri Recap at all?",
      blocks: [
        {
          type: "paragraph",
          text: "If you cannot find Siri Recap or it will not switch on, one of the requirements on Apple’s [Audio Intelligence page](https://support.apple.com/en-us/148354) is probably not met. Check them in this order.",
        },
        {
          type: "table",
          caption: "Reasons Siri Recap may be unavailable, from Apple’s support pages as of November 2026",
          headers: ["Reason", "What Apple says", "What to check"],
          rows: [
            [
              "It is not out for you yet",
              "Siri Recap and Live Rewind will be available in beta later this year with watchOS 27.3",
              "Your Watch’s software version, and Apple’s page for the latest status",
            ],
            [
              "Your Apple Watch is not supported",
              "Only Apple Watch Series 12 and Apple Watch Ultra 4 are listed",
              "Your Watch model",
            ],
            [
              "Your iPhone is not supported",
              "The paired iPhone must be one of the [iPhone models listed by Apple](https://support.apple.com/en-us/148354)",
              "Your iPhone model",
            ],
            [
              "Siri AI (Beta) is not set up",
              "Siri Recap requires Apple Intelligence and Siri AI (Beta)",
              "On iPhone, go to Settings > Siri and look for Try Siri AI (Beta)",
            ],
            [
              "Language",
              "Siri Recap starts in English, with more languages to follow",
              "Your device language and Siri language are both set to English",
            ],
            [
              "Region",
              "Not initially available in the EU, and not available in China",
              "Where you are and your Apple Account region",
            ],
            [
              "Age",
              "Not available for users under 18",
              "Whether you are 18 or older",
            ],
          ],
        },
        {
          type: "image",
          src: "/journal/siri-recap-not-working/18-siri-recap-troubleshooting-order.webp",
          alt: "Six checks for Siri Recap: release status, supported devices, Siri AI, language and region, age, and schedule.",
          width: 2000,
          height: 1250,
        },
      ],
    },
    {
      id: "software",
      heading: "How do you check your software and Siri AI?",
      blocks: [
        {
          type: "paragraph",
          text: "**Update your Apple Watch.** Apple’s [update guide](https://support.apple.com/en-us/108926) says to update your iPhone first, keep the Watch at least 50 percent charged, and connect the iPhone to Wi-Fi. Then open the Apple Watch app on your iPhone, tap My Watch, tap General, then tap Software Update. You can also update on the Watch itself under Settings > General > Software Update while it is on Wi-Fi. Leave the Watch on its charger until it restarts.",
        },
        {
          type: "paragraph",
          text: "**Turn on Siri AI (Beta).** According to Apple’s [Siri AI page](https://support.apple.com/en-us/127893), after you update your iPhone, go to Settings > Siri and tap Try Siri AI (Beta). If Siri is off, tap Turn On Siri first. Follow the onscreen steps to pick a voice, complete voice enrollment, and review your privacy settings.",
        },
        {
          type: "note",
          text: "Apple says that during times of high demand, you might be added to a waitlist for Siri AI first, and wait times can vary. If you are on the waitlist, Siri Recap will not work until Siri AI is ready.",
        },
        {
          type: "paragraph",
          text: "**Match your languages.** Apple’s [Apple Intelligence page](https://support.apple.com/en-us/121115) says the device language and Siri language must be the same supported language. If you change your Siri language, Apple Intelligence might be unavailable until the new language finishes downloading.",
        },
      ],
    },
    {
      id: "on-but-no-recap",
      heading: "Why is Siri Recap on but no recap appears?",
      blocks: [
        {
          type: "paragraph",
          text: "If your devices qualify and Siri Recap is turned on, Apple describes several situations in which it does not summarize.",
        },
        {
          type: "table",
          caption: "Situations Apple describes in which Siri Recap does not create a summary",
          headers: ["Situation", "What Apple says", "What to try"],
          rows: [
            [
              "Siri Recap is off",
              "Each Audio Intelligence feature is opt-in, and you turn on Siri Recap in the Watch app on iPhone",
              "Open the Watch app on your iPhone and check that Siri Recap is on",
            ],
            [
              "It is outside your schedule",
              "Siri Recap runs only when you choose, on a schedule by time or location, or when you turn it on manually",
              "Check your schedule, or turn it on from Control Center on your Watch",
            ],
            [
              "You are using headphones",
              "It pauses while you listen through headphones paired to your iPhone or Watch, such as for media, a phone call, or FaceTime",
              "Expect no recap for that time",
            ],
            [
              "Noise cancellation is on",
              "It pauses summarizing nearby conversations when Active Noise Cancellation is on for AirPods or Beats",
              "Switch Active Noise Cancellation off if you want a recap",
            ],
            [
              "You reached a daily limit",
              "Features that rely on server-side models, including Siri Recap, have daily usage limits",
              "Try again later",
            ],
          ],
        },
        {
          type: "paragraph",
          text: "Apple also says your Watch notifies you when Siri Recap starts or stops on a schedule you set. If you never saw that notification, the schedule may not have started.",
        },
      ],
    },
    {
      id: "missing-recaps",
      heading: "Where did your recaps go?",
      blocks: [
        {
          type: "paragraph",
          text: "Siri Recap summaries are kept in the Recaps tab of the Siri app, along with any Live Rewind snippets you saved. Apple says recaps can be set to delete automatically after up to 7 days unless you save them, so an older recap may have been removed by that setting. Deleting a recap removes it from all your synced devices.",
        },
        {
          type: "paragraph",
          text: "Live Rewind snippets are even shorter-lived. Apple says an unsaved snippet disappears from your Watch about 30 seconds after the display dims. To keep one, save it to the Siri app or tap Ask Siri.",
        },
      ],
    },
    {
      id: "missing-details",
      heading: "Why does a recap leave things out?",
      blocks: [
        {
          type: "paragraph",
          text: "Sometimes Siri Recap works, but the result is thinner than you expected. Apple explains why. Siri Recap produces a brief, high-level summary, not a transcript, and it does not label who said what. It focuses on the conversation most audible to you, and it is designed to omit certain sensitive information, such as financial data and government-assigned identifiers.",
        },
        {
          type: "paragraph",
          text: "Apple adds that summaries may be incomplete or inaccurate and suggests confirming important details with the people involved. We look at this more closely in [Apple Watch Live Rewind and Siri Recap: A Summary Is Only the Beginning](https://memova.ai/journal/apple-watch-live-rewind-siri-recap/).",
        },
      ],
    },
    {
      id: "alternatives",
      heading: "What can you use if Siri Recap won’t work on your Watch?",
      blocks: [
        {
          type: "paragraph",
          text: "If your Watch or iPhone does not qualify, or you need the original words rather than a summary, a recording app is the usual alternative. It keeps the audio, so you can listen again and check a detail.",
        },
        {
          type: "paragraph",
          text: "Memova, an Apple Watch voice recorder, is one option. You tap to record on Apple Watch, and recording continues with the screen off. You can then transcribe and search the recording on your iPhone, even offline. Recording, on-device transcription, and offline search are free, and the current App Store listing requires only iOS 17 and watchOS 10 or later, so it runs on many Watches that cannot use Siri Recap.",
        },
        {
          type: "image",
          src: "/journal/siri-recap-not-working/01-memova-watch-recording-iphone-days-en.webp",
          alt: "Memova recording on Apple Watch beside the Days timeline from the current English prototype on iPhone.",
          width: 2000,
          height: 1250,
          caption: "A recording app keeps the audio, so you can return to the original words.",
        },
        {
          type: "paragraph",
          text: "Memova is also designing its own Rewind feature, which is coming soon and will require Memova Pro. Memova Pro costs US$4.99 a month or US$39.99 a year as of November 2026; confirm the current price in the app. See [How to Get Rewind Features on an Older Apple Watch](https://memova.ai/journal/rewind-on-an-older-apple-watch/).",
        },
        {
          type: "paragraph",
          text: "For other ways to capture a conversation on your wrist, see [how to record audio on Apple Watch](https://memova.ai/journal/how-to-record-audio-on-apple-watch/), or compare apps in [the best voice recorder for Apple Watch](https://memova.ai/journal/best-voice-recorder-for-apple-watch/).",
        },
      ],
    },
    {
      id: "consent",
      heading: "Do you need permission to record a conversation?",
      blocks: [
        {
          type: "paragraph",
          text: "Siri Recap does not record audio, but Apple still asks users to be mindful of those around them where conversations might be private. If you switch to a recording app, the bar is higher, because you are keeping the audio.",
        },
        {
          type: "paragraph",
          text: "In the United States, federal law requires the consent of at least one person in the conversation, which can be you. Some states require consent from everyone involved. The [Reporters Committee’s recording guide](https://www.rcfp.org/introduction-to-reporters-recording-guide/) summarizes the law state by state, and other countries have their own rules. The simplest habit is to tell people when you are recording.",
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
          text: "**Why don’t I see Siri Recap on my Apple Watch?**",
        },
        {
          type: "paragraph",
          text: "As of November 2026, Apple says Siri Recap will arrive in beta later this year with watchOS 27.3, and only on Apple Watch Series 12 and Ultra 4 paired with a supported iPhone. If your Watch is a different model or is not on that software, it will not appear.",
        },
        {
          type: "paragraph",
          text: "**Does Siri Recap work on Apple Watch Series 11 or older?**",
        },
        {
          type: "paragraph",
          text: "No. Apple lists only Apple Watch Series 12 and Apple Watch Ultra 4.",
        },
        {
          type: "paragraph",
          text: "**Why did Siri Recap stop when I put my AirPods in?**",
        },
        {
          type: "paragraph",
          text: "Apple says Siri Recap pauses while you listen through paired headphones, and it pauses summarizing nearby conversations when Active Noise Cancellation is on for AirPods or Beats.",
        },
        {
          type: "paragraph",
          text: "**Is there a limit on how much Siri Recap I can use?**",
        },
        {
          type: "paragraph",
          text: "Yes. Apple says features that rely on server-side models, including Siri Recap and Live Rewind, are subject to daily usage limits.",
        },
        {
          type: "paragraph",
          text: "**Why did my recaps disappear?**",
        },
        {
          type: "paragraph",
          text: "Recaps can be set to delete automatically after up to 7 days unless you save them. Check the Recaps tab in the Siri app and your auto-delete setting.",
        },
        {
          type: "paragraph",
          text: "**Can I listen to the conversation behind a recap?**",
        },
        {
          type: "paragraph",
          text: "No. Apple says Audio Intelligence features do not create audio recordings, so there is no audio to play back. If you need the original words, use a recording app and tell people you are recording.",
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
