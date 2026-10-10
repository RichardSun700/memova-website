(() => {
  const section = document.getElementById("social-distribution");
  if (!section || section.querySelector(".social-context-showcase")) return;
  const desktop = window.matchMedia("(min-width: 1000px)");
  const phone = window.matchMedia("(max-width: 760px)");
  const originalHeader = section.querySelector(".memova-social-rail__copy");
  const editor = section.querySelector("[data-share-prototype]");
  const originalParent = editor?.parentElement;
  if (!originalHeader || !editor) return;

  const translations = {
    en: {
      eyebrow: "03 · BUILD IN PUBLIC",
      title: "From your meeting.",
      titleAccent: "To your next post.",
      intro: "Keep Memova open while you meet. Capture standout ideas, turn one into platform-ready drafts, then review and publish.",
      meetingLabel: "MEETING TO SOCIAL",
      meetingName: "Apollo 11 · Debrief demo",
      meetingStatus: "3 ideas extracted",
      meetingFlow: "Record the meeting → Find the highlights → Review and share",
      meetingContext: "Meeting notes and related records stay connected in your knowledge base.",
      meetingCaveat: "Fictional transcript and illustrative timestamps · Not historical audio or Neil’s words.",
      quotesLabel: "Choose a highlight",
      trainingTopic: "Training",
      decisionsTopic: "Decisions",
      teamworkTopic: "Teamwork",
      quoteSpeaker: "Neil’s perspective · Fictional speaker",
      quoteSource: "From the demo transcript",
      transcriptOpen: "View the demo transcript",
      reviewDrafts: "Review drafts",
      draftsReady: "{topic} · 3 drafts ready",
      open: "Explore the publishing demo",
      sourceLabel: "NEIL’S CONTEXT",
      outputsLabel: "SHAPED FOR EACH PLATFORM",
      tabsLabel: "Preview posts by platform",
      xTab: "X · Image",
      linkedinTab: "LinkedIn · Link",
      otherTab: "Video",
      sourceName: "Apollo 11 · Mission debrief",
      sourceSubtitle: "A historical what-if built from public mission records.",
      demoLabel: "Fictional demo · Not Neil’s social media",
      demoDisclosure: "These fictional accounts and posts were created by Memova. They are not Neil Armstrong’s own or official social media, posts or quotes. No affiliation with or endorsement by Neil Armstrong, his estate or NASA is implied.",
      demoPurpose: "This demonstrates how Memova understands and connects context, draws on a knowledge base, and turns source material into social drafts in a user’s voice and each platform’s style.",
      sourceHeading: "The story behind the post",
      sourceBody: "Mission notes, decisions, and lessons — connected in one knowledge base.",
      sourceTagOne: "Mission records",
      sourceTagTwo: "Team reflections",
      sourceMeta: "Connected sources · Private knowledge",
      sourceLink: "Explore the source material",
      avatarName: "Neil’s perspective · Fictional demo",
      xHandle: "Fictional post · Not his account",
      linkedinHandle: "Fictional post · Not his account",
      xCopy: "Stepping onto the Moon was only the beginning.\n\nI want to leave a record of how we got there—the decisions, the training, and what the next crew can learn. #Apollo11 #Memova",
      linkedinCopy: "Back on Earth, I’m reviewing what our training prepared us for.\n\nMy takeaway: shorter sessions, each focused on one mission phase. I’ve put my recommendations in this debrief. #Apollo11 #Memova",
      imageTitle: "My Apollo 11 debrief: training and decisions",
      linkDescription: "Landing, teamwork and training—lessons for the next crew.",
      xImageAlt: "Apollo 11 bootprint in lunar soil, photographed by Buzz Aldrin",
      linkedinImageAlt: "Apollo 11 lunar module approaching for docking, with Earth above the Moon",
      xCredit: "NASA / Buzz Aldrin · AS11-40-5878",
      linkedinCredit: "NASA · AS11-44-6642",
      xFormat: "Image post",
      linkedinFormat: "Link post",
      otherFormat: "Video post",
      otherName: "More channels",
      otherPurpose: "TikTok voice · Adapt for Shorts & Reels",
      otherHandle: "Fictional post · Not his account",
      otherCopy: "POV: my first day on the way to the Moon.\n\nAt liftoff, all that training became a real mission. I kept this footage—come see what happened next. #Apollo11 #Memova",
      videoDuration: "12-second example · Vertical video",
      videoCredit: "NASA archival footage · Imagined Neil perspective",
      videoHook: "Come leave Earth with me.",
      videoSource: "Footage: NASA · Apollo 11 Introduction",
      playVideo: "Play video example",
      pauseVideo: "Pause video",
      videoError: "Unable to play. Please try again.",
      sourceFootnote: "From the same mission debrief",
      xPurpose: "One image. One conversation starter.",
      linkedinPurpose: "A lesson, with the context to explore it.",
      xOpen: "View X draft",
      linkedinOpen: "View LinkedIn draft",
      principleOne: "Connected to your sources",
      principleTwo: "In your own voice",
      principleThree: "Reviewed before publishing",
      dialogTitle: "Fictional publishing demo",
      close: "Close",
      demoNote: "Imagined first-person demo · Your review comes before publishing.",
      channelNote: "Publish to X and LinkedIn. Prepare content for more channels.",
      disclosureOpen: "Transcript & demo details",
      demoPurposeMobile: "See how Memova turns meeting context into drafts for each platform.",
      feedbackNext: "After sharing, bring feedback into your knowledge base",
    },
    zh: {
      eyebrow: "03 · 公开构建",
      title: "开会里的好观点，",
      titleAccent: "成为下一条内容。",
      intro: "开着 Memova 开会，自动提取金句。选一句，结合会议背景生成不同平台的社媒草稿，审核后一键发布。",
      meetingLabel: "从会议到社媒",
      meetingName: "阿波罗 11 号 · 复盘演示",
      meetingStatus: "已提取 3 条金句",
      meetingFlow: "记录会议 → 提取金句 → 审核与分享",
      meetingContext: "会议笔记与相关资料，在同一份知识库中保持关联。",
      meetingCaveat: "虚构演示转录与示意时间戳 · 非历史录音或尼尔原话。",
      quotesLabel: "点选一条金句",
      trainingTopic: "训练",
      decisionsTopic: "决策",
      teamworkTopic: "协作",
      quoteSpeaker: "尼尔视角 · 虚构演示发言",
      quoteSource: "来自演示转录",
      transcriptOpen: "查看演示转录",
      reviewDrafts: "审核社媒草稿",
      draftsReady: "{topic} · 3 种草稿已就绪",
      open: "查看完整发布演示",
      sourceLabel: "尼尔的任务记录",
      outputsLabel: "适配不同平台的表达",
      tabsLabel: "按平台查看帖子示例",
      xTab: "X · 图片",
      linkedinTab: "LinkedIn · 链接",
      otherTab: "视频",
      sourceName: "阿波罗 11 号 · 任务复盘",
      sourceSubtitle: "基于公开任务记录构建的历史假想示例。",
      demoLabel: "假想演示 · 非尼尔本人的社媒",
      demoDisclosure: "以下账号与帖子均由 Memova 创作，属于虚构示例，并非尼尔·阿姆斯特朗本人或官方的社媒账号、帖子或原话，也不表示他本人、其遗产管理方或 NASA 与 Memova 存在关联或对其认可。",
      demoPurpose: "用于展示 Memova 如何理解并关联 Context、从知识库提取背景，再按用户的表达风格和不同平台的特点，将原始资料整理成社媒草稿。",
      sourceHeading: "内容背后的完整背景",
      sourceBody: "任务笔记、决策与复盘，在同一份知识库中保持关联。",
      sourceTagOne: "任务记录",
      sourceTagTwo: "团队复盘",
      sourceMeta: "关联原始资料 · 私密知识库",
      sourceLink: "查看资料来源",
      avatarName: "尼尔视角 · 假想演示",
      xHandle: "非本人账号 · 虚构帖子",
      linkedinHandle: "非本人账号 · 虚构帖子",
      xCopy: "踏上月面只是开始。我更想留下我们是怎样走到这里的。\n\n把判断与经验记录下来，供下一支乘组参考。#Apollo11 #Memova",
      linkedinCopy: "返回地球后，我想把训练中的得失留给下一支乘组。\n\n比起一次长时间复习，我更倾向于多次短而专注的训练，每次围绕一个任务阶段。具体建议在这份复盘里。#Apollo11 #Memova",
      imageTitle: "我的阿波罗 11 号复盘：训练与判断",
      linkDescription: "着陆、协作与训练：留给下一支乘组的经验。",
      xImageAlt: "巴兹·奥尔德林拍摄的阿波罗 11 号月面足迹",
      linkedinImageAlt: "阿波罗 11 号登月舱接近交会，地球悬在月面上方",
      xCredit: "NASA / Buzz Aldrin · AS11-40-5878",
      linkedinCredit: "NASA · AS11-44-6642",
      xFormat: "图片帖",
      linkedinFormat: "链接帖",
      otherFormat: "视频帖",
      otherName: "更多平台",
      otherPurpose: "TikTok 口吻 · 可适配 Shorts / Reels",
      otherHandle: "非本人账号 · 虚构帖子",
      otherCopy: "POV：这是我去月球的第一天。\n\n起飞的那一刻，所有训练终于变成了真正的任务。把这段影像留下，带你看看接下来发生了什么。#Apollo11 #Memova",
      videoDuration: "12 秒示例 · 竖版视频",
      videoCredit: "NASA 历史影像 · 假想尼尔视角",
      videoHook: "和我一起，离开地球。",
      videoSource: "影像：NASA · Apollo 11 Introduction",
      playVideo: "播放视频示例",
      pauseVideo: "暂停视频",
      videoError: "暂时无法播放，请重试。",
      sourceFootnote: "来自同一份任务复盘",
      xPurpose: "一张图，一个值得聊的想法",
      linkedinPurpose: "分享方法，链接里有完整背景",
      xOpen: "查看 X 草稿",
      linkedinOpen: "查看 LinkedIn 草稿",
      principleOne: "始终关联原始资料",
      principleTwo: "保持你的表达风格",
      principleThree: "发布前由你审核",
      dialogTitle: "假想发布演示",
      close: "关闭",
      demoNote: "第一人称假想演示 · 发布前由你审核。",
      channelNote: "直接发布到 X 和 LinkedIn，为更多平台准备内容。",
      disclosureOpen: "查看转录与演示说明",
      demoPurposeMobile: "展示 Memova 如何将会议背景，变成不同平台的社媒草稿。",
      feedbackNext: "发布之后，让反馈回到知识库",
    },
  };

  // Local demonstration fixtures, not a historical transcript or live extraction.
  const meetingExamples = {
    training: {
      time: "04:12",
      en: {
        quote: "Shorter, focused training lets us examine each decision more clearly.",
        xCopy: "Before that small step came countless small rehearsals.\n\nI want shorter, focused training: one mission phase at a time, with lessons the next crew can use. #Apollo11 #Memova",
        linkedinCopy: "After this mission, I want to rethink our training rhythm.\n\nMy approach: shorter sessions, each focused on one mission phase, with lessons carried into the next round. I’ve put the recommendations in this debrief. #Apollo11 #Memova",
        otherCopy: "POV: you saw my liftoff, but not the rehearsals.\n\nBefore this moment, I practiced each mission phase again and again. Now the preparation becomes a real mission. #Apollo11 #Memova",
        imageTitle: "My Apollo 11 debrief: rethinking training",
        linkDescription: "Focused practice and lessons for the next crew.",
        videoHook: "You see liftoff. I remember the rehearsals.",
      },
      zh: {
        quote: "把训练拆成短而专注的阶段，才能看清每一次判断。",
        xCopy: "这一小步之前，是无数次小练习。\n\n我想把训练拆得更短、更专注：每次解决一个任务阶段的问题，再把经验留下。#Apollo11 #Memova",
        linkedinCopy: "这次任务结束后，我最想调整的是训练节奏。\n\n我的选择是更短、更专注的训练，每次围绕一个任务阶段，再把复盘结果带回下一轮。具体建议整理在这份任务复盘里。#Apollo11 #Memova",
        otherCopy: "POV：你看到了我的起飞，却没看到之前的练习。\n\n这一刻之前，我反复练习每个任务阶段。现在，把准备变成真正的行动。#Apollo11 #Memova",
        imageTitle: "我的阿波罗 11 号复盘：重新思考训练",
        linkDescription: "专注练习，留下供下一支乘组参考的经验。",
        videoHook: "你看到起飞，我记得每次练习。",
      },
    },
    decisions: {
      time: "06:38",
      en: {
        quote: "Reaching the destination is the result. The decisions that got us there are worth keeping.",
        xCopy: "This footprint doesn’t show the decisions before landing.\n\nI want to keep the why alongside the result, so the next crew has something to build on. #Apollo11 #Memova",
        linkedinCopy: "After landing, I’m thinking about how to pass our decisions to the next crew.\n\nRecording the result is a start. I want the evidence, judgment and debrief connected, so others can understand why we acted. The full record is in this debrief. #Apollo11 #Memova",
        otherCopy: "POV: I made more decisions before liftoff than this clip can show.\n\nA video keeps the moment. My mission notes need to keep the reasoning behind it, too. #Apollo11 #Memova",
        imageTitle: "My Apollo 11 debrief: the decisions behind the result",
        linkDescription: "Evidence, judgment and lessons connected in one record.",
        videoHook: "I’m keeping the decisions, too.",
      },
      zh: {
        quote: "抵达只是结果。值得留下的，是我们如何做出每一个判断。",
        xCopy: "这张脚印照片里，看不到着陆前的判断。\n\n我想把“为什么这样做”也记录下来，让下一支乘组有迹可循。#Apollo11 #Memova",
        linkedinCopy: "着陆之后，我更在意怎样把决策过程交给下一支乘组。\n\n记录结果只是开始。我会把依据、判断和复盘连在一起，让别人看得懂当时为什么这样做。完整记录在这份任务复盘里。#Apollo11 #Memova",
        otherCopy: "POV：这次起飞前，我做过的判断远比画面里多。\n\n一段视频留下瞬间；我的任务记录，还要留下背后的依据。#Apollo11 #Memova",
        imageTitle: "我的阿波罗 11 号复盘：结果背后的判断",
        linkDescription: "让依据、判断与经验留在同一份记录里。",
        videoHook: "我把判断，也留在记录里。",
      },
    },
    teamwork: {
      time: "08:05",
      en: {
        quote: "Working together starts when everyone understands why we are taking the next step.",
        xCopy: "A footprint on the Moon. A whole team behind it.\n\nI want to remember how we worked together, as well as what I did. #Apollo11 #Memova",
        linkedinCopy: "This mission reinforced something for me: teamwork needs shared context.\n\nI want everyone to understand the reasoning as well as the next action. Connecting roles, evidence and lessons can help us work better together next time. More in my debrief. #Apollo11 #Memova",
        otherCopy: "POV: one rocket in the frame, a whole team behind it.\n\nI could leave Earth because others prepared every part of the mission. I’m keeping this clip for the people who made it possible. #Apollo11 #Memova",
        imageTitle: "My Apollo 11 debrief: making teamwork possible",
        linkDescription: "Shared context, connected roles and lessons for next time.",
        videoHook: "I went to the Moon with a whole team.",
      },
      zh: {
        quote: "当每个人都清楚自己为什么行动，协作才真正开始。",
        xCopy: "月面上是一串脚印，背后是一整个团队。\n\n我想记住的，不只是自己做了什么，还有我们怎样一起完成任务。#Apollo11 #Memova",
        linkedinCopy: "完成任务后，我更确信：协作需要共享背景。\n\n我希望团队不只知道下一步做什么，也理解每个判断的依据。把角色、信息和复盘连起来，下一次协作才有机会更好。具体方法在这份任务复盘里。#Apollo11 #Memova",
        otherCopy: "POV：镜头里是一枚火箭，背后是整个团队。\n\n我能出发，是因为有人把每一个环节准备好。把这段起飞影像，留给和我一起完成任务的人。#Apollo11 #Memova",
        imageTitle: "我的阿波罗 11 号复盘：协作如何发生",
        linkDescription: "共享背景，关联角色，把经验带到下一次协作。",
        videoHook: "我去月球，和整个团队一起。",
      },
    },
  };

  // Phone drafts are edited separately so the original desktop examples stay intact.
  const phoneMeetingExamples = {
    training: {
      en: {
        xCopy: "Before my small step came countless rehearsals.\n\nI want focused practice, one mission phase at a time. #Apollo11 #Memova",
        linkedinCopy: "This mission made me rethink training.\n\nMy approach: shorter sessions, one mission phase at a time, with lessons carried forward. Recommendations in my debrief. #Apollo11 #Memova",
        otherCopy: "POV: you saw my liftoff, not the rehearsals.\n\nI practiced each mission phase. Now the preparation becomes action. #Apollo11 #Memova",
      },
      zh: {
        xCopy: "这一小步，我练过无数次。\n\n每次专注一个任务阶段。#Apollo11 #Memova",
        linkedinCopy: "这次任务让我重新思考训练。\n\n我更倾向于短而专注的练习，把复盘带到下一轮。具体建议在这份任务复盘里。#Apollo11 #Memova",
        otherCopy: "POV：你看到我的起飞，我记得之前每次练习。\n\n准备，终于变成行动。#Apollo11 #Memova",
      },
    },
    decisions: {
      en: {
        xCopy: "This footprint hides my decisions before landing.\n\nI’m keeping the why, too, for the next crew. #Apollo11 #Memova",
        linkedinCopy: "After landing, I want to pass our decisions to the next crew.\n\nEvidence, judgment and lessons belong together. The full record is in my debrief. #Apollo11 #Memova",
        otherCopy: "POV: I made more decisions than this clip can show.\n\nThe video keeps a moment. My notes keep the reasoning. #Apollo11 #Memova",
      },
      zh: {
        xCopy: "脚印照片里，藏着我着陆前的判断。\n\n结果之外，也留下依据。#Apollo11 #Memova",
        linkedinCopy: "着陆之后，我想把决策过程交给下一支乘组。\n\n把依据、判断和复盘连起来。完整记录在这份任务复盘里。#Apollo11 #Memova",
        otherCopy: "POV：我的判断，远比这段起飞画面多。\n\n影像留下瞬间，任务记录留下依据。#Apollo11 #Memova",
      },
    },
    teamwork: {
      en: {
        xCopy: "A footprint on the Moon. A whole team behind it.\n\nI’m keeping our teamwork in the record. #Apollo11 #Memova",
        linkedinCopy: "This mission reminded me: teamwork needs shared context.\n\nI’m connecting roles, evidence and lessons, so we work better next time. More in my debrief. #Apollo11 #Memova",
        otherCopy: "POV: one rocket, a whole team.\n\nI could leave Earth because others prepared every part. This clip is for them. #Apollo11 #Memova",
      },
      zh: {
        xCopy: "月面是一串脚印，背后是一整个团队。\n\n我想记住我们怎样一起完成任务。#Apollo11 #Memova",
        linkedinCopy: "这次任务让我确信：协作需要共享背景。\n\n我把角色、依据和复盘连起来，留给下一次协作。具体方法在我的复盘里。#Apollo11 #Memova",
        otherCopy: "POV：一枚火箭，整个团队。\n\n我能出发，是因为他们准备好了每个环节。#Apollo11 #Memova",
      },
    },
  };

  const phoneCopy = {
    en: {
      title: "From a meeting.",
      titleAccent: "To your next post.",
      intro: "Memova captures meeting highlights. Review a draft, then publish.",
      meetingCaveat: "Fictional transcript · Not Neil’s words.",
      quoteSpeaker: "Fictional Neil perspective",
      reviewDrafts: "Review this draft",
      demoPurposeMobile: "Memova turns one meeting into platform-ready drafts.",
    },
    zh: {
      title: "会议里的观点，",
      titleAccent: "成为社媒草稿。",
      intro: "Memova 自动提取会议金句，审核后一键发布。",
      meetingCaveat: "虚构转录 · 非尼尔原话",
      quoteSpeaker: "尼尔视角 · 虚构发言",
      reviewDrafts: "查看并审核草稿",
      demoPurposeMobile: "展示 Memova 如何将同一份会议资料，转为不同平台的草稿。",
    },
  };

  const showcase = document.createElement("div");
  showcase.className = "social-context-showcase";
  showcase.setAttribute("data-no-translate", "");
  showcase.innerHTML = `
    <header class="social-context-showcase__intro">
      <div>
        <p class="social-context-showcase__eyebrow" data-showcase-copy="eyebrow"></p>
        <h2 id="social-context-showcase-title"><span data-showcase-copy="title"></span><em data-showcase-copy="titleAccent"></em></h2>
      </div>
      <div class="social-context-showcase__summary">
        <p data-showcase-copy="intro"></p>
        <button class="social-context-showcase__open" type="button" data-showcase-open="x" data-showcase-copy="open"></button>
      </div>
    </header>
    <div class="social-context-showcase__flow">
      <aside class="social-context-showcase__disclosure" aria-labelledby="social-demo-disclosure-title">
        <strong id="social-demo-disclosure-title" data-showcase-copy="demoLabel"></strong>
        <p data-showcase-copy="demoDisclosure"></p>
        <p class="social-context-showcase__demo-purpose" data-showcase-copy="demoPurpose"></p>
        <p class="social-context-showcase__mobile-purpose" data-showcase-copy="demoPurposeMobile"></p>
        <details class="social-context-showcase__mobile-details">
          <summary data-showcase-copy="disclosureOpen"></summary>
          <div data-mobile-disclosure-body></div>
        </details>
      </aside>
      <article class="meeting-social-demo" aria-labelledby="meeting-social-demo-title">
        <div class="meeting-social-demo__context">
          <div class="meeting-social-demo__heading"><img ${phone.matches ? "" : 'src="./demo/icons/memova-meeting.svg"'} width="32" height="44" alt=""><div><p data-showcase-copy="meetingLabel"></p><h3 id="meeting-social-demo-title" data-showcase-copy="meetingName"></h3></div><select class="meeting-social-demo__mobile-choice" data-mobile-highlight aria-label="Choose a highlight">${Object.keys(meetingExamples).map(key => `<option value="${key}" data-showcase-copy="${key}Topic"></option>`).join("")}</select></div>
          <p class="meeting-social-demo__flow" data-showcase-copy="meetingFlow"></p>
          <p class="meeting-social-demo__context-copy" data-showcase-copy="meetingContext"></p>
          <p class="meeting-social-demo__caveat" data-showcase-copy="meetingCaveat"></p>
          <details class="meeting-social-demo__transcript">
            <summary data-showcase-copy="transcriptOpen"></summary>
            <ol>${Object.entries(meetingExamples).map(([key, example]) => `<li data-meeting-transcript="${key}"><span>${example.time}</span><p data-meeting-transcript-copy="${key}"></p></li>`).join("")}</ol>
            <a href="./sources/" data-showcase-copy="sourceLink"></a>
          </details>
        </div>
        <div class="meeting-social-demo__highlights">
          <div class="meeting-social-demo__highlight-heading"><strong data-showcase-copy="quotesLabel"></strong><span data-showcase-copy="meetingStatus"></span></div>
          <div class="meeting-social-demo__choices" role="group" data-meeting-choices aria-label="Choose a highlight">${Object.keys(meetingExamples).map((key) => `<button type="button" data-meeting-quote="${key}" aria-pressed="false"><span data-showcase-copy="${key}Topic"></span></button>`).join("")}</div>
          <blockquote data-showcase-copy="quote"></blockquote>
          <p class="meeting-social-demo__quote-source"><span data-showcase-copy="quoteSpeaker"></span><span><span data-showcase-copy="quoteSource"></span> <time data-meeting-time></time></span></p>
          <div class="meeting-social-demo__actions"><p aria-live="polite" aria-atomic="true" data-meeting-result></p><button type="button" class="social-context-showcase__open" data-meeting-review data-showcase-open="x" data-showcase-copy="reviewDrafts"></button></div>
        </div>
      </article>
      <div class="social-context-showcase__mobile-bridge" aria-hidden="true"><span>↓</span></div>
      <div class="social-context-showcase__tabs" role="tablist" aria-label="Preview posts by platform">
        ${["x", "linkedin", "other"].map((platform) => `<button type="button" role="tab" id="social-showcase-tab-${platform}" aria-controls="social-showcase-panel-${platform}" data-showcase-tab="${platform}"><span data-showcase-copy="${platform}Tab"></span></button>`).join("")}
      </div>
      <div class="social-context-showcase__outputs">
        ${["x", "linkedin", "other"].map((platform) => `
          <article id="social-showcase-panel-${platform}" class="social-context-showcase__draft social-context-showcase__draft--${platform}" data-showcase-panel="${platform}">
            <div class="social-context-showcase__platform">${platform === "other" ? `<span class="social-context-showcase__channel-icons"><img src="./social-platform-logos/tiktok.svg" width="20" height="20" alt="TikTok"><img src="./social-platform-logos/youtube.svg" width="20" height="20" alt="YouTube"><img src="./social-platform-logos/instagram.svg" width="20" height="20" alt="Instagram"></span><strong data-showcase-copy="otherName"></strong>` : `<img src="./social-platform-logos/${platform}.svg" width="20" height="20" alt=""><strong>${platform === "x" ? "X" : "LinkedIn"}</strong>`}<b class="social-context-showcase__format-badge" data-showcase-copy="${platform}Format"></b><span data-showcase-copy="${platform}Purpose"></span></div>
            <div class="social-context-showcase__post">
              <header><img src="./social-share-assets/neil-avatar.webp" width="32" height="32" alt=""><span><strong data-showcase-copy="avatarName"></strong><small data-showcase-copy="${platform}Handle"></small></span></header>
              <p class="social-context-showcase__post-copy" data-showcase-copy="${platform}Copy"></p>
              ${platform === "x" ? `<figure class="social-context-showcase__image-post"><img src="./social-share-assets/x-lunar-footprint.webp" width="900" height="724" loading="lazy" decoding="async" data-showcase-alt="xImageAlt" alt="Apollo 11 lunar bootprint"></figure>` : platform === "linkedin" ? `<figure class="social-context-showcase__link-post"><img src="./social-share-assets/linkedin-lunar-rendezvous.webp" width="800" height="674" loading="lazy" decoding="async" data-showcase-alt="linkedinImageAlt" alt="Apollo 11 lunar module rendezvous"><figcaption><small>memova.ai</small><strong data-showcase-copy="imageTitle"></strong><span data-showcase-copy="linkDescription"></span></figcaption></figure>` : `<figure class="social-context-showcase__video-post"><div class="social-context-showcase__video-frame"><p class="social-context-showcase__video-hook" data-showcase-copy="videoHook"></p><video data-showcase-video poster="./social-share-assets/apollo-launch-poster.webp" preload="none" playsinline aria-label="Apollo vertical video example"></video></div><figcaption><strong data-showcase-copy="videoDuration"></strong><span data-showcase-copy="videoCredit"></span></figcaption></figure>`}
            </div>
            <footer><a class="social-context-showcase__asset-credit" href="${platform === "x" ? "https://science.nasa.gov/resource/apollo-11-bootprint/" : platform === "linkedin" ? "https://www.nasa.gov/wp-content/uploads/static/history/ap11ann/kippsphotos/apollo.html" : "https://www.nasa.gov/missions/apollo-11-hd-videos/"}" target="_blank" rel="noopener" data-showcase-copy="${platform === "other" ? "videoSource" : `${platform}Credit`}"></a>${platform === "other" ? `<button type="button" data-showcase-play data-showcase-copy="playVideo"></button><span class="social-context-showcase__video-status" aria-live="polite" data-showcase-video-status></span>` : `<button type="button" data-showcase-open="${platform}" data-showcase-copy="${platform}Open"></button>`}</footer>
          </article>
        `).join("")}
      </div>
      <div class="social-context-showcase__mobile-review" data-mobile-review></div>
    </div>
    <div class="social-context-showcase__principles"><span data-showcase-copy="principleOne"></span><span data-showcase-copy="principleTwo"></span><span data-showcase-copy="principleThree"></span></div>
    <p class="social-context-showcase__channel-note" data-showcase-copy="channelNote"></p>
    <a class="social-context-showcase__feedback-next" href="#return"><span data-showcase-copy="feedbackNext"></span> <span aria-hidden="true">↓</span></a>
  `;
  section.querySelector(".memova-social-rail__inner").prepend(showcase);
  section.dataset.desktopShowcase = "true";

  const dialog = document.createElement("dialog");
  dialog.className = "social-showcase-dialog";
  dialog.setAttribute("aria-labelledby", "social-showcase-dialog-title");
  dialog.innerHTML = `<header class="social-showcase-dialog__header"><strong id="social-showcase-dialog-title" data-no-translate data-showcase-copy="dialogTitle"></strong><button type="button" data-showcase-close data-no-translate data-showcase-copy="close"></button></header><aside class="social-context-showcase__disclosure social-showcase-dialog__disclosure" data-no-translate aria-labelledby="social-dialog-disclosure-title"><strong id="social-dialog-disclosure-title" data-showcase-copy="demoLabel"></strong><p data-showcase-copy="demoDisclosure"></p><p class="social-context-showcase__demo-purpose" data-showcase-copy="demoPurpose"></p></aside><div class="social-showcase-dialog__body"></div><p class="social-showcase-dialog__note" data-no-translate data-showcase-copy="demoNote"></p>`;
  section.append(dialog);
  let trigger = null;
  let activePlatform = "x";
  let activeQuote = "training";
  const tabs = [...showcase.querySelectorAll("[data-showcase-tab]")];
  const panels = [...showcase.querySelectorAll("[data-showcase-panel]")];
  const formatSelect = editor.querySelector("[data-share-format]");
  const video = showcase.querySelector("[data-showcase-video]");
  const playButton = showcase.querySelector("[data-showcase-play]");
  const videoStatus = showcase.querySelector("[data-showcase-video-status]");
  const mobileHighlight = showcase.querySelector("[data-mobile-highlight]");
  const getCopy = () => {
    const lang = document.documentElement.dataset.siteLanguage === "zh" ? "zh" : "en";
    return { ...translations[lang], ...(phone.matches ? phoneCopy[lang] : {}), ...meetingExamples[activeQuote][lang], ...(phone.matches ? phoneMeetingExamples[activeQuote][lang] : {}) };
  };

  const disclosure = showcase.querySelector(".social-context-showcase__disclosure");
  const fullDisclosure = [...disclosure.querySelectorAll(":scope > p:not(.social-context-showcase__mobile-purpose)")];
  const mobilePurpose = disclosure.querySelector(".social-context-showcase__mobile-purpose");
  const disclosureBody = disclosure.querySelector("[data-mobile-disclosure-body]");
  const transcript = showcase.querySelector(".meeting-social-demo__transcript");
  const transcriptParent = transcript.parentElement;
  const reviewButton = showcase.querySelector("[data-meeting-review]");
  const reviewStatus = showcase.querySelector("[data-meeting-result]");
  const actions = reviewButton.parentElement;
  const mobileReview = showcase.querySelector("[data-mobile-review]");
  const flow = showcase.querySelector(".social-context-showcase__flow");
  const desktopMeetingIcon = showcase.querySelector(".meeting-social-demo__heading > img");
  const desktopMeetingIconSource = desktopMeetingIcon.getAttribute("src") || "./demo/icons/memova-meeting.svg";
  let phoneMeetingIcon;
  let transcriptWasOpen = false;
  let phoneLayout = false;
  function updatePhoneLayout() {
    if (phoneLayout === phone.matches) return;
    phoneLayout = phone.matches;
    if (phoneLayout) {
      if (!phoneMeetingIcon) {
        phoneMeetingIcon = document.createElement("span");
        phoneMeetingIcon.className = "mobile-app-entry-icon mobile-app-entry-icon--meeting";
        phoneMeetingIcon.setAttribute("aria-hidden", "true");
        phoneMeetingIcon.innerHTML = '<img src="./brand/app-entry-icons-reference-20261010.jpg" width="1280" height="2781" loading="lazy" decoding="async" alt="">';
      }
      desktopMeetingIcon.removeAttribute("src");
      desktopMeetingIcon.replaceWith(phoneMeetingIcon);
      transcriptWasOpen = transcript.open;
      transcript.open = true;
      disclosureBody.append(...fullDisclosure, transcript);
      mobileReview.append(reviewStatus, reviewButton);
      flow.append(disclosure);
    } else {
      phoneMeetingIcon?.replaceWith(desktopMeetingIcon);
      desktopMeetingIcon.setAttribute("src", desktopMeetingIconSource);
      fullDisclosure.forEach(node => disclosure.insertBefore(node, mobilePurpose));
      transcript.open = transcriptWasOpen;
      transcriptParent.append(transcript);
      actions.append(reviewStatus, reviewButton);
      flow.prepend(disclosure);
    }
  }

  playButton.addEventListener("click", async () => {
    if (!video.getAttribute("src")) video.src = "./social-share-assets/apollo-launch-short.mp4";
    video.controls = true;
    if (!video.paused) video.pause();
    else {
      try { await video.play(); videoStatus.textContent = ""; }
      catch (_) { videoStatus.textContent = getCopy().videoError; }
    }
  });
  const updateVideoButton = () => { playButton.textContent = video.paused ? getCopy().playVideo : getCopy().pauseVideo; };
  video.addEventListener("play", updateVideoButton);
  video.addEventListener("pause", updateVideoButton);
  video.addEventListener("ended", updateVideoButton);
  new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause(); }).observe(video);
  document.addEventListener("visibilitychange", () => { if (document.hidden) video.pause(); });

  function syncDraftToEditor(platform) {
    if (!["x", "linkedin", "tiktok"].includes(platform)) return;
    const copyKey = platform === "tiktok" ? "otherCopy" : `${platform}Copy`;
    const draft = showcase.querySelector(`[data-showcase-copy="${copyKey}"]`);
    editor.querySelector("[data-share-copy]").textContent = draft.textContent;
    editor.querySelector("[data-share-preview-name]").textContent = getCopy().avatarName;
    editor.querySelector("[data-share-preview-handle]").textContent = getCopy()[platform === "tiktok" ? "otherHandle" : `${platform}Handle`];
    editor.querySelector("[data-share-preview-icon]").src = "./social-share-assets/neil-avatar.webp";
    editor.querySelector("[data-share-preview-icon]").alt = getCopy().avatarName;
    const account = editor.querySelector(".memova-share-prototype__account");
    account.querySelector("img").src = "./social-share-assets/neil-avatar.webp";
    account.querySelector("img").alt = getCopy().avatarName;
    account.querySelector("strong").textContent = getCopy().avatarName;
    account.querySelector("small").textContent = getCopy().xHandle;
    const image = editor.querySelector("[data-share-card-image]");
    image.src = platform === "x" ? "./social-share-assets/x-lunar-footprint.webp" : platform === "linkedin" ? "./social-share-assets/linkedin-lunar-rendezvous.webp" : "./social-share-assets/apollo-launch-poster.webp";
    image.alt = platform === "tiktok" ? getCopy().videoHook : getCopy()[`${platform}ImageAlt`];
    editor.querySelector("[data-share-card-title]").textContent = platform === "tiktok" ? getCopy().videoHook : getCopy().imageTitle;
    editor.querySelector("[data-share-card] figcaption > span").textContent = platform === "tiktok" ? getCopy().videoCredit : getCopy().linkDescription;
  }
  editor.querySelectorAll("[data-share-platform]").forEach((button) => button.addEventListener("click", () => {
    if (editor.closest(".social-showcase-dialog")) {
      const format = button.dataset.sharePlatform === "x" ? "image" : button.dataset.sharePlatform === "linkedin" ? "link" : "text";
      if (format && formatSelect.value !== format) { formatSelect.value = format; formatSelect.dispatchEvent(new Event("change", { bubbles: true })); }
      syncDraftToEditor(button.dataset.sharePlatform);
    }
  }));
  formatSelect.addEventListener("change", () => {
    if (editor.closest(".social-showcase-dialog")) syncDraftToEditor(editor.dataset.platform);
  });

  function renderLanguage() {
    const lang = document.documentElement.dataset.siteLanguage === "zh" ? "zh" : "en";
    const copy = getCopy();
    section.querySelectorAll("[data-showcase-copy]").forEach((node) => {
      node.textContent = copy[node.dataset.showcaseCopy];
    });
    showcase.querySelectorAll("[data-showcase-alt]").forEach((node) => { node.alt = copy[node.dataset.showcaseAlt]; });
    showcase.querySelectorAll("[data-meeting-quote]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.meetingQuote === activeQuote)));
    showcase.querySelectorAll("[data-meeting-transcript-copy]").forEach((node) => { node.textContent = meetingExamples[node.dataset.meetingTranscriptCopy][lang].quote; });
    showcase.querySelectorAll("[data-meeting-transcript]").forEach((node) => { node.dataset.selected = String(node.dataset.meetingTranscript === activeQuote); });
    showcase.querySelector("[data-meeting-time]").textContent = meetingExamples[activeQuote].time;
    showcase.querySelector("[data-meeting-choices]").setAttribute("aria-label", copy.quotesLabel);
    mobileHighlight.setAttribute("aria-label", copy.quotesLabel);
    mobileHighlight.value = activeQuote;
    showcase.querySelector("[data-meeting-result]").textContent = copy.draftsReady.replace("{topic}", copy[`${activeQuote}Topic`]);
    video.setAttribute("aria-label", copy.videoHook);
    showcase.querySelector("[role=tablist]").setAttribute("aria-label", copy.tabsLabel);
    if (dialog.open) syncDraftToEditor(editor.dataset.platform);
    alignDraftCopy();
    updateVideoButton();
    announceExample();
  }
  function announceExample() {
    window.dispatchEvent?.(new CustomEvent("memova:socialexamplechange", { detail: { topic: activeQuote, platform: activePlatform } }));
  }
  function alignDraftCopy() {
    const captions = [...showcase.querySelectorAll(".social-context-showcase__post-copy")];
    captions.forEach((node) => { node.style.minHeight = ""; });
    if (!desktop.matches) return;
    const height = Math.ceil(Math.max(...captions.map((node) => node.getBoundingClientRect().height)));
    captions.forEach((node) => { node.style.minHeight = `${height}px`; });
  }
  let lastOutputWidth = 0;
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === lastOutputWidth) return;
    lastOutputWidth = entry.contentRect.width;
    alignDraftCopy();
  }).observe(showcase.querySelector(".social-context-showcase__outputs"));
  function chooseHighlight(key) {
    if (key === activeQuote) return;
    activeQuote = key;
    video.pause();
    renderLanguage();
  }
  showcase.querySelectorAll("[data-meeting-quote]").forEach((button) => button.addEventListener("click", () => chooseHighlight(button.dataset.meetingQuote)));
  mobileHighlight.addEventListener("change", () => chooseHighlight(mobileHighlight.value));
  function updatePanels() {
    tabs.forEach((tab) => {
      const selected = tab.dataset.showcaseTab === activePlatform;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = !desktop.matches && panel.dataset.showcasePanel !== activePlatform;
      if (desktop.matches) {
        panel.removeAttribute("role");
        panel.removeAttribute("aria-labelledby");
      } else {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", `social-showcase-tab-${panel.dataset.showcasePanel}`);
      }
    });
    if (!desktop.matches && activePlatform !== "other") video.pause();
    showcase.querySelector("[data-meeting-review]").dataset.showcaseOpen = activePlatform === "other" ? "tiktok" : activePlatform;
    announceExample();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => { activePlatform = tab.dataset.showcaseTab; updatePanels(); });
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    });
  });
  function updateBreakpoint() {
    section.setAttribute("aria-labelledby", "social-context-showcase-title");
    updatePanels();
    alignDraftCopy();
  }
  showcase.querySelectorAll("[data-showcase-open]").forEach((button) => button.addEventListener("click", () => {
    trigger = button;
    video.pause();
    dialog.querySelector(".social-showcase-dialog__body").append(editor);
    editor.querySelector(`[data-share-platform="${button.dataset.showcaseOpen}"]`)?.click();
    dialog.showModal();
  }));
  dialog.querySelector("[data-showcase-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (editor.querySelector("[data-share-copy]").getAttribute("contenteditable") === "true") editor.querySelector("[data-share-edit]").click();
    const platform = editor.dataset.platform;
    if (["x", "linkedin", "tiktok"].includes(platform)) showcase.querySelector(`[data-showcase-copy="${platform === "tiktok" ? "otherCopy" : `${platform}Copy`}"]`).textContent = editor.querySelector("[data-share-copy]").textContent;
    originalParent.append(editor);
    alignDraftCopy();
    announceExample();
    trigger?.focus();
  });
  desktop.addEventListener("change", updateBreakpoint);
  phone.addEventListener("change", () => { updatePhoneLayout(); renderLanguage(); });
  window.addEventListener("memova:languagechange", renderLanguage);
  updatePhoneLayout();
  renderLanguage();
  updateBreakpoint();
  // Wait for the homepage's layout and initial scroll setup before resolving
  // this dynamically inserted section's deep link.
  if (window.location.hash === "#social-distribution") {
    const revealSection = () => requestAnimationFrame(() => section.scrollIntoView({ block: "start", behavior: "instant" }));
    if (document.readyState === "complete") revealSection();
    else window.addEventListener("load", revealSection, { once: true });
  }
})();
