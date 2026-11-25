import type { JournalEntry } from "./journalEntries";

export const voiceMemosGuideArticle: JournalEntry = {
  slug: "apple-watch-voice-memos-guide",
  week: "Product Notes",
  date: "Nov 25, 2026",
  isoDate: "2026-11-25",
  author: "Ada",
  authorRole: "GTM",
  authorAvatar: "/journal/ada.jpg",
  category: "Product Notes",
  readingTime: "7 min read",
  title: "Apple Watch Voice Memos: How to Record, Sync, and Transcribe",
  summary:
    "A practical guide to the Voice Memos app on Apple Watch: how to record and play back, where your recordings appear, how to read a transcript, and where the built-in app stops.",
  seoTitle: "Apple Watch Voice Memos: Record, Sync, and Transcribe",
  metaDescription:
    "How to use Voice Memos on Apple Watch: record, play back, find your recordings on other devices, read a transcript, and see what the built-in app can’t do.",
  canonicalPath: "/journal/apple-watch-voice-memos-guide/",
  cover: {
    src: "/journal/apple-watch-voice-memos-guide/01-voice-memos-cover.webp",
    alt: "Concept illustration of a watch recording, an iPhone, and a paper transcript.",
    width: 2000,
    height: 1250,
  },
  editorialNote:
    "Memova, an Apple Watch voice recorder, is our own app, and we mention it near the end of this guide. Details about Voice Memos come from Apple’s documentation as of November 2026 and may change. This article is not legal advice.",
  intro: [
    {
      type: "image",
      src: "/journal/apple-watch-voice-memos-guide/01-voice-memos-cover.webp",
      alt: "Concept illustration of a watch recording, an iPhone, and a paper transcript.",
      width: 2000,
      height: 1250,
    },
    {
      type: "image",
      src: "/journal/apple-watch-voice-memos-guide/02-voice-memos-record-sync-transcribe.webp",
      alt: "Three steps: record on Apple Watch, sync through iCloud, and transcribe on a supported iPhone.",
      width: 2000,
      height: 1250,
    },
    {
      type: "paragraph",
      text: "Apple Watch Voice Memos is the recording app built into your Watch. Open it, tap Record, and tap Stop when you are done. The memo syncs through iCloud to your iPhone, iPad, and Mac, and on an iPhone 12 or later you can read a transcript of it in supported languages.",
    },
    {
      type: "paragraph",
      text: "This guide covers each step on the Watch and on the iPhone, using Apple’s own instructions. It ends with what the built-in app does not do, so you can decide whether it is enough for you.",
    },
  ],
  sections: [
    {
      id: "what-it-does",
      heading: "What can the Voice Memos app on Apple Watch do?",
      blocks: [
        {
          type: "paragraph",
          text: "Apple describes the Watch app simply: you use it “to record personal notes.” Recording and playback happen on the Watch. Transcripts, search, and organizing happen in Voice Memos on your iPhone.",
        },
        {
          type: "table",
          caption: "What you can do with an Apple Watch voice memo, and where",
          headers: ["Task", "Where you do it", "What you need"],
          rows: [
            [
              "Record a memo",
              "Voice Memos on Apple Watch",
              "Nothing extra. On Apple Watch Ultra, you can also use the Action button",
            ],
            [
              "Play it back",
              "Voice Memos on Apple Watch",
              "Nothing extra",
            ],
            [
              "Listen on other devices",
              "Voice Memos on iPhone, iPad, or Mac, under Watch Recordings",
              "The same Apple Account, with Voice Memos turned on in iCloud",
            ],
            [
              "Read or copy a transcript",
              "Voice Memos on iPhone",
              "iPhone 12 or later, a supported language, and a supported country or region",
            ],
            [
              "Search the words you said",
              "Voice Memos on iPhone",
              "A transcript of the recording",
            ],
          ],
        },
      ],
    },
    {
      id: "record",
      heading: "How do you record a voice memo on Apple Watch?",
      blocks: [
        {
          type: "paragraph",
          text: "Apple’s steps for the Watch are short:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Open the **Voice Memos** app on your Apple Watch.",
            "Tap the **Record** button.",
            "Tap the **Stop Recording** button to end the recording.",
          ],
        },
        {
          type: "paragraph",
          text: "See [Apple’s guide to Voice Memos on Apple Watch](https://support.apple.com/guide/watch/voice-memos-apd441786282/watchos).",
        },
        {
          type: "paragraph",
          text: "**On Apple Watch Ultra,** you can set the Action button to Voice Memo. Press once to start a voice memo, and press again to stop recording. To set it up, open Settings on the Watch, tap Action Button, tap Action, and choose an action. Apple lists Voice Memo among the [Action button functions](https://support.apple.com/guide/watch/use-the-action-button-apda005904ef/watchos).",
        },
        {
          type: "note",
          text: "Before you rely on it for something long, make a test recording of the same length.",
        },
      ],
    },
    {
      id: "play-back",
      heading: "How do you play a voice memo on your Watch?",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Open the **Voice Memos** app on your Apple Watch.",
            "Tap a recording, then tap the **Play** button.",
            "Tap **Skip Ahead** or **Skip Back** to move through the recording.",
          ],
        },
        {
          type: "paragraph",
          text: "Those are the playback controls Apple lists for the Watch. For trimming, renaming, sharing, and transcripts, use Voice Memos on your iPhone.",
        },
      ],
    },
    {
      id: "find-on-iphone",
      heading: "Where do your Watch recordings show up on iPhone?",
      blocks: [
        {
          type: "paragraph",
          text: "Apple says recordings on your Watch “automatically sync to your iPhone, iPad, and Mac where you’re signed in with your Apple Account.” Open Voice Memos on any of those devices and tap or click **Watch Recordings**.",
        },
        {
          type: "paragraph",
          text: "Watch Recordings is one of Voice Memos’ Smart Folders, which Apple says gather recordings by type automatically. Syncing also needs Voice Memos turned on in iCloud. On iPhone, go to Settings > [your name] > iCloud > See All, then turn on Voice Memos. See Apple’s guides to [keeping recordings up to date](https://support.apple.com/guide/iphone/keep-recordings-up-to-date-iph38b91c7af/ios) and [organizing recordings](https://support.apple.com/guide/iphone/organize-recordings-iph73bfaba07/ios).",
        },
        {
          type: "paragraph",
          text: "For the other ways to get audio from your wrist, including apps that transfer recordings their own way, see [How to Record Audio and Conversations on Apple Watch](https://memova.ai/journal/how-to-record-audio-on-apple-watch/).",
        },
      ],
    },
    {
      id: "transcript",
      heading: "How do you see a transcript of an Apple Watch voice memo?",
      blocks: [
        {
          type: "paragraph",
          text: "Transcripts are made in Voice Memos on iPhone. Apple says audio transcription is available on iPhone 12 or later in English (all variants), Spanish, Portuguese, Italian, French, German, Japanese, Korean, Simplified Chinese, and Traditional Chinese, and that it is not available in all countries or regions.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Open **Voice Memos** on your iPhone and tap the recording.",
            "Tap the **More** button.",
            "To copy part of the text, choose **View Transcript**, select the text, then tap Copy. To copy all of it, choose **Copy Transcript**.",
            "Paste the text into another document, such as a Mail message or a text file.",
          ],
        },
        {
          type: "paragraph",
          text: "**To search what was said,** tap the Search button in Voice Memos and enter a word or phrase. The list shows recordings with that text in the title or in the transcription. Select a term in the transcription, and the playhead moves to that point in the audio.",
        },
        {
          type: "paragraph",
          text: "**For a summary,** Apple Intelligence Writing Tools can summarize a transcript. On iOS 27, Apple says that requires an Apple Intelligence-enabled iPhone 15 Pro, iPhone 15 Pro Max, or iPhone 16 model or later, and it is not available in all languages or regions. All of these steps come from [Apple’s guide to viewing a Voice Memos transcription](https://support.apple.com/guide/iphone/view-a-transcription-iph00953a982/ios).",
        },
      ],
    },
    {
      id: "limits",
      heading: "What can’t Apple Watch Voice Memos do?",
      blocks: [
        {
          type: "paragraph",
          text: "Voice Memos is free and already on your Watch, which makes it the right first choice for many people. Based on Apple’s documentation, these are the gaps to know about:",
        },
        {
          type: "list",
          items: [
            "**No transcript on an older iPhone.** Transcription needs an iPhone 12 or later, a supported language, and a supported country or region.",
            "**No transcript on the Watch.** Apple’s Watch guide covers recording and playback only. You read the text on your iPhone.",
            "**It records only when you start it.** Apple’s Watch instructions describe starting each memo with a tap or, on Ultra, the Action button; they do not describe scheduled recording.",
            "**Summaries depend on your iPhone.** Writing Tools summaries need an Apple Intelligence-enabled iPhone 15 Pro, iPhone 15 Pro Max, or an iPhone 16 model or later.",
            "**Organization is by name and folder.** Apple describes renaming, favorites, folders, and search. If you record many times a day, keeping track of which memo is which is up to you.",
          ],
        },
        {
          type: "paragraph",
          text: "If none of these gets in your way, Voice Memos is enough. If they do, a recording app may be a better fit.",
        },
      ],
    },
    {
      id: "voice-memos-or-app",
      heading: "When is a recording app a better fit than Voice Memos?",
      blocks: [
        {
          type: "paragraph",
          text: "A third-party app is worth a look if you record often, have an iPhone that Voice Memos cannot transcribe on, or want to find what was said across many recordings. Here is how Voice Memos compares with [Memova](https://memova.ai/), an Apple Watch voice recorder that transcribes and searches on your iPhone.",
        },
        {
          type: "table",
          caption: "Apple Watch Voice Memos compared with Memova",
          headers: ["Question", "Voice Memos", "Memova"],
          rows: [
            [
              "How do I start?",
              "Tap Record in the app, or press the Action button on Apple Watch Ultra",
              "Tap to record on the Watch. Recording continues with the screen off",
            ],
            [
              "Where is the transcript made?",
              "In Voice Memos on iPhone 12 or later, in supported languages",
              "On your iPhone, on the device, and it works offline. Cloud transcription is optional",
            ],
            [
              "How do I find something later?",
              "Search titles and transcripts in Voice Memos on iPhone",
              "Offline search of your transcripts, with recordings arranged on a timeline by hour",
            ],
            [
              "Where does the audio go?",
              "Syncs through iCloud to your iPhone, iPad, and Mac",
              "Stays on your device by default. There is no cloud sync or backup",
            ],
            [
              "What does it cost?",
              "Free and built in",
              "Recording, on-device transcription, and offline search are free. Check the app for current pricing of Memova Pro",
            ],
          ],
        },
        {
          type: "image",
          src: "/journal/apple-watch-voice-memos-guide/03-memova-record-and-find.webp",
          alt: "Memova Watch recording beside the Days screen from the English prototype.",
          width: 2000,
          height: 1250,
          caption: "Memova: record on your wrist, then search on your iPhone.",
        },
        {
          type: "paragraph",
          text: "A few points from Memova’s [privacy policy](https://memova.ai/privacy/) are worth knowing before you choose. The app works without a Memova account, including optional cloud features. If you pick cloud transcription, the selected audio is sent to Microsoft Azure and deleted immediately when transcription finishes. Optional cloud text features, such as daily recaps, receive the transcript text and context you authorize, not your original audio. Cloud task content and results are held only temporarily for processing and delivery, deleted immediately after download to your phone, and kept for no more than 24 hours. The app does not provide cloud content sync or backup. Original audio that the app manages is kept for no more than 30 days, and you can set when it is cleared. Transcripts and other results stay saved on your device. If you want to keep audio files indefinitely, Voice Memos may suit you better.",
        },
        {
          type: "paragraph",
          text: "Memova requires iOS 17 and watchOS 10 or later, according to its [App Store listing](https://apps.apple.com/us/app/memova-ai/id6796284954). For a wider comparison that also covers Just Press Record and Granola, see [Best Voice Recorder for Apple Watch](https://memova.ai/journal/best-voice-recorder-for-apple-watch/).",
        },
      ],
    },
    {
      id: "consent",
      heading: "Do you need permission to record someone with Voice Memos?",
      blocks: [
        {
          type: "paragraph",
          text: "If the memo includes other people, often yes. In the United States, federal law requires the consent of at least one person in the conversation, which can be you, and some states require consent from everyone. The [Reporters Committee’s recording guide](https://www.rcfp.org/introduction-to-reporters-recording-guide/) summarizes the rules state by state. Other countries have their own laws, and many workplaces have their own policies.",
        },
        {
          type: "paragraph",
          text: "The simplest habit is to ask first: “Mind if I record this so I can check the details later?” Stop if anyone says no.",
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
          text: "**Is there a Voice Memos app on Apple Watch?**",
        },
        {
          type: "paragraph",
          text: "Yes. Voice Memos is built into Apple Watch, which some people still call the iWatch. Open it, tap Record, and tap Stop Recording when you finish. You can play memos back on the Watch.",
        },
        {
          type: "paragraph",
          text: "**Where do Apple Watch voice memos go?**",
        },
        {
          type: "paragraph",
          text: "They sync through iCloud to Voice Memos on your iPhone, iPad, and Mac when those devices use the same Apple Account and Voice Memos is turned on in iCloud. Look in the Watch Recordings folder.",
        },
        {
          type: "paragraph",
          text: "**Can Apple Watch Voice Memos transcribe recordings?**",
        },
        {
          type: "paragraph",
          text: "Yes, on your iPhone. Open the recording in Voice Memos on an iPhone 12 or later to view or copy its transcript, in supported languages and regions. Apple’s Watch guide does not describe viewing transcripts on the Watch.",
        },
        {
          type: "paragraph",
          text: "**Can I search the words in my voice memos?**",
        },
        {
          type: "paragraph",
          text: "Yes. In Voice Memos on iPhone, tap Search and enter a word or phrase. Apple says results include recordings with that text in the title or the transcription.",
        },
        {
          type: "paragraph",
          text: "**How do I start a voice memo faster on Apple Watch Ultra?**",
        },
        {
          type: "paragraph",
          text: "Set the Action button to Voice Memo in Settings > Action Button > Action. Then press it once to start a memo and again to stop.",
        },
        {
          type: "paragraph",
          text: "**Is Voice Memos the best voice memo app for Apple Watch?**",
        },
        {
          type: "paragraph",
          text: "It is the best place to start, because it is free and already installed. If you need transcripts on an older iPhone, offline search across many recordings, or recordings arranged by time of day, compare recording apps first.",
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
