(() => {
  "use strict";

  const STORAGE_KEY = "xiaojii-checkin-v1";
  const DAY_NAMES = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const SHORT_DAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"];
  const COLOR_STYLES = {
    lime: { background: "#eff6bd", accent: "#6f8b21" },
    coral: { background: "#fde0d2", accent: "#b56848" },
    sky: { background: "#e2f2f7", accent: "#4b8499" },
    lilac: { background: "#eee7fa", accent: "#7863a0" },
    sand: { background: "#f7ebd1", accent: "#98752d" }
  };
  const DEFAULT_HABITS = [
    {
      id: "workout",
      name: "运动",
      icon: "🏃",
      color: "lime",
      mode: "count",
      target: 30,
      step: 10,
      unit: "分钟",
      description: "每一步都算数，今天也为自己动起来。",
      createdAt: new Date().toISOString()
    },
    {
      id: "water",
      name: "喝水",
      icon: "💧",
      color: "sky",
      mode: "count",
      target: 8,
      step: 1,
      unit: "杯",
      description: "身体需要一点水润，记得慢慢喝。",
      createdAt: new Date().toISOString()
    },
    {
      id: "read",
      name: "阅读",
      icon: "📚",
      color: "sand",
      mode: "count",
      target: 20,
      step: 5,
      unit: "分钟",
      description: "给自己留一段安静阅读的时间。",
      createdAt: new Date().toISOString()
    },
    {
      id: "sleep",
      name: "早睡",
      icon: "🌙",
      color: "lilac",
      mode: "boolean",
      target: 1,
      step: 1,
      unit: "次",
      description: "今晚早点放下手机，让身体休息。",
      createdAt: new Date().toISOString()
    },
    {
      id: "vocab",
      name: "背单词",
      icon: "📖",
      color: "sky",
      mode: "count",
      target: 20,
      step: 5,
      unit: "个",
      description: "每天记一点，词汇量会替你记得。",
      createdAt: new Date().toISOString()
    },
    {
      id: "review",
      name: "今日复盘",
      icon: "🧭",
      color: "sand",
      mode: "count",
      target: 10,
      step: 5,
      unit: "分钟",
      description: "回看今天做过的事，找到明天可以更好的地方。",
      createdAt: new Date().toISOString()
    },
    {
      id: "sing",
      name: "练唱",
      icon: "🎤",
      color: "lilac",
      mode: "count",
      target: 15,
      step: 5,
      unit: "分钟",
      description: "留一点时间给喜欢的声音。",
      createdAt: new Date().toISOString()
    },
    {
      id: "run",
      name: "户外跑",
      icon: "🏃",
      color: "coral",
      mode: "count",
      target: 3,
      step: 1,
      unit: "公里",
      description: "跑多远不重要，出门就是开始。",
      createdAt: new Date().toISOString()
    },
    {
      id: "main-task",
      name: "今日正事",
      icon: "✅",
      color: "lime",
      mode: "boolean",
      target: 1,
      step: 1,
      unit: "次",
      description: "今天最重要的一件事，做完再划掉。",
      createdAt: new Date().toISOString()
    },
    {
      id: "screen-break",
      name: "放下手机",
      icon: "📵",
      color: "sky",
      mode: "boolean",
      target: 1,
      step: 1,
      unit: "次",
      description: "给眼睛和大脑留一点安静时间。",
      createdAt: new Date().toISOString()
    }
  ];
  const DESCRIPTIONS = {
    workout: "每一步都算数，今天也为自己动起来。",
    water: "身体需要一点水润，记得慢慢喝。",
    read: "给自己留一段安静阅读的时间。",
    sleep: "今晚早点放下手机，让身体休息。"
  };
  const QUOTES = [
    "慢一点没关系，只要方向是对的。",
    "真正改变你的，是那些看起来平常的坚持。",
    "今天的完成，不必完美，只要真实。",
    "不必追赶别人，把注意力放回自己身上。",
    "先完成，再完善。小步也值得被记录。",
    "身体会记得你善待它的每一次努力。",
    "新的一周，从一个微小但明确的动作开始。"
  ];
  const STUDY_TEMPLATES = {
    vocab: {
      name: "背单词",
      icon: "📖",
      color: "sky",
      mode: "count",
      target: 20,
      step: 5,
      unit: "个",
      description: "每天记一点，词汇量会替你记得。"
    },
    homework: {
      name: "完成作业",
      icon: "✍️",
      color: "coral",
      mode: "boolean",
      target: 1,
      step: 1,
      unit: "次",
      description: "先完成，再检查，不让任务越积越多。"
    },
    review: {
      name: "复习错题",
      icon: "🧠",
      color: "sand",
      mode: "count",
      target: 15,
      step: 5,
      unit: "分钟",
      description: "把不会的题再看一遍，分数会慢慢回来。"
    }
  };
  const SYSTEM_EMOJIS = {
    faces: [
      "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰",
      "😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥳","😏","😒",
      "😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡",
      "🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶",
      "😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴",
      "🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","🤡","💩","👻","💀","👽","👾",
      "🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾"
    ],
    hands: [
      "👍","👎","👌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️","✋","🤚","🖐️",
      "🖖","👋","🤝","🙏","💪","🫶","👏","🙌","👐","🤲","🤜","🤛","✊","👊","🫰","🫵"
    ],
    hearts: [
      "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖",
      "💘","💝","💟","✨","⭐","🌟","💫","🔥","💥","💯","🎉","🎊","👑","🏆","🌈","☀️"
    ],
    animals: [
      "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈",
      "🙉","🙊","🐔","🐧","🐦","🦄","🐝","🦋","🐬","🐳","🦈","🐊","🐢","🐙","🦀","🐾"
    ],
    life: [
      "📚","✍️","🎧","🎵","🎤","🎮","🏀","⚽","🏃","🚴","🏊","🧘","☕","🍵","🍎","🍜",
      "🍰","🎂","🎁","📷","💻","📱","🌙","🌞","🌧️","🌸","🍀","🎯","🧠","💡","🛌","🚀"
    ]
  };
  const CUSTOM_STICKERS_KEY = "xiaojii-custom-stickers-v1";
  const MOTION_WALLPAPERS = {
    flow: { days: 0, minutes: 0, name: "流光青焰" },
    bagua: { days: 7, minutes: 150, name: "太极星阵" },
    ignite: { days: 3, minutes: 90, name: "金光燃动" },
    dragon: { days: 30, minutes: 600, name: "金龙巡天" }
  };
  const AVATAR_EFFECTS = {
    none: { days: 0, minutes: 0, name: "默认头像" },
    green: { days: 0, minutes: 0, name: "青绿边框" },
    blue: { days: 3, minutes: 90, name: "雾蓝边框" },
    gold: { days: 30, minutes: 600, name: "鎏金边框" }
  };
  const IMAGE_TARGETS = {
    sticker: {
      aspect: 1,
      outputWidth: 256,
      outputHeight: 256,
      minWidth: 128,
      minHeight: 128,
      title: "制作自定义表情",
      field: "",
      frameWidth: 270
    },
    avatar: {
      aspect: 1,
      outputWidth: 512,
      outputHeight: 512,
      minWidth: 512,
      minHeight: 512,
      title: "调整头像",
      field: "avatarImage",
      frameWidth: 280
    },
    card: {
      aspect: 16 / 9,
      outputWidth: 1080,
      outputHeight: 608,
      minWidth: 720,
      minHeight: 405,
      title: "调整小名片封面",
      field: "cardImage",
      frameWidth: 330
    },
    hero: {
      aspect: 6 / 5,
      outputWidth: 1080,
      outputHeight: 900,
      minWidth: 720,
      minHeight: 600,
      title: "调整首页主背景板",
      field: "heroImage",
      frameWidth: 300
    },
    team: {
      aspect: 1080 / 680,
      outputWidth: 1080,
      outputHeight: 680,
      minWidth: 720,
      minHeight: 454,
      title: "调整同行板块名片",
      field: "teamImage",
      frameWidth: 330
    },
    stats: {
      aspect: 1080 / 640,
      outputWidth: 1080,
      outputHeight: 640,
      minWidth: 720,
      minHeight: 427,
      title: "调整记录板块名片",
      field: "statsImage",
      frameWidth: 330
    },
    wallpaper: {
      aspect: 9 / 20,
      outputWidth: 1080,
      outputHeight: 2400,
      minWidth: 720,
      minHeight: 1280,
      title: "调整应用壁纸",
      field: "wallpaperImage",
      frameWidth: 245
    }
  };
  const MOTION_ART = {
    flow: '<div class="flow-art"><i></i><i></i><i></i></div>',
    ignite: `
      <div class="ignite-art">
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="energy-core">
              <stop stop-color="#f6ffff"/>
              <stop offset=".24" stop-color="#75e3f5"/>
              <stop offset=".55" stop-color="#2697c1" stop-opacity=".7"/>
              <stop offset="1" stop-color="#174b65" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="energy-gold" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#fff7a8"/>
              <stop offset=".5" stop-color="#ffc541"/>
              <stop offset="1" stop-color="#e76a28"/>
            </linearGradient>
            <filter id="energy-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7"/>
            </filter>
          </defs>
          <g class="energy-swirl" fill="none">
            <path d="M-48 578C81 459 74 236 265 209c116-17 125 62 196-18" stroke="#ffca51" stroke-opacity=".22" stroke-width="48" filter="url(#energy-glow)"/>
            <path d="M-35 604C98 481 96 285 263 242c108-28 132 44 205-16" stroke="url(#energy-gold)" stroke-opacity=".7" stroke-width="12" stroke-linecap="round"/>
            <path d="M-15 626C124 498 123 317 265 274c89-27 123 26 180-15" stroke="#fff2af" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>
          </g>
          <g class="energy-orbit" fill="none" stroke="#ffdd75">
            <ellipse cx="277" cy="232" rx="112" ry="64" stroke-opacity=".35" transform="rotate(-18 277 232)"/>
            <ellipse cx="277" cy="232" rx="143" ry="87" stroke-opacity=".17" transform="rotate(21 277 232)" stroke-dasharray="4 10"/>
          </g>
          <g class="energy-core">
            <circle cx="277" cy="232" r="45" fill="url(#energy-core)"/>
            <circle cx="277" cy="232" r="20" fill="none" stroke="#d8ffff" stroke-opacity=".85" stroke-width="2"/>
          </g>
          <g class="energy-bolts" fill="none" stroke="url(#energy-gold)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="m237 50-30 77 41-12-55 89 61-43-22 61"/>
            <path d="m46 341 31 32-20 14 45 24M340 358l-27 21 18 18-39 33"/>
          </g>
          <g class="energy-embers" fill="#ffd563">
            <circle cx="116" cy="247" r="3"/>
            <circle cx="249" cy="385" r="2"/>
            <circle cx="327" cy="156" r="4"/>
            <circle cx="82" cy="461" r="2.2"/>
          </g>
        </svg>
      </div>`,
    bagua: `
      <div class="bagua-art">
        <svg viewBox="0 0 390 844" aria-hidden="true">
          <defs>
            <linearGradient id="bagua-jade" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#dced62" stop-opacity=".78"/>
              <stop offset="1" stop-color="#74bfc3" stop-opacity=".3"/>
            </linearGradient>
          </defs>
          <g class="bagua-outer" fill="none" stroke="url(#bagua-jade)" opacity=".72">
            <circle cx="195" cy="315" r="164" stroke-width="1.5" stroke-dasharray="3 9"/>
            <circle cx="195" cy="315" r="146" stroke-width="1"/>
            ${Array.from({ length: 8 }, (_, index) => `<g transform="rotate(${index * 45} 195 315)"><path d="M167 148h56M167 140h56M167 132h56" stroke-width="3"/></g>`).join("")}
          </g>
          <g class="bagua-inner">
            <circle cx="195" cy="315" r="105" fill="#e8efd9" fill-opacity=".13" stroke="#e1f17c" stroke-opacity=".46"/>
            <path d="M195 220a47.5 47.5 0 0 0 0 95 47.5 47.5 0 0 1 0 95 95 95 0 0 1 0-190Z" fill="#13281e" fill-opacity=".54"/>
            <circle cx="195" cy="267.5" r="10" fill="#dced62" fill-opacity=".72"/>
            <circle cx="195" cy="362.5" r="10" fill="#173026" fill-opacity=".9"/>
          </g>
          <g class="taiji-flow" fill="none" stroke="#cce97b" stroke-opacity=".38">
            <ellipse cx="195" cy="315" rx="220" ry="68" transform="rotate(-24 195 315)"/>
            <ellipse cx="195" cy="315" rx="250" ry="86" transform="rotate(36 195 315)"/>
          </g>
        </svg>
      </div>`,
    dragon: `
      <div class="dragon-art">
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="gold-dragon" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#fff1a8"/>
              <stop offset=".42" stop-color="#f5bd4c"/>
              <stop offset="1" stop-color="#a75b22"/>
            </linearGradient>
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8"/>
            </filter>
          </defs>
          <g class="dragon-aura" fill="none">
            <path d="M-42 610C86 489 79 286 240 229c106-37 151 18 216-54" stroke="#ffc457" stroke-opacity=".18" stroke-width="50" filter="url(#gold-glow)"/>
            <path d="M-10 651C111 514 89 348 223 287c118-54 148 5 238-57" stroke="url(#gold-dragon)" stroke-opacity=".72" stroke-width="17" stroke-linecap="round"/>
            <path class="dragon-body" d="M-10 651C111 514 89 348 223 287c118-54 148 5 238-57" stroke="#ffe397" stroke-opacity=".72" stroke-width="4" stroke-linecap="round"/>
            <path d="M26 618C131 509 129 365 238 311c86-42 124-11 182-53" stroke="#ffcf62" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>
            <path d="m376 173 35-30-5 47 37-4-34 31" stroke="#ffe49b" stroke-opacity=".8" stroke-width="5" stroke-linejoin="round"/>
            <path d="M356 205c22-15 34-2 45-12M359 220c22-3 32 12 43 6" stroke="#ffcf62" stroke-opacity=".42" stroke-width="3"/>
          </g>
          <g class="dragon-embers" fill="#ffd36f">
            <circle cx="84" cy="492" r="3" opacity=".7"/>
            <circle cx="265" cy="339" r="2.4" opacity=".55"/>
            <circle cx="342" cy="256" r="4" opacity=".7"/>
          </g>
        </svg>
      </div>`
  };

  const elements = {
    appWallpaper: document.querySelector("#appWallpaper"),
    wallpaperMotion: document.querySelector("#wallpaperMotion"),
    appMain: document.querySelector("#appMain"),
    dateLabel: document.querySelector("#dateLabel"),
    greeting: document.querySelector("#greeting"),
    avatarButton: document.querySelector("#avatarButton"),
    avatarText: document.querySelector("#avatarText"),
    heroKicker: document.querySelector("#heroKicker"),
    heroTitle: document.querySelector("#heroTitle"),
    heroSubtitle: document.querySelector("#heroSubtitle"),
    heroCard: document.querySelector("#heroCard"),
    orbitFill: document.querySelector("#orbitFill"),
    progressPercent: document.querySelector("#progressPercent"),
    progressCount: document.querySelector("#progressCount"),
    streakValue: document.querySelector("#streakValue"),
    pointsValue: document.querySelector("#pointsValue"),
    weekSummary: document.querySelector("#weekSummary"),
    weekStrip: document.querySelector("#weekStrip"),
    habitList: document.querySelector("#habitList"),
    addHabitButton: document.querySelector("#addHabitButton"),
    dailyQuote: document.querySelector("#dailyQuote"),
    intentionCard: document.querySelector("#intentionCard"),
    intentionText: document.querySelector("#intentionText"),
    intentionHint: document.querySelector("#intentionHint"),
    intentionCheckButton: document.querySelector("#intentionCheckButton"),
    editIntentionButton: document.querySelector("#editIntentionButton"),
    focusTitle: document.querySelector("#focusTitle"),
    focusSubtitle: document.querySelector("#focusSubtitle"),
    focusButton: document.querySelector("#focusButton"),
    focusResetButton: document.querySelector("#focusResetButton"),
    focusDial: document.querySelector("#focusDial"),
    focusTimer: document.querySelector("#focusTimer"),
    studyPresets: document.querySelector("#studyPresets"),
    monthlyCompleted: document.querySelector("#monthlyCompleted"),
    bestStreak: document.querySelector("#bestStreak"),
    monthlyRate: document.querySelector("#monthlyRate"),
    weekAverage: document.querySelector("#weekAverage"),
    barChart: document.querySelector("#barChart"),
    calendarTitle: document.querySelector("#calendarTitle"),
    calendarGrid: document.querySelector("#calendarGrid"),
    prevMonth: document.querySelector("#prevMonth"),
    nextMonth: document.querySelector("#nextMonth"),
    recentList: document.querySelector("#recentList"),
    statsMenuButton: document.querySelector("#statsMenuButton"),
    statsOverview: document.querySelector("#statsOverview"),
    teamPage: document.querySelector("#teamPage"),
    teamBanner: document.querySelector("#teamBanner"),
    teamWelcome: document.querySelector("#teamWelcome"),
    teamHeaderButton: document.querySelector("#teamHeaderButton"),
    teamEmptyState: document.querySelector("#teamEmptyState"),
    teamJoinedState: document.querySelector("#teamJoinedState"),
    createTeamButton: document.querySelector("#createTeamButton"),
    joinTeamButton: document.querySelector("#joinTeamButton"),
    teamName: document.querySelector("#teamName"),
    teamInviteCode: document.querySelector("#teamInviteCode"),
    copyTeamCodeButton: document.querySelector("#copyTeamCodeButton"),
    shareTeamButton: document.querySelector("#shareTeamButton"),
    teamTodayCount: document.querySelector("#teamTodayCount"),
    teamActiveCount: document.querySelector("#teamActiveCount"),
    teamWeekCount: document.querySelector("#teamWeekCount"),
    teamSyncState: document.querySelector("#teamSyncState"),
    teamSyncText: document.querySelector("#teamSyncText"),
    refreshTeamButton: document.querySelector("#refreshTeamButton"),
    teamPresenceBar: document.querySelector("#teamPresenceBar"),
    teamPresenceTitle: document.querySelector("#teamPresenceTitle"),
    teamPresenceButton: document.querySelector("#teamPresenceButton"),
    teamSparkKicker: document.querySelector("#teamSparkKicker"),
    teamSparkTitle: document.querySelector("#teamSparkTitle"),
    teamSparkDescription: document.querySelector("#teamSparkDescription"),
    teamSparkDays: document.querySelector("#teamSparkDays"),
    teamMemberCount: document.querySelector("#teamMemberCount"),
    teamRanking: document.querySelector("#teamRanking"),
    teamChatMessages: document.querySelector("#teamChatMessages"),
    teamChatForm: document.querySelector("#teamChatForm"),
    teamChatInput: document.querySelector("#teamChatInput"),
    teamChatSendButton: document.querySelector("#teamChatSendButton"),
    groupEmojiPanel: document.querySelector("#groupEmojiPanel"),
    groupEmojiTabs: document.querySelector("#groupEmojiTabs"),
    groupEmojiGrid: document.querySelector("#groupEmojiGrid"),
    groupEmojiButton: document.querySelector("#groupEmojiButton"),
    groupImageButton: document.querySelector("#groupImageButton"),
    groupImageFile: document.querySelector("#groupImageFile"),
    groupUploadStickerButton: document.querySelector("#groupUploadStickerButton"),
    chatQuickActions: document.querySelector("#chatQuickActions"),
    directChatSheet: document.querySelector("#directChatSheet"),
    directChatAvatar: document.querySelector("#directChatAvatar"),
    directChatTitle: document.querySelector("#directChatTitle"),
    directChatStatus: document.querySelector("#directChatStatus"),
    directChatMessages: document.querySelector("#directChatMessages"),
    directChatForm: document.querySelector("#directChatForm"),
    directChatInput: document.querySelector("#directChatInput"),
    directChatSendButton: document.querySelector("#directChatSendButton"),
    directPhotoButton: document.querySelector("#directPhotoButton"),
    directPhotoFile: document.querySelector("#directPhotoFile"),
    chatAttachmentSheet: document.querySelector("#chatAttachmentSheet"),
    chatTakePhotoButton: document.querySelector("#chatTakePhotoButton"),
    chatRecordVideoButton: document.querySelector("#chatRecordVideoButton"),
    chatChoosePhotoButton: document.querySelector("#chatChoosePhotoButton"),
    chatChooseVideoButton: document.querySelector("#chatChooseVideoButton"),
    chatCameraFile: document.querySelector("#chatCameraFile"),
    chatRecordVideoFile: document.querySelector("#chatRecordVideoFile"),
    chatGalleryPhotoFile: document.querySelector("#chatGalleryPhotoFile"),
    chatGalleryVideoFile: document.querySelector("#chatGalleryVideoFile"),
    directEmojiPanel: document.querySelector("#directEmojiPanel"),
    emojiTabs: document.querySelector("#emojiTabs"),
    emojiGrid: document.querySelector("#emojiGrid"),
    emojiButton: document.querySelector("#emojiButton"),
    stickerButton: document.querySelector("#stickerButton"),
    uploadStickerButton: document.querySelector("#uploadStickerButton"),
    customStickerFile: document.querySelector("#customStickerFile"),
    chatEditState: document.querySelector("#chatEditState"),
    cancelDirectEditButton: document.querySelector("#cancelDirectEditButton"),
    memberCardSheet: document.querySelector("#memberCardSheet"),
    memberCardAvatar: document.querySelector("#memberCardAvatar"),
    memberCardName: document.querySelector("#memberCardName"),
    memberCardStatus: document.querySelector("#memberCardStatus"),
    memberCardSignature: document.querySelector("#memberCardSignature"),
    memberCardToday: document.querySelector("#memberCardToday"),
    memberCardWeek: document.querySelector("#memberCardWeek"),
    memberCardPresence: document.querySelector("#memberCardPresence"),
    memberCardHistory: document.querySelector("#memberCardHistory"),
    memberCardChatButton: document.querySelector("#memberCardChatButton"),
    teamAvatarStack: document.querySelector("#teamAvatarStack"),
    teamFeed: document.querySelector("#teamFeed"),
    leaveTeamButton: document.querySelector("#leaveTeamButton"),
    teamFormSheet: document.querySelector("#teamFormSheet"),
    teamFormMode: document.querySelector("#teamFormMode"),
    teamFormKicker: document.querySelector("#teamFormKicker"),
    teamFormTitle: document.querySelector("#teamFormTitle"),
    teamFormDescription: document.querySelector("#teamFormDescription"),
    teamForm: document.querySelector("#teamForm"),
    teamNameField: document.querySelector("#teamNameField"),
    teamNameInput: document.querySelector("#teamNameInput"),
    teamCodeField: document.querySelector("#teamCodeField"),
    teamCodeInput: document.querySelector("#teamCodeInput"),
    teamMemberNameInput: document.querySelector("#teamMemberNameInput"),
    teamFormHint: document.querySelector("#teamFormHint"),
    teamFormSubmit: document.querySelector("#teamFormSubmit"),
    profileName: document.querySelector("#profileName"),
    profileCard: document.querySelector(".profile-card"),
    profileCardVideo: document.querySelector("#profileCardVideo"),
    profileVideoSoundButton: document.querySelector("#profileVideoSoundButton"),
    profileAvatar: document.querySelector("#profileAvatar"),
    profileAvatarText: document.querySelector("#profileAvatarText"),
    profileStatus: document.querySelector("#profileStatus"),
    profileMotto: document.querySelector("#profileMotto"),
    profileJoinDate: document.querySelector("#profileJoinDate"),
    profileMetrics: document.querySelector("#profileMetrics"),
    manageHabitList: document.querySelector("#manageHabitList"),
    manageHabitsButton: document.querySelector("#manageHabitsButton"),
    profileAddHabit: document.querySelector("#profileAddHabit"),
    profileSettingsButton: document.querySelector("#profileSettingsButton"),
    customizeButton: document.querySelector("#customizeButton"),
    customizeBadge: document.querySelector("#customizeBadge"),
    growthSummaryText: document.querySelector("#growthSummaryText"),
    motionWallpapers: document.querySelector("#motionWallpapers"),
    installAppButton: document.querySelector("#installAppButton"),
    installBadge: document.querySelector("#installBadge"),
    exportButton: document.querySelector("#exportButton"),
    importButton: document.querySelector("#importButton"),
    importFile: document.querySelector("#importFile"),
    hapticToggle: document.querySelector("#hapticToggle"),
    clearButton: document.querySelector("#clearButton"),
    toastRegion: document.querySelector("#toastRegion"),
    confettiLayer: document.querySelector("#confettiLayer"),
    sheetBackdrop: document.querySelector("#sheetBackdrop"),
    habitDetailSheet: document.querySelector("#habitDetailSheet"),
    detailIcon: document.querySelector("#detailIcon"),
    detailTitle: document.querySelector("#detailTitle"),
    detailDescription: document.querySelector("#detailDescription"),
    detailCurrent: document.querySelector("#detailCurrent"),
    detailUnit: document.querySelector("#detailUnit"),
    detailTarget: document.querySelector("#detailTarget"),
    detailTrackFill: document.querySelector("#detailTrackFill"),
    detailNote: document.querySelector("#detailNote"),
    detailMinus: document.querySelector("#detailMinus"),
    detailPlus: document.querySelector("#detailPlus"),
    detailStep: document.querySelector("#detailStep"),
    detailCheckButton: document.querySelector("#detailCheckButton"),
    detailResetButton: document.querySelector("#detailResetButton"),
    habitFormSheet: document.querySelector("#habitFormSheet"),
    formTitle: document.querySelector("#formTitle"),
    habitForm: document.querySelector("#habitForm"),
    editingHabitId: document.querySelector("#editingHabitId"),
    habitName: document.querySelector("#habitName"),
    habitTarget: document.querySelector("#habitTarget"),
    habitStep: document.querySelector("#habitStep"),
    habitUnit: document.querySelector("#habitUnit"),
    countFields: document.querySelector("#countFields"),
    iconPicker: document.querySelector("#iconPicker"),
    colorPicker: document.querySelector("#colorPicker"),
    profileFormSheet: document.querySelector("#profileFormSheet"),
    profileForm: document.querySelector("#profileForm"),
    profileNameInput: document.querySelector("#profileNameInput"),
    profileStatusInput: document.querySelector("#profileStatusInput"),
    statusSuggestions: document.querySelector("#statusSuggestions"),
    profileMottoInput: document.querySelector("#profileMottoInput"),
    intentionFormSheet: document.querySelector("#intentionFormSheet"),
    intentionForm: document.querySelector("#intentionForm"),
    intentionInput: document.querySelector("#intentionInput"),
    intentionSuggestions: document.querySelector(".intention-suggestions"),
    customizeSheet: document.querySelector("#customizeSheet"),
    wallpaperPresets: document.querySelector("#wallpaperPresets"),
    uploadWallpaperButton: document.querySelector("#uploadWallpaperButton"),
    wallpaperFile: document.querySelector("#wallpaperFile"),
    uploadHeroImageButton: document.querySelector("#uploadHeroImageButton"),
    heroImageFile: document.querySelector("#heroImageFile"),
    clearHeroImageButton: document.querySelector("#clearHeroImageButton"),
    heroCoverUnlockNote: document.querySelector("#heroCoverUnlockNote"),
    uploadTeamImageButton: document.querySelector("#uploadTeamImageButton"),
    clearTeamImageButton: document.querySelector("#clearTeamImageButton"),
    teamImageFile: document.querySelector("#teamImageFile"),
    uploadStatsImageButton: document.querySelector("#uploadStatsImageButton"),
    clearStatsImageButton: document.querySelector("#clearStatsImageButton"),
    statsImageFile: document.querySelector("#statsImageFile"),
    todayCoverPreview: document.querySelector("#todayCoverPreview"),
    teamCoverPreview: document.querySelector("#teamCoverPreview"),
    statsCoverPreview: document.querySelector("#statsCoverPreview"),
    profileCoverPreview: document.querySelector("#profileCoverPreview"),
    namecardPreview: document.querySelector("#namecardPreview"),
    namecardPhoto: document.querySelector("#namecardPhoto"),
    namecardInitial: document.querySelector("#namecardInitial"),
    namecardName: document.querySelector("#namecardName"),
    namecardStatus: document.querySelector("#namecardStatus"),
    uploadProfileImageButton: document.querySelector("#uploadProfileImageButton"),
    clearProfileImageButton: document.querySelector("#clearProfileImageButton"),
    profileImageFile: document.querySelector("#profileImageFile"),
    uploadCardImageButton: document.querySelector("#uploadCardImageButton"),
    clearCardImageButton: document.querySelector("#clearCardImageButton"),
    cardImageFile: document.querySelector("#cardImageFile"),
    uploadProfileVideoButton: document.querySelector("#uploadProfileVideoButton"),
    clearProfileVideoButton: document.querySelector("#clearProfileVideoButton"),
    profileVideoFile: document.querySelector("#profileVideoFile"),
    rewardCoverPreview: document.querySelector("#rewardCoverPreview"),
    rewardCoverState: document.querySelector("#rewardCoverState"),
    rewardProgressText: document.querySelector("#rewardProgressText"),
    rewardUnlockState: document.querySelector("#rewardUnlockState"),
    rewardRequirementSelect: document.querySelector("#rewardRequirementSelect"),
    uploadRewardCoverButton: document.querySelector("#uploadRewardCoverButton"),
    applyRewardCoverButton: document.querySelector("#applyRewardCoverButton"),
    clearRewardCoverButton: document.querySelector("#clearRewardCoverButton"),
    rewardCardImageFile: document.querySelector("#rewardCardImageFile"),
    imageEditorSheet: document.querySelector("#imageEditorSheet"),
    imageEditorTitle: document.querySelector("#imageEditorTitle"),
    imageEditorDescription: document.querySelector("#imageEditorDescription"),
    imageEditorFrame: document.querySelector("#imageEditorFrame"),
    imageEditorCanvas: document.querySelector("#imageEditorCanvas"),
    imageZoomRange: document.querySelector("#imageZoomRange"),
    imageZoomLabel: document.querySelector("#imageZoomLabel"),
    imageOutputSize: document.querySelector("#imageOutputSize"),
    resetImageEditorButton: document.querySelector("#resetImageEditorButton"),
    saveImageEditorButton: document.querySelector("#saveImageEditorButton"),
    stickerTextControls: document.querySelector("#stickerTextControls"),
    stickerTextInput: document.querySelector("#stickerTextInput"),
    stickerTextSize: document.querySelector("#stickerTextSize"),
    stickerTextColors: document.querySelector("#stickerTextColors"),
    avatarSheet: document.querySelector("#avatarSheet"),
    avatarPreviewLarge: document.querySelector("#avatarPreviewLarge"),
    avatarPreviewInitial: document.querySelector("#avatarPreviewInitial"),
    selectAvatarButton: document.querySelector("#selectAvatarButton"),
    defaultAvatarButton: document.querySelector("#defaultAvatarButton"),
    openNamecardButton: document.querySelector("#openNamecardButton"),
    avatarFile: document.querySelector("#avatarFile"),
    avatarEffectOptions: document.querySelector("#avatarEffectOptions"),
    confirmSheet: document.querySelector("#confirmSheet"),
    confirmIcon: document.querySelector("#confirmIcon"),
    confirmTitle: document.querySelector("#confirmTitle"),
    confirmDescription: document.querySelector("#confirmDescription"),
    confirmCancel: document.querySelector("#confirmCancel"),
    confirmAction: document.querySelector("#confirmAction"),
    installSheet: document.querySelector("#installSheet"),
    installDescription: document.querySelector("#installDescription"),
    nativeInstallButton: document.querySelector("#nativeInstallButton"),
    dayDetailSheet: document.querySelector("#dayDetailSheet"),
    dayDetailKicker: document.querySelector("#dayDetailKicker"),
    dayDetailTitle: document.querySelector("#dayDetailTitle"),
    dayDetailSummary: document.querySelector("#dayDetailSummary"),
    dayDetailList: document.querySelector("#dayDetailList")
  };

  let state = loadState();
  let activePage = "today";
  let activeHabitId = null;
  let currentMonth = startOfMonth(new Date());
  let selectedCalendarDate = dateKey(new Date());
  let confirmHandler = null;
  let deferredInstallPrompt = null;
  let lastKnownDay = dateKey(new Date());
  let teamSyncStatus = state.team?.pendingSync ? "offline" : "idle";
  let teamLoading = false;
  let teamReloadRequested = false;
  let autoJoinCode = new URLSearchParams(window.location.search).get("team")?.toUpperCase().slice(0, 6) || "";
  let focusTicker = null;
  let directChatTargetId = null;
  let activeMemberCardId = null;
  let currentEmojiTab = "faces";
  let currentGroupEmojiTab = "faces";
  let editingDirectMessageId = null;
  let customStickers = [];
  let directMessagesCache = [];
  let stickerUploadContext = "direct";
  let chatMediaContext = "direct";
  let imageEditorState = null;
  let profileVideoURL = "";
  const previewUnlocked = false;

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addDays(date, amount) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
  }

  function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function startOfWeek(date) {
    const copy = new Date(date);
    const day = copy.getDay() || 7;
    copy.setDate(copy.getDate() - day + 1);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function isSameDay(first, second) {
    return dateKey(first) === dateKey(second);
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(Number(value) || min, min), max);
  }

  function createId() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function defaultState() {
    return {
      version: 1,
      profile: {
        name: "打卡人",
        status: "专注中",
        motto: "把普通的日子，过成自己的作品。",
        joined: dateKey(new Date())
      },
      habits: DEFAULT_HABITS.map((habit) => ({ ...habit })),
      records: {},
      notes: {},
      intentions: {},
      meta: { starterPackVersion: 2 },
      team: null,
      teamSnapshot: null,
      appearance: {
        wallpaper: "paper",
        wallpaperImage: "",
        heroImage: "",
        teamImage: "",
        statsImage: "",
        avatarImage: "",
        cardImage: "",
        rewardCardImage: "",
        rewardDays: 3,
        rewardMinutes: 90,
        profileVideo: false,
        avatarEffect: "none"
      },
      focus: {
        duration: 25 * 60,
        remaining: 25 * 60,
        running: false,
        endsAt: 0
      },
      preferences: {
        haptics: true
      }
    };
  }

  function normalizeState(raw) {
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.habits) || !raw.records) {
      throw new Error("备份文件格式不正确");
    }

    let habits = raw.habits
      .filter((habit) => habit && habit.id && habit.name)
      .map((habit) => {
        const mode = habit.mode === "boolean" ? "boolean" : "count";
        const color = COLOR_STYLES[habit.color] ? habit.color : "lime";
        return {
          id: String(habit.id),
          name: String(habit.name).slice(0, 10),
          icon: String(habit.icon || "✨").slice(0, 8),
          color,
          mode,
          target: mode === "boolean" ? 1 : clamp(habit.target, 1, 999),
          step: mode === "boolean" ? 1 : clamp(habit.step, 1, 999),
          unit: mode === "boolean" ? "次" : String(habit.unit || "次").slice(0, 4),
          description: String(habit.description || "今天也为自己完成一件小事。").slice(0, 80),
          createdAt: habit.createdAt || new Date().toISOString()
        };
      });

    const starterPackVersion = Number(raw.meta?.starterPackVersion) || 1;
    if (starterPackVersion < 2) {
      DEFAULT_HABITS.filter((habit) => ["vocab", "review", "sing", "run", "main-task", "screen-break"].includes(habit.id)).forEach(
        (starter) => {
          if (!habits.some((habit) => habit.id === starter.id || habit.name === starter.name)) {
            habits.push({ ...starter, createdAt: new Date().toISOString() });
          }
        }
      );
    }

    const records = {};
    Object.entries(raw.records).forEach(([key, dayRecord]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !dayRecord || typeof dayRecord !== "object") return;
      const cleanRecord = {};
      Object.entries(dayRecord).forEach(([habitId, value]) => {
        const numericValue = Number(value);
        if (Number.isFinite(numericValue) && numericValue > 0) {
          cleanRecord[habitId] = Math.min(numericValue, 9999);
        }
      });
      if (Object.keys(cleanRecord).length) records[key] = cleanRecord;
    });

    const notes = {};
    if (raw.notes && typeof raw.notes === "object") {
      Object.entries(raw.notes).forEach(([key, dayNotes]) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !dayNotes || typeof dayNotes !== "object") return;
        const cleanNotes = {};
        Object.entries(dayNotes).forEach(([habitId, note]) => {
          const trimmed = String(note || "").trim().slice(0, 60);
          if (trimmed) cleanNotes[habitId] = trimmed;
        });
        if (Object.keys(cleanNotes).length) notes[key] = cleanNotes;
      });
    }

    const intentions = {};
    if (raw.intentions && typeof raw.intentions === "object") {
      Object.entries(raw.intentions).forEach(([key, value]) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !value || typeof value !== "object") return;
        const text = String(value.text || "").trim().slice(0, 40);
        if (text) intentions[key] = { text, done: Boolean(value.done) };
      });
    }

    const team =
      raw.team &&
      typeof raw.team === "object" &&
      raw.team.id &&
      raw.team.code &&
      raw.team.memberId &&
      raw.team.memberToken
        ? {
            id: String(raw.team.id),
            code: String(raw.team.code).toUpperCase().slice(0, 6),
            name: String(raw.team.name || "打卡小组").slice(0, 24),
            memberId: String(raw.team.memberId),
            memberToken: String(raw.team.memberToken),
            joinedAt: raw.team.joinedAt || new Date().toISOString(),
            pendingSync: Boolean(raw.team.pendingSync),
            showPresence: raw.team.showPresence !== false,
            pendingCheckins: Array.isArray(raw.team.pendingCheckins)
              ? raw.team.pendingCheckins
                  .filter(
                    (item) =>
                      item &&
                      item.habitId &&
                      /^\d{4}-\d{2}-\d{2}$/.test(String(item.date || "")) &&
                      Number.isFinite(Number(item.value))
                  )
                  .slice(-100)
              : []
          }
        : null;

    const teamSnapshot =
      team && raw.teamSnapshot && typeof raw.teamSnapshot === "object"
        ? raw.teamSnapshot
        : null;

    const wallpaperOptions = new Set([
      "paper",
      "sunrise",
      "lime",
      "coast",
      "dusk",
      "flow",
      "bagua",
      "ignite"
    ]);
    const validImage = (value) =>
      typeof value === "string" &&
      /^data:image\/(?:jpeg|png|webp);base64,/i.test(value) &&
      value.length < 3_500_000;
    const legacyProfileImage = validImage(raw.appearance?.profileImage) ? raw.appearance.profileImage : "";
    const avatarEffectAliases = { glow: "green", taiji: "blue", ignite: "blue", dragon: "gold" };
    const savedAvatarEffect = raw.appearance?.avatarEffect;
    const normalizedAvatarEffect =
      avatarEffectAliases[savedAvatarEffect] || savedAvatarEffect;
    const appearance = {
      wallpaper: wallpaperOptions.has(raw.appearance?.wallpaper) ? raw.appearance.wallpaper : "paper",
      wallpaperImage: validImage(raw.appearance?.wallpaperImage) ? raw.appearance.wallpaperImage : "",
      heroImage: validImage(raw.appearance?.heroImage) ? raw.appearance.heroImage : "",
      teamImage: validImage(raw.appearance?.teamImage) ? raw.appearance.teamImage : "",
      statsImage: validImage(raw.appearance?.statsImage) ? raw.appearance.statsImage : "",
      avatarImage: validImage(raw.appearance?.avatarImage)
        ? raw.appearance.avatarImage
        : legacyProfileImage,
      cardImage: validImage(raw.appearance?.cardImage) ? raw.appearance.cardImage : "",
      rewardCardImage: validImage(raw.appearance?.rewardCardImage) ? raw.appearance.rewardCardImage : "",
      rewardDays: clamp(raw.appearance?.rewardDays || 3, 1, 365),
      rewardMinutes: clamp(raw.appearance?.rewardMinutes || 90, 1, 10000),
      profileVideo: Boolean(raw.appearance?.profileVideo),
      avatarEffect: AVATAR_EFFECTS[normalizedAvatarEffect] ? normalizedAvatarEffect : "none"
    };
    const focusDuration = clamp(raw.focus?.duration || 25 * 60, 60, 3600);
    const focusRemaining = Math.min(
      clamp(raw.focus?.remaining ?? focusDuration, 0, focusDuration),
      focusDuration
    );
    const focusEndsAt = Number(raw.focus?.endsAt) || 0;
    const focus = {
      duration: focusDuration,
      remaining: focusRemaining,
      running: Boolean(raw.focus?.running && focusEndsAt),
      endsAt: focusEndsAt
    };

    return {
      version: 1,
      profile: {
        name: String(raw.profile?.name || "打卡人").slice(0, 12),
        status: String(raw.profile?.status || raw.profile?.school || "专注中").slice(0, 24),
        motto: String(raw.profile?.motto || "把普通的日子，过成自己的作品。").slice(0, 36),
        joined: /^\d{4}-\d{2}-\d{2}$/.test(raw.profile?.joined || "")
          ? raw.profile.joined
          : dateKey(new Date())
      },
      habits,
      records,
      notes,
      intentions,
      meta: { starterPackVersion: 2 },
      team,
      teamSnapshot,
      appearance,
      focus,
      preferences: {
        haptics: raw.preferences?.haptics !== false
      }
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? normalizeState(JSON.parse(stored)) : defaultState();
    } catch (error) {
      console.warn("无法读取本地数据，已使用初始设置。", error);
      return defaultState();
    }
  }

  function saveState({ quiet = false } = {}) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (!quiet) updatePersistentMeta();
    } catch (error) {
      console.error("保存失败", error);
      toast("保存失败，请检查浏览器存储权限");
    }
  }

  function updatePersistentMeta() {}

  async function apiRequest(path, options = {}) {
    if (window.location.protocol === "file:") {
      throw new Error("共享打卡需要通过服务器打开应用");
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "网络请求失败");
      return data;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("连接超时，请稍后再试");
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function teamRequestPath() {
    if (!state.team) return "";
    const now = new Date();
    const weekStart = startOfWeek(now);
    const params = new URLSearchParams({
      today: dateKey(now),
      weekFrom: dateKey(weekStart),
      weekTo: dateKey(addDays(weekStart, 6))
    });
    return `./api/teams/${encodeURIComponent(state.team.id)}?${params}`;
  }

  async function loadTeamData({ quiet = false } = {}) {
    if (!state.team) return;
    if (teamLoading) {
      teamReloadRequested = true;
      return;
    }
    teamLoading = true;
    if (!quiet) {
      teamSyncStatus = "syncing";
      renderTeamSyncState();
    }
    try {
      const snapshot = await apiRequest(teamRequestPath());
      state.teamSnapshot = snapshot;
      state.team.name = snapshot.team.name;
      state.team.code = snapshot.team.code;
      state.team.pendingSync = false;
      teamSyncStatus = "synced";
      saveState({ quiet: true });
      renderTeam();
    } catch (error) {
      teamSyncStatus = "offline";
      state.team.pendingSync = true;
      saveState({ quiet: true });
      renderTeam();
      if (!quiet) toast(error.message || "暂时无法同步小组进度");
    } finally {
      teamLoading = false;
      if (teamReloadRequested) {
        teamReloadRequested = false;
        loadTeamData({ quiet: true });
      }
    }
  }

  function makeTeamCheckinPayload(habit, value, key = dateKey(new Date())) {
    return {
      habitId: habit.id,
      date: key,
      value,
      target: habit.target,
      unit: habit.unit,
      habitName: habit.name,
      icon: habit.icon,
      note: getNote(key, habit.id)
    };
  }

  function queuePendingTeamRecord(payload) {
    if (!state.team) return;
    state.team.pendingCheckins ||= [];
    const index = state.team.pendingCheckins.findIndex(
      (item) => item.habitId === payload.habitId && item.date === payload.date
    );
    if (index >= 0) state.team.pendingCheckins[index] = payload;
    else state.team.pendingCheckins.push(payload);
    state.team.pendingCheckins = state.team.pendingCheckins.slice(-100);
  }

  async function sendTeamCheckin(payload) {
    return apiRequest(
      `./api/teams/${encodeURIComponent(state.team.id)}/checkins/${encodeURIComponent(payload.habitId)}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${state.team.memberToken}` },
        body: JSON.stringify({
          date: payload.date,
          value: payload.value,
          target: payload.target,
          unit: payload.unit,
          habitName: payload.habitName,
          icon: payload.icon,
          note: payload.note
        })
      }
    );
  }

  async function syncTeamRecord(habit, value) {
    if (!state.team || !habit) return;
    const payload = makeTeamCheckinPayload(habit, value);
    teamSyncStatus = "syncing";
    renderTeamSyncState();
    try {
      await sendTeamCheckin(payload);
      state.team.pendingCheckins = (state.team.pendingCheckins || []).filter(
        (item) => item.habitId !== payload.habitId || item.date !== payload.date
      );
      state.team.pendingSync = false;
      teamSyncStatus = "synced";
      saveState({ quiet: true });
      renderTeamSyncState();
      if (activePage === "team") loadTeamData({ quiet: true });
    } catch {
      teamSyncStatus = "offline";
      state.team.pendingSync = true;
      queuePendingTeamRecord(payload);
      saveState({ quiet: true });
      renderTeamSyncState();
    }
  }

  async function syncTodayToTeam() {
    if (!state.team) return;
    teamSyncStatus = "syncing";
    renderTeamSyncState();
    try {
      const recordsByKey = new Map(
        (state.team.pendingCheckins || []).map((payload) => [`${payload.date}:${payload.habitId}`, payload])
      );
      const today = dateKey(new Date());
      state.habits.forEach((habit) => {
        const payload = makeTeamCheckinPayload(habit, getValue(today, habit.id), today);
        recordsByKey.set(`${payload.date}:${payload.habitId}`, payload);
      });
      await Promise.all(
        [...recordsByKey.values()].slice(-100).map((payload) => sendTeamCheckin(payload))
      );
      state.team.pendingCheckins = [];
      state.team.pendingSync = false;
      teamSyncStatus = "synced";
      saveState({ quiet: true });
      await loadTeamData({ quiet: true });
    } catch {
      teamSyncStatus = "offline";
      state.team.pendingSync = true;
      saveState({ quiet: true });
      renderTeamSyncState();
    }
  }

  async function updateTeamPresence(visible, { keepalive = false } = {}) {
    if (!state.team) return;
    if (!state.team.showPresence) visible = false;
    try {
      await fetch(`./api/teams/${encodeURIComponent(state.team.id)}/presence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.team.memberToken}`
        },
        body: JSON.stringify({
          visible,
          status: state.profile.status,
          signature: state.profile.motto
        }),
        keepalive
      });
    } catch {
      // 在线状态是辅助信息，失败时不影响个人打卡和小组同步。
    }
  }

  async function sendTeamMessage(text) {
    if (!state.team) return;
    const message = String(text || "").trim().slice(0, 160);
    if (!message) {
      elements.teamChatInput.focus();
      return;
    }
    elements.teamChatSendButton.disabled = true;
    try {
      await apiRequest(`./api/teams/${encodeURIComponent(state.team.id)}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${state.team.memberToken}` },
        body: JSON.stringify({ text: message })
      });
      elements.teamChatInput.value = "";
      vibrate(8);
      await loadTeamData({ quiet: true });
      elements.teamChatMessages.scrollTop = elements.teamChatMessages.scrollHeight;
    } catch (error) {
      toast(error.message || "消息发送失败");
    } finally {
      elements.teamChatSendButton.disabled = false;
      elements.teamChatInput.focus();
    }
  }

  function directChatMember(memberId) {
    return state.teamSnapshot?.members?.find((member) => member.id === memberId) || null;
  }

  function renderDirectChatMessages(messages) {
    const nearBottom =
      elements.directChatMessages.scrollHeight -
        elements.directChatMessages.scrollTop -
        elements.directChatMessages.clientHeight <
      45;
    elements.directChatMessages.innerHTML = messages.length
      ? messages
          .map((message) => {
            const mine = message.memberId === state.team?.memberId;
            const time = new Date(message.createdAt).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit"
            });
            return `
              <div class="chat-message ${mine ? "is-mine" : ""}" data-message-id="${escapeHTML(message.id)}">
                <span class="chat-avatar" style="--avatar-bg:${mine ? "#dcde62" : "#f3b493"}">${escapeHTML(message.memberName.trim().slice(0, 1) || "同")}</span>
                <div class="chat-bubble-wrap">
                  <div class="chat-message-meta">${mine ? "我" : escapeHTML(message.memberName)} · ${escapeHTML(time)}${mine && message.type === "chat" ? `<button class="chat-edit-button" type="button" data-edit-message="${escapeHTML(message.id)}">编辑</button>` : ""}</div>
                  <div class="chat-bubble ${message.attachment || message.mediaUrl ? "is-sticker" : ""}">${
                    message.mediaUrl
                      ? `<video class="chat-video" src="${message.mediaUrl}" controls playsinline preload="metadata"></video>`
                      : message.attachment
                        ? `<img class="${message.type === "image" ? "chat-photo-image" : "chat-sticker-image"}" src="${message.attachment}" alt="${message.type === "image" ? "聊天图片" : "自定义表情"}" />`
                        : escapeHTML(message.text)
                  }</div>
                </div>
              </div>
            `;
          })
          .join("")
      : `<div class="chat-empty">还没有和 ${escapeHTML(elements.directChatTitle.textContent)} 私聊过。<br>发一句悄悄话吧。</div>`;
    if (nearBottom) elements.directChatMessages.scrollTop = elements.directChatMessages.scrollHeight;
  }

  async function refreshDirectChat() {
    if (!state.team || !directChatTargetId) return;
    try {
      const result = await apiRequest(
        `./api/teams/${encodeURIComponent(state.team.id)}/direct/${encodeURIComponent(directChatTargetId)}`,
        { headers: { Authorization: `Bearer ${state.team.memberToken}` } }
      );
      elements.directChatTitle.textContent = result.member.name;
      elements.directChatAvatar.textContent = result.member.name.trim().slice(0, 1) || "同";
      elements.directChatStatus.textContent = result.member.online ? "当前在线 · 只属于你们两人的小窗" : "不打扰对方，留言也会看到";
      directMessagesCache = result.messages || [];
      renderDirectChatMessages(result.messages || []);
    } catch (error) {
      elements.directChatStatus.textContent = error.message || "暂时无法加载私聊";
    }
  }

  function openDirectChat(memberId) {
    if (!state.team) return;
    if (memberId === state.team.memberId) {
      toast("这是你自己的名牌，点击其他同事可以私聊");
      return;
    }
    const member = directChatMember(memberId);
    if (!member) {
      toast("这位同事已经不在小组里了");
      return;
    }
    directChatTargetId = memberId;
    elements.directChatTitle.textContent = member.name;
    elements.directChatAvatar.textContent = member.name.trim().slice(0, 1) || "同";
    elements.directChatStatus.textContent = member.online ? "当前在线 · 只属于你们两人的小窗" : "不打扰对方，留言也会看到";
    elements.directChatMessages.innerHTML = '<div class="chat-empty">正在打开你们的小窗…</div>';
    elements.directEmojiPanel.hidden = true;
    elements.groupEmojiPanel.hidden = true;
    editingDirectMessageId = null;
    elements.chatEditState.hidden = true;
    elements.directChatInput.value = "";
    currentEmojiTab = "faces";
    renderEmojiPicker();
    openSheet(elements.directChatSheet);
    void refreshDirectChat();
  }

  async function openMemberCard(memberId) {
    const member = directChatMember(memberId);
    if (!member || !state.team) {
      toast("这位同事已经不在小组里了");
      return;
    }
    activeMemberCardId = memberId;
    elements.memberCardAvatar.textContent = member.name.trim().slice(0, 1) || "同";
    elements.memberCardName.textContent = member.name;
    elements.memberCardStatus.textContent = member.status
      ? `当前状态：${member.status}`
      : "这位同事今天还没有更新状态";
    elements.memberCardSignature.textContent = member.signature
      ? `“${member.signature}”`
      : "还没有填写个人签名";
    elements.memberCardToday.textContent = String(member.todayCount || 0);
    elements.memberCardWeek.textContent = String(member.weekPoints || 0);
    elements.memberCardPresence.textContent = member.online ? "在线" : "离线";
    elements.memberCardChatButton.textContent =
      memberId === state.team?.memberId ? "这是我自己" : "发私信";
    elements.memberCardHistory.innerHTML = '<div class="member-card-history-empty">正在读取打卡记录…</div>';
    openSheet(elements.memberCardSheet);
    try {
      const weekStart = startOfWeek(new Date());
      const query = new URLSearchParams({
        today: dateKey(new Date()),
        weekFrom: dateKey(weekStart),
        weekTo: dateKey(addDays(weekStart, 6))
      });
      const result = await apiRequest(
        `./api/teams/${encodeURIComponent(state.team.id)}/members/${encodeURIComponent(memberId)}?${query}`
      );
      elements.memberCardStatus.textContent = result.member.status
        ? `当前状态：${result.member.status}`
        : "这位同事今天还没有更新状态";
      elements.memberCardSignature.textContent = result.member.signature
        ? `“${result.member.signature}”`
        : "还没有填写个人签名";
      elements.memberCardToday.textContent = String(result.member.todayCount || 0);
      elements.memberCardWeek.textContent = String(result.member.weekPoints || 0);
      elements.memberCardPresence.textContent = result.member.online ? "在线" : "离线";
      elements.memberCardHistory.innerHTML = result.history?.length
        ? result.history
            .slice(0, 5)
            .map((entry) => {
              const date = parseDateKey(entry.date);
              return `
                <div class="member-card-history-item">
                  <strong>${escapeHTML(entry.icon)} ${escapeHTML(entry.habitName)}${entry.note ? ` · ${escapeHTML(entry.note)}` : ""}</strong>
                  <span>${date.getMonth() + 1}月${date.getDate()}日</span>
                </div>
              `;
            })
            .join("")
        : '<div class="member-card-history-empty">还没有团队打卡记录</div>';
    } catch {
      elements.memberCardHistory.innerHTML =
        '<div class="member-card-history-empty">暂时无法读取历史记录</div>';
    }
  }

  async function sendDirectChat(text) {
    if (!state.team || !directChatTargetId) return;
    const message = String(text || "").trim().slice(0, 160);
    if (!message) return;
    elements.directChatSendButton.disabled = true;
    try {
      if (editingDirectMessageId) {
        await apiRequest(
          `./api/teams/${encodeURIComponent(state.team.id)}/messages/${encodeURIComponent(editingDirectMessageId)}`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${state.team.memberToken}` },
            body: JSON.stringify({ text: message })
          }
        );
        editingDirectMessageId = null;
        elements.chatEditState.hidden = true;
      } else {
        await apiRequest(`./api/teams/${encodeURIComponent(state.team.id)}/messages`, {
          method: "POST",
          headers: { Authorization: `Bearer ${state.team.memberToken}` },
          body: JSON.stringify({ text: message, recipientId: directChatTargetId })
        });
      }
      elements.directChatInput.value = "";
      vibrate(8);
      await refreshDirectChat();
      elements.directChatMessages.scrollTop = elements.directChatMessages.scrollHeight;
    } catch (error) {
      toast(error.message || "消息发送失败");
    } finally {
      elements.directChatSendButton.disabled = false;
      elements.directChatInput.focus();
    }
  }

  function cancelDirectEditing() {
    editingDirectMessageId = null;
    elements.chatEditState.hidden = true;
    elements.directChatInput.value = "";
  }

  function loadCustomStickers() {
    try {
      const stored = JSON.parse(localStorage.getItem(CUSTOM_STICKERS_KEY) || "[]");
      customStickers = Array.isArray(stored)
        ? stored.filter(
            (image) =>
              typeof image === "string" &&
              /^data:image\/(?:jpeg|png|webp);base64,/i.test(image) &&
              image.length <= 90_000
          )
        : [];
    } catch {
      customStickers = [];
    }
  }

  function saveCustomStickers() {
    localStorage.setItem(CUSTOM_STICKERS_KEY, JSON.stringify(customStickers.slice(0, 8)));
  }

  function renderEmojiPicker() {
    elements.emojiTabs.querySelectorAll("[data-emoji-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.emojiTab === currentEmojiTab);
    });
    if (currentEmojiTab === "custom") {
      elements.emojiGrid.className = "emoji-grid custom-sticker-grid";
      elements.emojiGrid.innerHTML = customStickers.length
        ? customStickers
            .map(
              (image, index) => `
                <div class="custom-sticker-item">
                  <button class="custom-sticker-send" type="button" data-send-sticker="${index}" aria-label="发送自定义表情">
                    <img src="${image}" alt="自定义表情" />
                  </button>
                  <button class="custom-sticker-remove" type="button" data-remove-sticker="${index}" aria-label="移除表情">×</button>
                </div>
              `
            )
            .join("")
        : '<div class="custom-sticker-empty">还没有自定义表情<br>点击下方“添加表情”，从手机相册选择图片</div>';
    } else {
      elements.emojiGrid.className = "emoji-grid";
      elements.emojiGrid.innerHTML = (SYSTEM_EMOJIS[currentEmojiTab] || SYSTEM_EMOJIS.faces)
        .map((emoji) => `<button type="button" data-emoji="${emoji}">${emoji}</button>`)
        .join("");
    }
  }

  function renderGroupEmojiPicker() {
    elements.groupEmojiTabs.querySelectorAll("[data-group-emoji-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.groupEmojiTab === currentGroupEmojiTab);
    });
    if (currentGroupEmojiTab === "custom") {
      elements.groupEmojiGrid.className = "emoji-grid custom-sticker-grid";
      elements.groupEmojiGrid.innerHTML = customStickers.length
        ? customStickers
            .map(
              (image, index) => `
                <div class="custom-sticker-item">
                  <button class="custom-sticker-send" type="button" data-group-send-sticker="${index}" aria-label="发送自定义表情">
                    <img src="${image}" alt="自定义表情" />
                  </button>
                  <button class="custom-sticker-remove" type="button" data-group-remove-sticker="${index}" aria-label="移除表情">×</button>
                </div>
              `
            )
            .join("")
        : '<div class="custom-sticker-empty">还没有自定义表情<br>点击下方“添加表情”制作一个</div>';
    } else {
      elements.groupEmojiGrid.className = "emoji-grid";
      elements.groupEmojiGrid.innerHTML = (SYSTEM_EMOJIS[currentGroupEmojiTab] || SYSTEM_EMOJIS.faces)
        .map((emoji) => `<button type="button" data-group-emoji="${emoji}">${emoji}</button>`)
        .join("");
    }
  }

  async function compressChatPicture(file) {
    if (!file?.type?.startsWith("image/")) throw new Error("请选择图片文件");
    const image = await compressImage(file, {
      maxWidth: 900,
      maxHeight: 900,
      quality: 0.72
    });
    if (image.length > 500_000) throw new Error("图片仍然太大，请选择更小的图片");
    return image;
  }

  async function sendChatAttachment(image, type, recipientId = "") {
    if (!state.team || !image) return;
    await apiRequest(`./api/teams/${encodeURIComponent(state.team.id)}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${state.team.memberToken}` },
      body: JSON.stringify({
        text: type === "image" ? "图片" : "表情",
        attachment: image,
        messageType: type,
        recipientId
      })
    });
  }

  async function sendDirectPhoto(file) {
    if (!file || !directChatTargetId) return;
    try {
      toast("正在发送图片");
      const image = await compressChatPicture(file);
      await sendChatAttachment(image, "image", directChatTargetId);
      await refreshDirectChat();
      elements.directChatMessages.scrollTop = elements.directChatMessages.scrollHeight;
    } catch (error) {
      toast(error.message || "图片发送失败");
    } finally {
      elements.directPhotoFile.value = "";
    }
  }

  async function sendGroupPhoto(file) {
    if (!file || !state.team) return;
    try {
      toast("正在发送图片");
      const image = await compressChatPicture(file);
      await sendChatAttachment(image, "image");
      await loadTeamData({ quiet: true });
      elements.teamChatMessages.scrollTop = elements.teamChatMessages.scrollHeight;
    } catch (error) {
      toast(error.message || "图片发送失败");
    } finally {
      elements.groupImageFile.value = "";
    }
  }

  function openChatAttachmentMenu(context) {
    chatMediaContext = context;
    openSheet(elements.chatAttachmentSheet);
  }

  async function uploadAndSendChatVideo(file) {
    if (!file || !state.team) return;
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      toast("请选择 MP4 或 WebM 视频");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast("视频请控制在 25MB 以内");
      return;
    }
    try {
      toast("正在上传视频");
      const response = await fetch(
        `./api/teams/${encodeURIComponent(state.team.id)}/media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${state.team.memberToken}`,
            "Content-Type": file.type
          },
          body: file
        }
      );
      const uploaded = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(uploaded.error || "视频上传失败");
      await apiRequest(`./api/teams/${encodeURIComponent(state.team.id)}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${state.team.memberToken}` },
        body: JSON.stringify({
          text: "视频",
          mediaUrl: uploaded.mediaUrl,
          messageType: "video",
          recipientId: chatMediaContext === "direct" ? directChatTargetId : ""
        })
      });
      if (chatMediaContext === "direct") {
        await refreshDirectChat();
        elements.directChatMessages.scrollTop = elements.directChatMessages.scrollHeight;
      } else {
        await loadTeamData({ quiet: true });
        elements.teamChatMessages.scrollTop = elements.teamChatMessages.scrollHeight;
      }
      toast("视频已发送");
    } catch (error) {
      toast(error.message || "视频发送失败");
    } finally {
      elements.chatRecordVideoFile.value = "";
      elements.chatGalleryVideoFile.value = "";
    }
  }

  async function handleChatMediaFile(file, context) {
    if (!file) return;
    if (file.type.startsWith("image/")) {
      if (context === "direct") await sendDirectPhoto(file);
      else await sendGroupPhoto(file);
    } else if (file.type.startsWith("video/")) {
      await uploadAndSendChatVideo(file);
    } else {
      toast("不支持这种文件格式");
    }
  }

  async function uploadCustomSticker(file, context = "direct") {
    if (!file) return;
    if (customStickers.length >= 8) {
      toast("最多保存 8 个自定义表情");
      return;
    }
    stickerUploadContext = context;
    await openImageEditor("sticker", file);
    elements.customStickerFile.value = "";
  }

  async function sendCustomSticker(image, recipientId = directChatTargetId) {
    if (!state.team || !image) return;
    try {
      await sendChatAttachment(image, "sticker", recipientId);
      if (recipientId) {
        await refreshDirectChat();
        elements.directChatMessages.scrollTop = elements.directChatMessages.scrollHeight;
      } else {
        await loadTeamData({ quiet: true });
        elements.teamChatMessages.scrollTop = elements.teamChatMessages.scrollHeight;
      }
      vibrate(8);
    } catch (error) {
      toast(error.message || "表情发送失败");
    }
  }

  function beginEditDirectMessage(messageId) {
    const message = directMessagesCache.find((item) => item.id === messageId);
    if (!message || message.memberId !== state.team?.memberId || message.type !== "chat") return;
    editingDirectMessageId = messageId;
    elements.directChatInput.value = message.text;
    elements.chatEditState.hidden = false;
    elements.directEmojiPanel.hidden = true;
    elements.directChatInput.focus();
    elements.directChatInput.setSelectionRange(
      elements.directChatInput.value.length,
      elements.directChatInput.value.length
    );
  }

  function applyTeamSession(payload) {
    state.team = {
      id: payload.team.id,
      code: payload.team.code,
      name: payload.team.name,
      memberId: payload.member.id,
      memberToken: payload.member.token,
      joinedAt: new Date().toISOString(),
      pendingSync: false,
      showPresence: true,
      pendingCheckins: []
    };
    state.teamSnapshot = payload.snapshot || null;
    teamSyncStatus = "synced";
    saveState();
    renderAll();
  }

  function getHabit(id) {
    return state.habits.find((habit) => habit.id === id);
  }

  function getValue(date, habitId) {
    return Number(state.records[date]?.[habitId] || 0);
  }

  function getNote(date, habitId) {
    return String(state.notes[date]?.[habitId] || "");
  }

  function saveHabitNote(habitId, { quiet = false } = {}) {
    const habit = getHabit(habitId);
    if (!habit || !elements.detailNote) return;
    const key = dateKey(new Date());
    const note = elements.detailNote.value.trim().slice(0, 60);
    state.notes[key] ||= {};
    if (note) state.notes[key][habitId] = note;
    else delete state.notes[key][habitId];
    if (!Object.keys(state.notes[key]).length) delete state.notes[key];
    saveState({ quiet });
    if (state.team) void syncTeamRecord(habit, getValue(key, habitId));
    if (!quiet) {
      toast(note ? "今天的记录已保存" : "备注已清空");
      vibrate(8);
    }
  }

  function isComplete(habit, value) {
    return value >= habit.target;
  }

  function completedOn(date) {
    const dayRecord = state.records[date] || {};
    return state.habits.filter((habit) => isComplete(habit, Number(dayRecord[habit.id] || 0)));
  }

  function dayCompletion(date) {
    if (!state.habits.length) return 0;
    return completedOn(date).length / state.habits.length;
  }

  function hasAnyRecord(date) {
    const record = state.records[date];
    if (!record) return false;
    return Object.values(record).some((value) => Number(value) > 0);
  }

  function updateRecord(habitId, value, { celebrate = true } = {}) {
    const habit = getHabit(habitId);
    if (!habit) return;
    const key = dateKey(new Date());
    const previousValue = getValue(key, habitId);
    const nextValue = Math.min(Math.max(Number(value) || 0, 0), habit.target);

    if (!state.records[key]) state.records[key] = {};
    if (nextValue > 0) {
      state.records[key][habitId] = nextValue;
    } else {
      delete state.records[key][habitId];
      if (!Object.keys(state.records[key]).length) delete state.records[key];
    }

    saveState({ quiet: true });
    if (state.team) void syncTeamRecord(habit, nextValue);
    vibrate(nextValue > previousValue ? 12 : 6);

    if (celebrate && nextValue >= habit.target && previousValue < habit.target) {
      fireConfetti();
      const allDone = state.habits.length > 0 && state.habits.every((item) => isComplete(item, getValue(key, item.id)));
      toast(allDone ? "今日全部完成，做得漂亮！" : `「${habit.name}」打卡完成`);
    }

    renderAll();
    if (!elements.habitDetailSheet.hidden && activeHabitId === habitId) renderHabitDetail();
  }

  function vibrate(duration = 10) {
    if (state.preferences.haptics && "vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  }

  function renderAll() {
    renderHeader();
    renderToday();
    renderTeam();
    renderStats();
    renderProfile();
  }

  function renderHeader() {
    const now = new Date();
    const greetingHour = now.getHours();
    const greetingPrefix =
      greetingHour < 6
        ? "夜深了"
        : greetingHour < 11
          ? "早上好"
          : greetingHour < 14
            ? "中午好"
            : greetingHour < 18
              ? "下午好"
              : "晚上好";
    elements.dateLabel.textContent = `${now.getMonth() + 1}月${now.getDate()}日 · ${DAY_NAMES[now.getDay()]}`;
    elements.greeting.textContent = `${greetingPrefix}，${state.profile.name}`;
    const initial = state.profile.name.trim().slice(0, 1) || "迹";
    elements.avatarText.textContent = initial;
    elements.profileName.textContent = state.profile.name;
    elements.profileAvatarText.textContent = initial;
  }

  function renderToday() {
    const today = dateKey(new Date());
    const total = state.habits.length;
    const completed = completedOn(today).length;
    const progress = total ? completed / total : 0;
    const weekStart = startOfWeek(new Date());
    const weekEnd = addDays(weekStart, 6);
    const weekCompleted = Array.from({ length: 7 }, (_, index) =>
      completedOn(dateKey(addDays(weekStart, index))).length
    ).reduce((sum, value) => sum + value, 0);

    elements.progressPercent.textContent = `${Math.round(progress * 100)}%`;
    elements.progressCount.textContent = `${completed} / ${total}`;
    elements.orbitFill.style.strokeDashoffset = String(314.159 * (1 - progress));
    elements.streakValue.textContent = String(calculateCurrentStreak());
    elements.pointsValue.textContent = String(weekCompleted * 10);
    elements.heroKicker.textContent =
      progress >= 1 && total ? "今日圆满 · 全部完成" : progress > 0 ? "今日进行中 · 保持节奏" : "今天，从一个小动作开始";
    elements.heroTitle.innerHTML =
      progress >= 1 && total
        ? "今天的约定，<br>已经全部完成。"
        : progress > 0
          ? "好状态，<br>正在一点点攒起来。"
          : "迈出第一步，<br>状态就会跟着来。";
    elements.heroSubtitle.textContent =
      progress >= 1 && total
        ? "你为今天留下了确定的答案。"
        : progress > 0
          ? completed === total - 1
            ? "只差最后一项，别让节奏溜走。"
            : "不用一次做很多，先完成眼下这一项。"
          : "完成任意一项，就算今天没有白过。";

    const weekDayNames = ["一", "二", "三", "四", "五", "六", "日"];
    elements.weekStrip.innerHTML = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const key = dateKey(date);
      const ratio = dayCompletion(key);
      const classes = [
        "day-pill",
        isSameDay(date, new Date()) ? "is-today" : "",
        ratio >= 1 && total ? "is-perfect" : ""
      ]
        .filter(Boolean)
        .join(" ");
      return `
        <button class="${classes}" type="button" data-date="${key}" aria-label="${date.getMonth() + 1}月${date.getDate()}日，${weekDayNames[index]}">
          <span class="day-number">${date.getDate()}</span>
          <span>${weekDayNames[index]}</span>
        </button>
      `;
    }).join("");
    elements.weekSummary.textContent =
      weekCompleted === 0
        ? "新的一周"
        : `已完成 ${weekCompleted} 项`;

    elements.habitList.innerHTML = total
      ? state.habits
          .map((habit) => {
            const value = getValue(today, habit.id);
            const complete = isComplete(habit, value);
            const progressValue = Math.min(value / habit.target, 1);
            const colors = COLOR_STYLES[habit.color];
            return `
              <article class="habit-card ${complete ? "is-complete" : ""}" data-habit-id="${escapeHTML(habit.id)}" style="--habit-bg:${colors.background};--habit-accent:${colors.accent}">
                <button class="habit-icon-wrap" type="button" data-open-habit="${escapeHTML(habit.id)}" aria-label="查看${escapeHTML(habit.name)}详情">${escapeHTML(habit.icon)}</button>
                <button class="habit-copy" type="button" data-open-habit="${escapeHTML(habit.id)}">
                  <span class="habit-name-row">
                    <span class="habit-name">${escapeHTML(habit.name)}</span>
                    ${complete ? '<span class="habit-complete-tag">完成</span>' : ""}
                  </span>
                  <span class="habit-meta">
                    <span>目标 ${habit.target}${escapeHTML(habit.unit)}</span>
                    <strong>${value}${escapeHTML(habit.unit)}</strong>
                  </span>
                  <span class="habit-progress"><span style="width:${progressValue * 100}%"></span></span>
                </button>
                <button class="habit-check" type="button" data-quick-check="${escapeHTML(habit.id)}" aria-label="${complete ? `${escapeHTML(habit.name)}已完成` : `打卡${escapeHTML(habit.name)}`}">
                  ${
                    complete
                      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7.8"/></svg>'
                      : '<svg class="plus-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
                  }
                </button>
              </article>
            `;
          })
          .join("")
      : '<div class="empty-habits">还没有习惯，点击右上角「添加」<br>创建第一条日常打卡吧。</div>';

    elements.dailyQuote.textContent = QUOTES[new Date().getDay()];
    renderIntention();
    renderFocus();
    renderStudyPresets();
  }

  function todayIntention() {
    return state.intentions?.[dateKey(new Date())] || null;
  }

  function renderIntention() {
    const intention = todayIntention();
    elements.intentionCard.classList.toggle("is-done", Boolean(intention?.done));
    elements.intentionText.textContent = intention?.text || "点击设定今天的自律目标";
    elements.intentionHint.textContent = intention
      ? intention.done
        ? "今天守住了自己的目标，做得很好。"
        : "完成后记得回来点亮它。"
      : "例如：少刷手机 30 分钟、完成一次复盘。";
    elements.intentionCheckButton.disabled = !intention;
    elements.editIntentionButton.textContent = intention ? "修改目标" : "设定目标";
  }

  function openIntentionForm() {
    elements.intentionInput.value = todayIntention()?.text || "";
    openSheet(elements.intentionFormSheet);
  }

  function toggleIntentionDone() {
    const key = dateKey(new Date());
    const intention = state.intentions?.[key];
    if (!intention) {
      openIntentionForm();
      return;
    }
    intention.done = !intention.done;
    saveState({ quiet: true });
    renderIntention();
    vibrate(10);
    if (intention.done) {
      fireConfetti();
      toast("今日自律目标完成");
    }
  }

  function formatFocusTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function currentFocusRemaining() {
    if (!state.focus.running) return state.focus.remaining;
    return Math.max(0, Math.ceil((state.focus.endsAt - Date.now()) / 1000));
  }

  function renderFocus() {
    const remaining = currentFocusRemaining();
    const progress = 1 - remaining / state.focus.duration;
    elements.focusTimer.textContent = formatFocusTime(remaining);
    elements.focusButton.textContent = state.focus.running ? "暂时停下" : remaining < state.focus.duration ? "继续专注" : "开始专注";
    elements.focusButton.classList.toggle("is-running", state.focus.running);
    elements.focusDial.classList.toggle("is-running", state.focus.running);
    elements.focusDial.style.setProperty("--focus-progress", `${Math.max(0, progress) * 360}deg`);
    elements.focusTitle.textContent = state.focus.running
      ? "现在只做这一件事"
      : remaining < state.focus.duration
        ? "休息一下，再继续也很好"
        : "留一小段时间给学习";
    elements.focusSubtitle.textContent = state.focus.running
      ? "把手机放远一点，25 分钟后回来。"
      : "关掉通知，专心完成眼前这一页。";
    if (state.focus.running && remaining <= 0) finishFocusSession();
  }

  function startFocusTicker() {
    if (focusTicker) return;
    focusTicker = window.setInterval(() => {
      renderFocus();
      if (!state.focus.running) {
        window.clearInterval(focusTicker);
        focusTicker = null;
      }
    }, 500);
  }

  function toggleFocus() {
    if (state.focus.running) {
      state.focus.remaining = currentFocusRemaining();
      state.focus.running = false;
      state.focus.endsAt = 0;
      saveState({ quiet: true });
      vibrate(7);
      renderFocus();
      return;
    }
    if (state.focus.remaining <= 0) state.focus.remaining = state.focus.duration;
    state.focus.running = true;
    state.focus.endsAt = Date.now() + state.focus.remaining * 1000;
    saveState({ quiet: true });
    vibrate(12);
    renderFocus();
    startFocusTicker();
  }

  function resetFocus() {
    state.focus.running = false;
    state.focus.remaining = state.focus.duration;
    state.focus.endsAt = 0;
    saveState({ quiet: true });
    renderFocus();
  }

  function getFocusHabit() {
    let habit = state.habits.find((item) => item.id === "focus-study" || item.name === "专注学习");
    if (!habit) {
      const minutes = Math.max(5, Math.round(state.focus.duration / 60));
      habit = {
        id: "focus-study",
        name: "专注学习",
        icon: "📝",
        color: "coral",
        mode: "count",
        target: minutes,
        step: minutes,
        unit: "分钟",
        description: "完成一段不被打扰的学习时间。",
        createdAt: new Date().toISOString()
      };
      state.habits.push(habit);
    }
    return habit;
  }

  function finishFocusSession() {
    if (!state.focus.running) return;
    const habit = getFocusHabit();
    const minutes = Math.max(1, Math.round(state.focus.duration / 60));
    state.focus.running = false;
    state.focus.remaining = state.focus.duration;
    state.focus.endsAt = 0;
    saveState({ quiet: true });
    updateRecord(
      habit.id,
      Math.min(getValue(dateKey(new Date()), habit.id) + minutes, habit.target),
      { celebrate: false }
    );
    toast(`${minutes} 分钟专注完成，已记入学习记录`);
    fireConfetti();
    renderFocus();
    renderStudyPresets();
  }

  function renderStudyPresets() {
    elements.studyPresets.querySelectorAll("[data-study-template]").forEach((button) => {
      const template = STUDY_TEMPLATES[button.dataset.studyTemplate];
      button.classList.toggle(
        "is-added",
        Boolean(template && state.habits.some((habit) => habit.name === template.name))
      );
    });
  }

  function addStudyTemplate(templateKey) {
    const template = STUDY_TEMPLATES[templateKey];
    if (!template) return;
    const existing = state.habits.find((habit) => habit.name === template.name);
    if (existing) {
      openHabitDetail(existing.id);
      return;
    }
    const habit = {
      ...template,
      id: createId(),
      createdAt: new Date().toISOString()
    };
    state.habits.push(habit);
    saveState();
    renderAll();
    vibrate(12);
    toast(`已添加「${template.name}」`);
  }

  function restoreFocusTimer() {
    if (!state.focus.running) {
      renderFocus();
      return;
    }
    const endDate = new Date(state.focus.endsAt);
    if (!isSameDay(endDate, new Date())) {
      state.focus.running = false;
      state.focus.remaining = state.focus.duration;
      state.focus.endsAt = 0;
      saveState({ quiet: true });
      renderFocus();
      return;
    }
    if (state.focus.endsAt <= Date.now()) finishFocusSession();
    else {
      renderFocus();
      startFocusTicker();
    }
  }

  function calculateCurrentStreak() {
    let cursor = new Date();
    if (!hasAnyRecord(dateKey(cursor))) cursor = addDays(cursor, -1);

    let streak = 0;
    for (let index = 0; index < 3660; index += 1) {
      if (!hasAnyRecord(dateKey(cursor))) break;
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function calculateBestStreak() {
    const activeDays = Object.keys(state.records)
      .filter(hasAnyRecord)
      .sort();
    let best = 0;
    let running = 0;
    let previous = null;

    activeDays.forEach((key) => {
      const date = parseDateKey(key);
      if (previous && dateKey(addDays(previous, 1)) === key) {
        running += 1;
      } else {
        running = 1;
      }
      best = Math.max(best, running);
      previous = date;
    });
    return best;
  }

  function renderTeam() {
    const joined = Boolean(state.team);
    elements.teamEmptyState.hidden = joined;
    elements.teamJoinedState.hidden = !joined;

    if (!joined) return;

    const snapshot = state.teamSnapshot;
    const members = Array.isArray(snapshot?.members)
      ? snapshot.members
      : [
          {
            id: state.team.memberId,
            name: state.profile.name,
            todayCount: 0,
            weekPoints: 0,
            activeToday: false
          }
        ];
    const totals = snapshot?.totals || {
      todayCompleted: 0,
      activeToday: 0,
      weekPoints: 0
    };
    const avatarColors = ["#dced62", "#f5bf9d", "#b8deeb", "#d7c8f2", "#efd69e"];

    elements.teamName.textContent = state.team.name;
    elements.teamInviteCode.textContent = state.team.code;
    elements.teamTodayCount.textContent = String(totals.todayCompleted || 0);
    elements.teamActiveCount.textContent = `${totals.activeToday || 0} / ${members.length}`;
    elements.teamWeekCount.textContent = String(totals.weekPoints || 0);
    elements.teamMemberCount.textContent =
      members.length > 1 ? `${members.length} 位成员` : "等待同事加入";
    elements.teamPresenceBar.classList.toggle("is-hidden", state.team.showPresence === false);
    elements.teamPresenceTitle.textContent =
      state.team.showPresence === false ? "在线状态已隐藏" : "你当前显示为在线";
    elements.teamPresenceButton.textContent =
      state.team.showPresence === false ? "显示在线" : "隐藏在线";
    const spark = snapshot?.spark || { days: 0, todayMembers: 0 };
    const todayMembers = Number(spark.todayMembers) || 0;
    elements.teamSparkDays.textContent = String(spark.days || 0);
    elements.teamSparkKicker.textContent = todayMembers >= 2 ? "SPARK ON · 火花已点亮" : "TODAY'S SPARK";
    elements.teamSparkTitle.textContent =
      todayMembers >= 2
        ? "今天的火花已经点亮"
        : todayMembers === 1
          ? "再等一位同事加入火花"
          : "今天的火花还在路上";
    elements.teamSparkDescription.textContent =
      todayMembers >= 2
        ? `${todayMembers} 位同事完成打卡，明天继续把火花续上。`
        : "至少两位同事完成打卡，就能一起点亮。";

    elements.teamRanking.innerHTML = members.length
      ? members
          .map((member, index) => {
            const initial = member.name.trim().slice(0, 1) || "同";
            const isSelf = member.id === state.team.memberId;
            const isOnline = isSelf ? state.team.showPresence !== false : Boolean(member.online);
            const activityText =
              member.todayCount > 0
                ? `今日 ${member.todayCount} 项 · 本周 ${member.weekPoints || 0} 能量${isOnline ? " · 在线" : ""}`
                : isOnline
                  ? "当前在线 · 今天还没有打卡"
                  : "今天还没有打卡";
            const statusText = `${activityText}${member.status ? ` · ${member.status}` : ""}`;
            return `
              <div class="team-rank-item">
                <button class="team-rank-profile" type="button" data-member-card="${escapeHTML(member.id)}" aria-label="查看${escapeHTML(member.name)}的名片">
                  <span class="team-rank-number">${String(index + 1).padStart(2, "0")}</span>
                  <span class="team-rank-avatar ${isOnline ? "is-online" : ""}" style="--avatar-bg:${avatarColors[index % avatarColors.length]}">${escapeHTML(initial)}</span>
                  <span class="team-rank-copy">
                    <strong>${escapeHTML(member.name)}${isSelf ? '<i class="team-me-tag">我</i>' : ""}</strong>
                    <small>${escapeHTML(statusText)}</small>
                  </span>
                  <span class="team-rank-score">${member.todayCount > 0 ? `${member.todayCount}<small>项</small>` : "—"}</span>
                </button>
                <button class="team-rank-chat" type="button" data-direct-chat="${escapeHTML(member.id)}" aria-label="和${escapeHTML(member.name)}私聊">
                  <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5Z"></path><path d="M8 9h8M8 12h5"></path></svg>
                </button>
              </div>
            `;
          })
          .join("")
      : '<div class="team-feed-empty">正在等待小组成员加入。</div>';

    const recent = Array.isArray(snapshot?.recent) ? snapshot.recent : [];
    elements.teamFeed.innerHTML = recent.length
      ? recent
          .map((entry) => {
            const updated = new Date(entry.updatedAt);
            const validTime = !Number.isNaN(updated.getTime());
            const timeText = validTime
              ? isSameDay(updated, new Date())
                ? `今天 ${updated.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
                : `${updated.getMonth() + 1}月${updated.getDate()}日 ${updated.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
              : "刚刚";
            return `
              <div class="team-feed-item">
                <strong>${escapeHTML(entry.memberName)} · ${escapeHTML(entry.icon)} ${escapeHTML(entry.habitName)}</strong>
                <p>完成 ${entry.value} / ${entry.target}${escapeHTML(entry.unit)}${entry.note ? `<br>“${escapeHTML(entry.note)}”` : ""}</p>
                <small>${escapeHTML(timeText)}</small>
              </div>
            `;
          })
          .join("")
      : '<div class="team-feed-empty">今天的坚持还没开始。<br>完成任意一项，就会出现在这里。</div>';

    const messages = Array.isArray(snapshot?.recentMessages) ? snapshot.recentMessages : [];
    const wasNearBottom =
      elements.teamChatMessages.scrollHeight -
        elements.teamChatMessages.scrollTop -
        elements.teamChatMessages.clientHeight <
      50;
    elements.teamChatMessages.innerHTML = messages.length
      ? messages
          .map((message, index) => {
            const mine = message.memberId === state.team.memberId;
            const memberIndex = members.findIndex((member) => member.id === message.memberId);
            const created = new Date(message.createdAt);
            const time = Number.isNaN(created.getTime())
              ? ""
              : created.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
            return `
              <div class="chat-message ${mine ? "is-mine" : ""} ${message.type === "checkin" ? "is-checkin" : ""}">
                <span class="chat-avatar" style="--avatar-bg:${avatarColors[(memberIndex >= 0 ? memberIndex : index) % avatarColors.length]}">${escapeHTML(message.memberName.trim().slice(0, 1) || "同")}</span>
                <div class="chat-bubble-wrap">
                  <div class="chat-message-meta">${mine ? "我" : escapeHTML(message.memberName)} · ${escapeHTML(time)}</div>
                  <div class="chat-bubble ${message.attachment || message.mediaUrl ? "is-sticker" : ""}">${
                    message.mediaUrl
                      ? `<video class="chat-video" src="${message.mediaUrl}" controls playsinline preload="metadata"></video>`
                      : message.attachment
                      ? `<img class="${message.type === "image" ? "chat-photo-image" : "chat-sticker-image"}" src="${message.attachment}" alt="聊天图片" />`
                      : `${message.type === "checkin" ? "🔥 " : ""}${escapeHTML(message.text)}`
                  }</div>
                </div>
              </div>
            `;
          })
          .join("")
      : '<div class="chat-empty">还没有聊天记录。<br>说一句“今天也要一起坚持”吧。</div>';
    if (wasNearBottom) {
      elements.teamChatMessages.scrollTop = elements.teamChatMessages.scrollHeight;
    }

    renderTeamSyncState();
  }

  function renderTeamSyncState() {
    if (!elements.teamSyncState) return;
    elements.teamSyncState.classList.toggle("is-syncing", teamSyncStatus === "syncing");
    elements.teamSyncState.classList.toggle("is-offline", teamSyncStatus === "offline");
    const text = {
      syncing: "正在同步小组进度",
      offline: "暂时离线，联网后会自动同步",
      synced: "小组进度已同步",
      idle: "等待同步小组进度"
    };
    elements.teamSyncText.textContent = text[teamSyncStatus] || text.idle;
  }

  function renderStats() {
    const now = new Date();
    const today = dateKey(now);
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const elapsedDays = now.getDate();
    const possible = Math.max(1, elapsedDays * state.habits.length);
    let monthCompleted = 0;
    let monthPartial = 0;

    Object.keys(state.records)
      .filter((key) => key.startsWith(monthPrefix))
      .forEach((key) => {
        const dayCount = completedOn(key).length;
        monthCompleted += dayCount;
        monthPartial += dayCount > 0 ? dayCount : dayCompletion(key);
      });

    elements.monthlyCompleted.innerHTML = `${monthCompleted}<small>次</small>`;
    elements.bestStreak.textContent = String(calculateBestStreak());
    elements.monthlyRate.textContent = `${Math.round((monthPartial / possible) * 100)}%`;

    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(now, index - 6);
      return { date, key: dateKey(date) };
    });
    const weekCounts = weekDays.map(({ key }) => completedOn(key).length);
    const average = weekCounts.reduce((sum, value) => sum + value, 0) / 7;
    const max = Math.max(...weekCounts, state.habits.length || 1, 1);
    elements.weekAverage.textContent = `日均 ${average.toFixed(1).replace(".0", "")} 项`;
    elements.barChart.innerHTML = weekDays
      .map(({ date, key }, index) => {
        const count = weekCounts[index];
        const height = count ? Math.max(8, (count / max) * 100) : 3;
        const isToday = key === today;
        return `
          <button class="bar-column ${count === Math.max(...weekCounts) && count > 0 ? "is-best" : ""} ${isToday ? "is-today" : ""}" type="button" data-date="${key}" aria-label="${date.getMonth() + 1}月${date.getDate()}日完成${count}项">
            <span class="bar-track"><span style="height:${height}%;animation-delay:${index * 45}ms"></span></span>
            <span>${SHORT_DAY_NAMES[date.getDay()]}</span>
          </button>
        `;
      })
      .join("");

    renderCalendar();
    renderRecent();
  }

  function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const today = dateKey(new Date());
    const cells = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      cells.push('<span class="calendar-day is-empty" aria-hidden="true"></span>');
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = dateKey(date);
      const ratio = dayCompletion(key);
      const hasRecord = hasAnyRecord(key);
      const future = date > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
      const classes = [
        "calendar-day",
        hasRecord ? "has-record" : "",
        ratio >= 1 && state.habits.length ? "level-2" : "",
        key === today ? "is-today" : "",
        future ? "is-future" : "",
        key === selectedCalendarDate ? "is-selected" : ""
      ]
        .filter(Boolean)
        .join(" ");
      cells.push(
        `<button class="${classes}" type="button" data-calendar-date="${key}" aria-label="${month + 1}月${day}日${hasRecord ? "有打卡记录" : "暂无打卡"}">${day}</button>`
      );
    }

    elements.calendarTitle.textContent = `${year}年${month + 1}月`;
    elements.calendarGrid.innerHTML = cells.join("");
  }

  function renderRecent() {
    const recentEntries = [];
    Object.keys(state.records)
      .sort()
      .reverse()
      .forEach((key) => {
        const record = state.records[key];
        state.habits.forEach((habit) => {
          const value = Number(record[habit.id] || 0);
          if (recentEntries.length < 4 && isComplete(habit, value)) {
            recentEntries.push({ key, habit, value, note: getNote(key, habit.id) });
          }
        });
      });

    if (!recentEntries.length) {
      elements.recentList.innerHTML =
        '<div class="recent-empty">第一条记录会从这里开始。<br>今天为自己完成一件小事吧。</div>';
      return;
    }

    elements.recentList.innerHTML = recentEntries
      .map(({ key, habit, value, note }) => {
        const colors = COLOR_STYLES[habit.color];
        const date = parseDateKey(key);
        const dateText = isSameDay(date, new Date())
          ? "今天"
          : `${date.getMonth() + 1}月${date.getDate()}日`;
        return `
          <div class="recent-item" style="--habit-bg:${colors.background};--habit-accent:${colors.accent}">
            <span class="recent-icon">${escapeHTML(habit.icon)}</span>
            <span class="recent-copy">
              <strong>完成了「${escapeHTML(habit.name)}」</strong>
              <span>${dateText}${note ? ` · ${escapeHTML(note)}` : ` · 周${SHORT_DAY_NAMES[date.getDay()]}`}</span>
            </span>
            <span class="recent-progress"><strong>${value}</strong> / ${habit.target}${escapeHTML(habit.unit)}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderProfile() {
    const activeDays = Object.keys(state.records).filter(hasAnyRecord).length;
    const totalCompleted = Object.keys(state.records).reduce((sum, key) => sum + completedOn(key).length, 0);
    const joinedDate = parseDateKey(state.profile.joined);
    elements.profileStatus.textContent = `我的状态 · ${state.profile.status || "专注中"}`;
    elements.profileMotto.textContent = state.profile.motto || "把普通的日子，过成自己的作品。";
    elements.namecardName.textContent = state.profile.name;
    elements.namecardStatus.textContent = `我的状态 · ${state.profile.status || "专注中"}`;
    elements.namecardInitial.textContent = state.profile.name.trim().slice(0, 1) || "迹";
    elements.profileJoinDate.textContent = `从 ${joinedDate.getFullYear()}年${joinedDate.getMonth() + 1}月${joinedDate.getDate()}日 开始记录`;
    elements.profileMetrics.innerHTML = `
      <div><strong>${totalCompleted}</strong><span>累计打卡</span></div>
      <div><strong>${calculateCurrentStreak()}</strong><span>连续天数</span></div>
      <div><strong>${activeDays}</strong><span>活跃天数</span></div>
    `;

    elements.manageHabitList.innerHTML = state.habits.length
      ? state.habits
          .map((habit) => {
            const colors = COLOR_STYLES[habit.color];
            return `
              <div class="manage-habit-item">
                <span class="manage-icon" style="--habit-bg:${colors.background}">${escapeHTML(habit.icon)}</span>
                <span class="manage-copy">
                  <strong>${escapeHTML(habit.name)}</strong>
                  <span>${habit.mode === "boolean" ? "一次完成" : `每日 ${habit.target}${escapeHTML(habit.unit)}`}</span>
                </span>
                <span class="manage-actions">
                  <button type="button" data-edit-habit="${escapeHTML(habit.id)}" aria-label="编辑${escapeHTML(habit.name)}">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4Z"></path></svg>
                  </button>
                  <button type="button" data-delete-habit="${escapeHTML(habit.id)}" aria-label="删除${escapeHTML(habit.name)}">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"></path></svg>
                  </button>
                </span>
              </div>
            `;
          })
          .join("")
      : '<div class="recent-empty">还没有习惯，点击下方按钮添加。</div>';

    elements.hapticToggle.checked = state.preferences.haptics;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    elements.installBadge.textContent = standalone ? "已安装" : deferredInstallPrompt ? "可安装" : "查看方法";
    renderAppearance();
  }

  function renderAppearance() {
    const stats = growthStats();
    if (
      MOTION_WALLPAPERS[state.appearance.wallpaper] &&
      !isUnlockRequirementMet(MOTION_WALLPAPERS[state.appearance.wallpaper], stats)
    ) {
      state.appearance.wallpaper = "paper";
    }
    if (
      AVATAR_EFFECTS[state.appearance.avatarEffect] &&
      !isUnlockRequirementMet(AVATAR_EFFECTS[state.appearance.avatarEffect], stats)
    ) {
      state.appearance.avatarEffect = "none";
    }
    const {
      wallpaper,
      wallpaperImage,
      heroImage,
      teamImage,
      statsImage,
      avatarImage,
      cardImage,
      avatarEffect
    } = state.appearance;
    const rewardDays = state.appearance.rewardDays || 3;
    const rewardMinutes = state.appearance.rewardMinutes || 90;
    const rewardUnlocked =
      previewUnlocked || stats.activeDays >= rewardDays || stats.exerciseMinutes >= rewardMinutes;
    const heroCoverUnlocked = heroCoverIsUnlocked();
    elements.growthSummaryText.textContent =
      `累计打卡 ${stats.activeDays} 天 · 运动 ${stats.exerciseMinutes} 分钟` +
      (previewUnlocked ? " · 预览已全解锁" : "");
    const hasWallpaper = wallpaper !== "paper" || Boolean(wallpaperImage);
    const isMotion = Boolean(MOTION_WALLPAPERS[wallpaper] && !wallpaperImage);
    elements.appWallpaper.dataset.wallpaper = wallpaper;
    elements.appWallpaper.classList.toggle("is-custom", Boolean(wallpaperImage));
    elements.appWallpaper.classList.toggle("is-motion", isMotion);
    elements.appWallpaper.style.backgroundImage = wallpaperImage ? `url("${wallpaperImage}")` : "";
    elements.wallpaperMotion.innerHTML = isMotion ? MOTION_ART[wallpaper] || "" : "";
    elements.heroCard.classList.toggle("has-image", Boolean(heroImage));
    elements.heroCard.style.setProperty("--hero-image", heroImage ? `url("${heroImage}")` : "none");
    elements.uploadHeroImageButton.classList.toggle("is-locked", !heroCoverUnlocked);
    elements.heroCoverUnlockNote.classList.toggle("is-ready", heroCoverUnlocked);
    elements.heroCoverUnlockNote.textContent = heroCoverUnlocked
      ? "主背景封面已解锁，可以上传自己的图片"
      : `主背景封面还差 ${Math.max(0, 3 - stats.activeDays)} 天或 ${Math.max(0, 90 - stats.exerciseMinutes)} 分钟解锁`;
    elements.teamBanner.classList.toggle("has-image", Boolean(teamImage));
    elements.teamBanner.style.setProperty("--team-image", teamImage ? `url("${teamImage}")` : "none");
    elements.teamWelcome.classList.toggle("has-image", Boolean(teamImage));
    elements.teamWelcome.style.setProperty("--team-image", teamImage ? `url("${teamImage}")` : "none");
    elements.statsOverview.classList.toggle("has-image", Boolean(statsImage));
    elements.statsOverview.style.setProperty("--stats-image", statsImage ? `url("${statsImage}")` : "none");
    [
      [elements.todayCoverPreview, heroImage],
      [elements.teamCoverPreview, teamImage],
      [elements.statsCoverPreview, statsImage],
      [elements.profileCoverPreview, cardImage]
    ].forEach(([node, image]) => {
      node.classList.toggle("has-image", Boolean(image));
      node.style.backgroundImage = image ? `url("${image}")` : "";
    });

    [elements.profileAvatar, elements.avatarButton, elements.namecardPhoto].forEach((node) => {
      node.classList.toggle("has-image", Boolean(avatarImage));
      node.style.backgroundImage = avatarImage ? `url("${avatarImage}")` : "";
    });
    elements.profileCard.classList.toggle("has-image", Boolean(cardImage));
    elements.namecardPreview.classList.toggle("has-image", Boolean(cardImage));
    elements.profileCard.style.setProperty("--profile-image", cardImage ? `url("${cardImage}")` : "none");
    elements.namecardPreview.style.setProperty("--profile-image", cardImage ? `url("${cardImage}")` : "none");
    [elements.avatarButton, elements.profileAvatar].forEach((node) => {
      Object.keys(AVATAR_EFFECTS).forEach((effect) => {
        if (effect !== "none") node.classList.toggle(`effect-${effect}`, avatarEffect === effect);
      });
    });
    elements.avatarPreviewLarge.classList.toggle("has-image", Boolean(avatarImage));
    elements.avatarPreviewLarge.style.backgroundImage = avatarImage ? `url("${avatarImage}")` : "";
    elements.avatarPreviewInitial.textContent = state.profile.name.trim().slice(0, 1) || "迹";
    elements.customizeBadge.textContent =
      hasWallpaper ||
      heroImage ||
      teamImage ||
      statsImage ||
      avatarImage ||
      cardImage ||
      avatarEffect !== "none"
        ? "已装扮"
        : "可装扮";
    elements.rewardCoverPreview.style.backgroundImage = state.appearance.rewardCardImage
      ? `url("${state.appearance.rewardCardImage}")`
      : "";
    elements.rewardCoverPreview.querySelector("span").textContent = state.appearance.rewardCardImage
      ? "已选择珍藏封面\n满足指标后可用于小名片"
      : "上传一张喜欢的图片\n完成指标后自动解锁";
    elements.rewardCoverState.textContent = state.appearance.rewardCardImage ? "已设置" : "未设置";
    elements.rewardCoverState.classList.toggle("is-ready", rewardUnlocked && Boolean(state.appearance.rewardCardImage));
    elements.rewardProgressText.textContent = `当前成长：打卡 ${stats.activeDays} 天 · 运动 ${stats.exerciseMinutes} 分钟`;
    elements.rewardUnlockState.textContent = rewardUnlocked ? "已满足解锁条件" : "尚未解锁";
    elements.rewardUnlockState.classList.toggle("is-ready", rewardUnlocked);
    elements.rewardRequirementSelect.value = `${rewardDays}:${rewardMinutes}`;
    elements.applyRewardCoverButton.classList.toggle(
      "is-locked",
      !rewardUnlocked || !state.appearance.rewardCardImage
    );

    elements.wallpaperPresets.querySelectorAll("[data-wallpaper]").forEach((button) => {
      button.classList.toggle(
        "is-selected",
        !wallpaperImage && button.dataset.wallpaper === wallpaper
      );
    });
    elements.motionWallpapers.querySelectorAll("[data-motion-wallpaper]").forEach((button) => {
      const id = button.dataset.motionWallpaper;
      const unlocked = isUnlockRequirementMet(MOTION_WALLPAPERS[id], stats);
      button.classList.toggle("is-unlocked", unlocked);
      button.classList.toggle("is-locked", !unlocked);
      button.classList.toggle("is-selected", !wallpaperImage && wallpaper === id);
      const label = button.querySelector("[data-unlock-text]");
      if (label) label.textContent = unlocked ? "已解锁" : unlockRemainingText(MOTION_WALLPAPERS[id], stats);
    });
    elements.avatarEffectOptions.querySelectorAll("[data-avatar-effect]").forEach((button) => {
      const id = button.dataset.avatarEffect;
      const unlocked = isUnlockRequirementMet(AVATAR_EFFECTS[id], stats);
      button.classList.toggle("is-unlocked", unlocked);
      button.classList.toggle("is-locked", !unlocked);
      button.classList.toggle("is-selected", avatarEffect === id);
      const label = button.querySelector("[data-unlock-text]");
      if (label) {
        label.textContent = unlocked
          ? "已解锁 · 点击使用"
          : unlockRemainingText(AVATAR_EFFECTS[id], stats);
      }
    });
  }

  function growthStats() {
    const activeDays = Object.keys(state.records).filter(hasAnyRecord).length;
    const exerciseHabitIds = new Set(
      state.habits
        .filter((habit) => habit.id === "workout" || /运动|跑步|健身/.test(habit.name))
        .map((habit) => habit.id)
    );
    let exerciseMinutes = 0;
    Object.values(state.records).forEach((dayRecord) => {
      exerciseHabitIds.forEach((habitId) => {
        exerciseMinutes += Number(dayRecord[habitId] || 0);
      });
    });
    return { activeDays, exerciseMinutes };
  }

  function isUnlockRequirementMet(requirement, stats = growthStats()) {
    if (previewUnlocked) return true;
    if (!requirement) return false;
    if (!requirement.days && !requirement.minutes) return true;
    return stats.activeDays >= requirement.days || stats.exerciseMinutes >= requirement.minutes;
  }

  function unlockRequirementText(requirement) {
    return `打卡 ${requirement.days} 天 / 运动 ${requirement.minutes} 分钟`;
  }

  function unlockRemainingText(requirement, stats = growthStats()) {
    const remainingDays = Math.max(0, requirement.days - stats.activeDays);
    const remainingMinutes = Math.max(0, requirement.minutes - stats.exerciseMinutes);
    return `还差 ${remainingDays} 天或 ${remainingMinutes} 分钟`;
  }

  function switchPage(pageName) {
    if (!["today", "team", "stats", "profile"].includes(pageName)) return;
    activePage = pageName;
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.toggle("is-active", page.dataset.page === pageName);
    });
    document.querySelectorAll(".nav-item").forEach((item) => {
      const active = item.dataset.nav === pageName;
      item.classList.toggle("is-active", active);
      if (active) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
    elements.appMain.scrollTo({ top: 0, behavior: "smooth" });
    vibrate(5);
    if (pageName === "team") {
      renderTeam();
      if (state.team) loadTeamData({ quiet: true });
    }
    if (pageName === "stats") renderStats();
    if (pageName === "profile") renderProfile();
  }

  function openSheet(sheet) {
    closeSheets({ keepBackdrop: true });
    elements.sheetBackdrop.hidden = false;
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      const focusable = sheet.querySelector("input:not([type='hidden']), button");
      if (focusable && window.matchMedia("(hover: hover)").matches) focusable.focus({ preventScroll: true });
    }, 120);
  }

  function closeSheets({ keepBackdrop = false } = {}) {
    document.querySelectorAll(".bottom-sheet").forEach((sheet) => {
      sheet.hidden = true;
    });
    elements.directEmojiPanel.hidden = true;
    if (!keepBackdrop) {
      elements.sheetBackdrop.hidden = true;
      document.body.style.overflow = "";
    }
    confirmHandler = null;
  }

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7.8"/></svg><span>${escapeHTML(message)}</span>`;
    elements.toastRegion.append(node);
    window.setTimeout(() => {
      node.classList.add("is-leaving");
      window.setTimeout(() => node.remove(), 240);
    }, 2200);
  }

  function fireConfetti() {
    const colors = ["#dced62", "#f39d78", "#a9d9e8", "#c8b7ec", "#f0c35c"];
    for (let index = 0; index < 19; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti";
      const angle = (Math.PI * 2 * index) / 19 + Math.random() * 0.3;
      const distance = 65 + Math.random() * 105;
      piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--y", `${Math.sin(angle) * distance + 80}px`);
      piece.style.setProperty("--r", `${Math.random() * 540 - 270}deg`);
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 55}ms`;
      elements.confettiLayer.append(piece);
      window.setTimeout(() => piece.remove(), 1150);
    }
  }

  function openHabitDetail(id) {
    activeHabitId = id;
    if (!getHabit(id)) return;
    renderHabitDetail();
    openSheet(elements.habitDetailSheet);
  }

  function renderHabitDetail() {
    const habit = getHabit(activeHabitId);
    if (!habit) return;
    const value = getValue(dateKey(new Date()), habit.id);
    const progress = Math.min(value / habit.target, 1);
    const colors = COLOR_STYLES[habit.color];
    elements.detailIcon.textContent = habit.icon;
    elements.detailIcon.style.background = colors.background;
    elements.detailTitle.textContent = habit.name;
    elements.detailDescription.textContent = habit.description || DESCRIPTIONS[habit.id] || "今天也为自己完成一件小事。";
    elements.detailCurrent.textContent = String(value);
    elements.detailNote.value = getNote(dateKey(new Date()), habit.id);
    elements.detailUnit.textContent = habit.unit;
    elements.detailTarget.textContent = `目标 ${habit.target}${habit.unit}`;
    elements.detailTrackFill.style.width = `${progress * 100}%`;
    elements.detailStep.textContent = `+${habit.step}`;
    elements.detailMinus.disabled = value <= 0;
    elements.detailPlus.disabled = value >= habit.target;
    elements.detailCheckButton.textContent =
      value >= habit.target ? "今天已经完成啦" : habit.mode === "boolean" ? "标记今天已完成" : "完成今日打卡";
  }

  function openHabitForm(habit = null) {
    elements.habitForm.reset();
    elements.editingHabitId.value = habit?.id || "";
    elements.formTitle.textContent = habit ? "编辑习惯" : "添加习惯";
    elements.habitName.value = habit?.name || "";
    elements.habitTarget.value = habit?.target || 30;
    elements.habitStep.value = habit?.step || 10;
    elements.habitUnit.value = habit?.unit || "分钟";

    const mode = habit?.mode || "count";
    document.querySelector(`input[name="habitMode"][value="${mode}"]`).checked = true;
    elements.countFields.hidden = mode === "boolean";
    setPickerSelection(elements.iconPicker, "icon", habit?.icon || "🏃");
    setPickerSelection(elements.colorPicker, "color", habit?.color || "lime");
    openSheet(elements.habitFormSheet);
  }

  function setPickerSelection(container, attribute, value) {
    container.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset[attribute] === value);
    });
  }

  function saveHabitFromForm(event) {
    event.preventDefault();
    const name = elements.habitName.value.trim();
    if (!name) {
      elements.habitName.focus();
      return;
    }

    const mode = document.querySelector('input[name="habitMode"]:checked').value;
    const icon = elements.iconPicker.querySelector(".is-selected")?.dataset.icon || "✨";
    const color = elements.colorPicker.querySelector(".is-selected")?.dataset.color || "lime";
    const existingId = elements.editingHabitId.value;
    const existing = existingId ? getHabit(existingId) : null;
    const target = mode === "boolean" ? 1 : clamp(elements.habitTarget.value, 1, 999);
    const step = mode === "boolean" ? 1 : Math.min(clamp(elements.habitStep.value, 1, 999), target);
    const unit = mode === "boolean" ? "次" : elements.habitUnit.value.trim().slice(0, 4) || "次";

    if (existing) {
      Object.assign(existing, {
        name: name.slice(0, 10),
        mode,
        icon,
        color,
        target,
        step,
        unit
      });
      if (state.team) void syncTeamRecord(existing, getValue(dateKey(new Date()), existing.id));
      toast("习惯已更新");
    } else {
      state.habits.push({
        id: createId(),
        name: name.slice(0, 10),
        mode,
        icon,
        color,
        target,
        step,
        unit,
        description: "今天也为自己完成一件小事。",
        createdAt: new Date().toISOString()
      });
      toast(`已添加「${name.slice(0, 10)}」`);
    }

    saveState();
    closeSheets();
    renderAll();
    vibrate(12);
  }

  function requestConfirm({ title, description, actionText = "确认", onConfirm }) {
    elements.confirmTitle.textContent = title;
    elements.confirmDescription.textContent = description;
    elements.confirmAction.textContent = actionText;
    confirmHandler = onConfirm;
    openSheet(elements.confirmSheet);
  }

  function deleteHabit(id) {
    const habit = getHabit(id);
    if (!habit) return;
    requestConfirm({
      title: `删除「${habit.name}」？`,
      description: "习惯会从今日列表移除，过去的记录仍会保留在备份文件中。",
      actionText: "删除",
      onConfirm: () => {
        if (state.team) void syncTeamRecord(habit, 0);
        state.habits = state.habits.filter((item) => item.id !== id);
        saveState();
        closeSheets();
        renderAll();
        toast("习惯已删除");
      }
    });
  }

  function openDayDetail(key) {
    const date = parseDateKey(key);
    const completed = completedOn(key);
    const activeHabits = state.habits.filter((habit) => getValue(key, habit.id) > 0);
    const today = isSameDay(date, new Date());
    elements.dayDetailKicker.textContent = today ? "TODAY'S RECORD" : "DAILY RECORD";
    elements.dayDetailTitle.textContent = `${date.getMonth() + 1}月${date.getDate()}日 · ${DAY_NAMES[date.getDay()]}`;
    elements.dayDetailSummary.innerHTML = `<span>共完成</span><strong>${completed.length} / ${state.habits.length} 项</strong>`;
    elements.dayDetailList.innerHTML = activeHabits.length
      ? activeHabits
          .map((habit) => {
            const value = getValue(key, habit.id);
            const note = getNote(key, habit.id);
            return `
              <div class="day-detail-item">
                <span>${escapeHTML(habit.icon)}</span>
                <span><strong>${escapeHTML(habit.name)}</strong><small>${note ? escapeHTML(note) : isComplete(habit, value) ? "已完成目标" : "进行中"}</small></span>
                <span class="day-detail-value">${value} / ${habit.target}${escapeHTML(habit.unit)}</span>
              </div>
            `;
          })
          .join("")
      : '<div class="day-detail-empty">这一天还没有打卡记录<br>每一天都可以成为新的起点。</div>';
    openSheet(elements.dayDetailSheet);
  }

  function openProfileForm() {
    elements.profileNameInput.value = state.profile.name;
    elements.profileStatusInput.value = state.profile.status;
    elements.profileMottoInput.value = state.profile.motto;
    openSheet(elements.profileFormSheet);
  }

  function openAvatarSheet() {
    renderAppearance();
    openSheet(elements.avatarSheet);
  }

  function openInstallSheet() {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) {
      elements.installDescription.textContent = "你已经在使用桌面版小迹。所有打卡数据都会安全保存在这台手机上。";
      elements.nativeInstallButton.hidden = true;
    } else if (deferredInstallPrompt) {
      elements.installDescription.textContent = "安装后可从手机桌面直接打开，并支持离线使用。打卡数据仍然只保存在本机。";
      elements.nativeInstallButton.hidden = false;
    } else {
      elements.installDescription.textContent =
        "请使用手机浏览器打开本页面，点右上角菜单，再选择「添加到主屏幕」或「安装应用」。";
      elements.nativeInstallButton.hidden = true;
    }
    openSheet(elements.installSheet);
  }

  function openCustomizeSheet() {
    renderAppearance();
    openSheet(elements.customizeSheet);
  }

  function selectWallpaper(wallpaper) {
    state.appearance.wallpaper = wallpaper;
    state.appearance.wallpaperImage = "";
    saveState({ quiet: true });
    renderAppearance();
    vibrate(7);
  }

  function selectMotionWallpaper(wallpaper) {
    const requirement = MOTION_WALLPAPERS[wallpaper];
    if (!requirement) return;
    const stats = growthStats();
    if (!isUnlockRequirementMet(requirement, stats)) {
      toast(`还未解锁：${unlockRemainingText(requirement, stats)}`);
      return;
    }
    state.appearance.wallpaper = wallpaper;
    state.appearance.wallpaperImage = "";
    saveState({ quiet: true });
    renderAppearance();
    toast(`已换上「${requirement.name}」动态壁纸`);
    vibrate(12);
  }

  function selectAvatarEffect(effect) {
    const requirement = AVATAR_EFFECTS[effect];
    if (!requirement) return;
    const stats = growthStats();
    if (!isUnlockRequirementMet(requirement, stats)) {
      toast(`还未解锁：${unlockRemainingText(requirement, stats)}`);
      return;
    }
    state.appearance.avatarEffect = effect;
    saveState({ quiet: true });
    renderAppearance();
    toast(effect === "none" ? "已使用默认头像" : `已启用「${requirement.name}」`);
    vibrate(12);
  }

  function loadImageElement(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("图片无法读取"));
      };
      image.src = url;
    });
  }

  async function compressImage(file, { maxWidth, maxHeight, square = false, aspect = 0, quality = 0.84 }) {
    if (!file?.type?.startsWith("image/")) throw new Error("请选择图片文件");
    if (file.size > 12 * 1024 * 1024) throw new Error("图片建议小于 12MB");
    const image = await loadImageElement(file);
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;
    if (square) aspect = 1;
    if (aspect) {
      const currentAspect = sourceWidth / sourceHeight;
      if (currentAspect > aspect) {
        const croppedWidth = sourceHeight * aspect;
        sourceX = (sourceWidth - croppedWidth) / 2;
        sourceWidth = croppedWidth;
      } else {
        const croppedHeight = sourceWidth / aspect;
        sourceY = (sourceHeight - croppedHeight) / 2;
        sourceHeight = croppedHeight;
      }
    } else if (square) {
      const edge = Math.min(sourceWidth, sourceHeight);
      sourceX = (sourceWidth - edge) / 2;
      sourceY = (sourceHeight - edge) / 2;
      sourceWidth = edge;
      sourceHeight = edge;
    }
    const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL("image/jpeg", quality);
  }

  async function openImageEditor(kind, file, { fieldOverride = "" } = {}) {
    if (!file) return;
    const baseTarget = IMAGE_TARGETS[kind];
    if (!baseTarget) return;
    const target = { ...baseTarget, field: fieldOverride || baseTarget.field };
    if (!file.type?.startsWith("image/")) {
      toast("请选择图片文件");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast("图片建议小于 12MB");
      return;
    }

    try {
      const image = await loadImageElement(file);
      const sourceAspect = image.naturalWidth / image.naturalHeight;
      const cropWidth = sourceAspect > target.aspect ? image.naturalHeight * target.aspect : image.naturalWidth;
      const cropHeight = sourceAspect > target.aspect ? image.naturalHeight : image.naturalWidth / target.aspect;
      if (cropWidth < target.minWidth || cropHeight < target.minHeight) {
        throw new Error(
          `图片太小，请选择至少 ${target.minWidth} × ${target.minHeight} px 的图片`
        );
      }

      const previewWidth = Math.min(
        kind === "card" ? 720 : kind === "wallpaper" ? 450 : kind === "sticker" ? 512 : 600,
        image.naturalWidth
      );
      imageEditorState = {
        kind,
        target,
        image,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        dragging: false,
        lastPointerX: 0,
        lastPointerY: 0
      };
      elements.imageEditorCanvas.width = Math.round(previewWidth);
      elements.imageEditorCanvas.height = Math.round(previewWidth / target.aspect);
      elements.imageEditorFrame.style.setProperty("--crop-aspect", String(target.aspect));
      elements.imageEditorFrame.style.setProperty("--crop-width", `${target.frameWidth}px`);
      elements.imageEditorTitle.textContent = target.title;
      elements.imageEditorDescription.textContent =
        kind === "wallpaper"
          ? "拖动图片调整画面位置，滑杆控制缩放。最终输出固定为竖屏壁纸尺寸。"
          : kind === "sticker"
            ? "拖动和缩放图片，补上一句喜欢的文字，做成自己的聊天表情。"
          : kind === "hero"
            ? "拖动人物图片调整主视觉取景，标题会放在独立玻璃层里保持清晰。"
          : ["card", "team", "stats"].includes(kind)
            ? "拖动图片调整这个板块的封面取景，滑杆控制缩放；与其他板块独立保存。"
            : "拖动图片选择头像中心，滑杆控制缩放。最终输出为正方形。";
      elements.imageOutputSize.textContent =
        `输出 ${target.outputWidth} × ${target.outputHeight} px · 原图至少 ${target.minWidth} × ${target.minHeight}`;
      elements.imageZoomRange.value = "100";
      elements.imageZoomLabel.textContent = "100%";
      elements.stickerTextControls.hidden = kind !== "sticker";
      if (kind === "sticker") {
        elements.stickerTextInput.value = "";
        elements.stickerTextSize.value = "34";
        setPickerSelection(elements.stickerTextColors, "stickerColor", "#ffffff");
      }
      centerImageEditor();
      openSheet(elements.imageEditorSheet);
      renderImageEditor();
    } catch (error) {
      toast(error.message || "图片读取失败");
    } finally {
      elements.wallpaperFile.value = "";
      elements.heroImageFile.value = "";
      elements.teamImageFile.value = "";
      elements.statsImageFile.value = "";
      elements.profileImageFile.value = "";
      elements.avatarFile.value = "";
      elements.cardImageFile.value = "";
      elements.rewardCardImageFile.value = "";
    }
  }

  function openMediaDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("xiaojii-media", 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("media")) database.createObjectStore("media");
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("无法打开本地视频存储"));
    });
  }

  async function getStoredProfileVideo() {
    const database = await openMediaDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("media", "readonly");
      const request = transaction.objectStore("media").get("profileVideo");
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
    });
  }

  async function setStoredProfileVideo(file) {
    const database = await openMediaDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("media", "readwrite");
      transaction.objectStore("media").put(file, "profileVideo");
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function deleteStoredProfileVideo() {
    const database = await openMediaDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("media", "readwrite");
      transaction.objectStore("media").delete("profileVideo");
      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function restoreProfileVideo() {
    if (!state.appearance.profileVideo) {
      elements.profileCard.classList.remove("has-video");
      return;
    }
    try {
      const blob = await getStoredProfileVideo();
      if (!blob) {
        state.appearance.profileVideo = false;
        saveState({ quiet: true });
        return;
      }
      if (profileVideoURL) URL.revokeObjectURL(profileVideoURL);
      profileVideoURL = URL.createObjectURL(blob);
      elements.profileCardVideo.src = profileVideoURL;
      elements.profileCardVideo.muted = true;
      elements.profileVideoSoundButton.textContent = "开启声音";
      elements.profileCardVideo.load();
      await elements.profileCardVideo.play().catch(() => {});
      elements.profileCard.classList.add("has-video");
    } catch (error) {
      console.warn("视频名片恢复失败", error);
      elements.profileCard.classList.remove("has-video");
    }
  }

  async function uploadProfileVideo(file) {
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type)) {
      toast("请选择 MP4 或 WebM 格式的视频");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast("视频请控制在 25MB 以内");
      return;
    }
    try {
      toast("正在保存名片视频");
      await setStoredProfileVideo(file);
      state.appearance.profileVideo = true;
      saveState({ quiet: true });
      await restoreProfileVideo();
      toast("“我的”名片已切换为视频背景");
      vibrate(12);
    } catch (error) {
      toast(error.message || "视频保存失败");
    } finally {
      elements.profileVideoFile.value = "";
    }
  }

  async function clearProfileVideo() {
    try {
      await deleteStoredProfileVideo();
    } catch {
      // 即使本地数据库清理失败，也关闭当前视频显示。
    }
    if (profileVideoURL) URL.revokeObjectURL(profileVideoURL);
    profileVideoURL = "";
    elements.profileCardVideo.removeAttribute("src");
    elements.profileCardVideo.load();
    elements.profileCardVideo.muted = true;
    elements.profileVideoSoundButton.textContent = "开启声音";
    elements.profileCard.classList.remove("has-video");
    state.appearance.profileVideo = false;
    saveState({ quiet: true });
    toast("已恢复静态名片背景");
  }

  function clampImageEditorOffsets() {
    if (!imageEditorState) return;
    const { image, zoom, target } = imageEditorState;
    const canvas = elements.imageEditorCanvas;
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom;
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    imageEditorState.offsetX = Math.min(0, Math.max(canvas.width - drawWidth, imageEditorState.offsetX));
    imageEditorState.offsetY = Math.min(0, Math.max(canvas.height - drawHeight, imageEditorState.offsetY));
  }

  function centerImageEditor() {
    if (!imageEditorState) return;
    const { image, zoom } = imageEditorState;
    const canvas = elements.imageEditorCanvas;
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom;
    imageEditorState.offsetX = (canvas.width - image.naturalWidth * scale) / 2;
    imageEditorState.offsetY = (canvas.height - image.naturalHeight * scale) / 2;
    clampImageEditorOffsets();
  }

  function drawStickerOverlay(context, width, height, scale = 1) {
    const text = elements.stickerTextInput.value.trim().slice(0, 12);
    if (!text) return;
    const color =
      elements.stickerTextColors.querySelector(".is-selected")?.dataset.stickerColor || "#ffffff";
    let fontSize = Number(elements.stickerTextSize.value) * scale;
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `800 ${fontSize}px "MiSans", "PingFang SC", sans-serif`;
    const maxWidth = width * 0.86;
    const measured = context.measureText(text).width;
    if (measured > maxWidth) {
      fontSize *= maxWidth / measured;
      context.font = `800 ${fontSize}px "MiSans", "PingFang SC", sans-serif`;
    }
    context.lineJoin = "round";
    context.strokeStyle = color === "#172d23" ? "rgba(255,255,255,.9)" : "rgba(15,31,21,.82)";
    context.lineWidth = Math.max(3, fontSize * 0.14);
    context.fillStyle = color;
    context.strokeText(text, width / 2, height * 0.8);
    context.fillText(text, width / 2, height * 0.8);
    context.restore();
  }

  function renderImageEditor() {
    if (!imageEditorState) return;
    const { image, zoom } = imageEditorState;
    const canvas = elements.imageEditorCanvas;
    const context = canvas.getContext("2d");
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom;
    clampImageEditorOffsets();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#e7e6df";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      imageEditorState.offsetX,
      imageEditorState.offsetY,
      image.naturalWidth * scale,
      image.naturalHeight * scale
    );
    if (imageEditorState.kind === "sticker") {
      drawStickerOverlay(
        context,
        canvas.width,
        canvas.height,
        canvas.width / imageEditorState.target.outputWidth
      );
    }
    elements.imageZoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function updateImageEditorZoom(value) {
    if (!imageEditorState) return;
    const canvas = elements.imageEditorCanvas;
    const { image, zoom: oldZoom } = imageEditorState;
    const nextZoom = clamp(Number(value) / 100, 1, 3);
    const oldScale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * oldZoom;
    const nextScale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * nextZoom;
    const focusX = (canvas.width / 2 - imageEditorState.offsetX) / oldScale;
    const focusY = (canvas.height / 2 - imageEditorState.offsetY) / oldScale;
    imageEditorState.zoom = nextZoom;
    imageEditorState.offsetX = canvas.width / 2 - focusX * nextScale;
    imageEditorState.offsetY = canvas.height / 2 - focusY * nextScale;
    renderImageEditor();
  }

  function saveImageEditor() {
    if (!imageEditorState) return;
    const { kind, image, zoom, target, offsetX, offsetY } = imageEditorState;
    const previewCanvas = elements.imageEditorCanvas;
    const output = document.createElement("canvas");
    output.width = target.outputWidth;
    output.height = target.outputHeight;
    const context = output.getContext("2d");
    const previewScale = Math.max(
      previewCanvas.width / image.naturalWidth,
      previewCanvas.height / image.naturalHeight
    ) * zoom;
    const outputScale = Math.max(output.width / image.naturalWidth, output.height / image.naturalHeight) * zoom;
    const ratio = output.width / previewCanvas.width;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      offsetX * ratio,
      offsetY * ratio,
      image.naturalWidth * outputScale,
      image.naturalHeight * outputScale
    );
    if (kind === "sticker") drawStickerOverlay(context, output.width, output.height, 1);
    let imageData = output.toDataURL("image/jpeg", kind === "wallpaper" ? 0.82 : 0.86);
    if (imageData.length > 3_400_000) imageData = output.toDataURL("image/jpeg", 0.68);
    if (kind === "sticker") {
      customStickers.push(imageData);
      customStickers = customStickers.slice(-8);
      saveCustomStickers();
      imageEditorState = null;
      closeSheets();
      if (stickerUploadContext === "group") {
        currentGroupEmojiTab = "custom";
        elements.groupEmojiPanel.hidden = false;
        renderGroupEmojiPicker();
      } else {
        currentEmojiTab = "custom";
        openSheet(elements.directChatSheet);
        elements.directEmojiPanel.hidden = false;
        renderEmojiPicker();
        void refreshDirectChat();
      }
      toast("自定义表情已保存");
      vibrate(12);
      return;
    }
    state.appearance[target.field] = imageData;
    saveState({ quiet: true });
    imageEditorState = null;
    closeSheets();
    renderAll();
    vibrate(12);
    toast(
      target.field === "avatarImage"
        ? "头像已更新，名片封面没有变化"
        : target.field === "cardImage"
          ? "小名片封面已更新"
          : target.field === "heroImage"
            ? "首页主背景板已更新"
            : target.field === "teamImage"
              ? "同行板块名片已更新"
              : target.field === "statsImage"
                ? "记录板块名片已更新"
          : target.field === "rewardCardImage"
            ? "成长奖励封面已保存"
            : "应用壁纸已更新"
    );
  }

  async function uploadWallpaper(file) {
    await openImageEditor("wallpaper", file);
  }

  function heroCoverIsUnlocked() {
    if (previewUnlocked) return true;
    const stats = growthStats();
    return stats.activeDays >= 3 || stats.exerciseMinutes >= 90;
  }

  async function uploadHeroImage(file) {
    if (!heroCoverIsUnlocked()) {
      const stats = growthStats();
      toast(
        `主背景封面还差 ${Math.max(0, 3 - stats.activeDays)} 天` +
          `或 ${Math.max(0, 90 - stats.exerciseMinutes)} 分钟解锁`
      );
      return;
    }
    await openImageEditor("hero", file);
  }

  async function uploadTeamImage(file) {
    await openImageEditor("team", file);
  }

  async function uploadStatsImage(file) {
    await openImageEditor("stats", file);
  }

  async function uploadProfileImage(file) {
    await openImageEditor("avatar", file);
  }

  function clearProfileImage() {
    state.appearance.avatarImage = "";
    saveState({ quiet: true });
    renderAll();
    toast("已恢复默认头像");
  }

  async function uploadCardImage(file) {
    await openImageEditor("card", file);
  }

  async function uploadRewardCover(file) {
    await openImageEditor("card", file, { fieldOverride: "rewardCardImage" });
  }

  function clearCardImage() {
    state.appearance.cardImage = "";
    saveState({ quiet: true });
    renderAll();
    toast("已移除名片封面图");
  }

  function clearHeroImage() {
    state.appearance.heroImage = "";
    saveState({ quiet: true });
    renderAll();
    toast("已恢复默认首页主背景");
  }

  function clearTeamImage() {
    state.appearance.teamImage = "";
    saveState({ quiet: true });
    renderAll();
    toast("已恢复同行板块默认名片");
  }

  function clearStatsImage() {
    state.appearance.statsImage = "";
    saveState({ quiet: true });
    renderAll();
    toast("已恢复记录板块默认名片");
  }

  function updateRewardRequirement(value) {
    const [days, minutes] = String(value).split(":").map(Number);
    state.appearance.rewardDays = clamp(days || 7, 1, 365);
    state.appearance.rewardMinutes = clamp(minutes || 150, 1, 10000);
    saveState({ quiet: true });
    renderAppearance();
  }

  function applyRewardCover() {
    const image = state.appearance.rewardCardImage;
    if (!image) {
      toast("请先上传一张成长奖励封面");
      return;
    }
    const stats = growthStats();
    if (
      !previewUnlocked &&
      stats.activeDays < state.appearance.rewardDays &&
      stats.exerciseMinutes < state.appearance.rewardMinutes
    ) {
      toast(
        `还未解锁，还差 ${Math.max(0, state.appearance.rewardDays - stats.activeDays)} 天` +
          `或 ${Math.max(0, state.appearance.rewardMinutes - stats.exerciseMinutes)} 分钟`
      );
      return;
    }
    state.appearance.cardImage = image;
    saveState({ quiet: true });
    renderAll();
    toast("成长奖励封面已使用");
    vibrate(12);
  }

  function clearRewardCover() {
    state.appearance.rewardCardImage = "";
    saveState({ quiet: true });
    renderAll();
    toast("已移除成长奖励图");
  }

  function openTeamForm(mode = "create", code = "") {
    const isJoin = mode === "join";
    elements.teamForm.reset();
    elements.teamFormMode.value = isJoin ? "join" : "create";
    elements.teamFormKicker.textContent = isJoin ? "JOIN YOUR TEAM" : "START TOGETHER";
    elements.teamFormTitle.textContent = isJoin ? "加入打卡小组" : "创建打卡小组";
    elements.teamFormDescription.textContent = isJoin
      ? "输入同事发来的邀请码，我们从今天开始一起坚持。"
      : "给小组起个名字，再把邀请链接发给同事。";
    elements.teamNameField.hidden = isJoin;
    elements.teamCodeField.hidden = !isJoin;
    elements.teamNameInput.required = !isJoin;
    elements.teamCodeInput.required = isJoin;
    elements.teamCodeInput.value = code.toUpperCase().slice(0, 6);
    elements.teamMemberNameInput.value =
      state.profile.name && state.profile.name !== "打卡人" ? state.profile.name : "";
    elements.teamFormHint.textContent = isJoin
      ? "加入后，你今天的打卡会立即同步到小组。"
      : "无需注册，创建后会立即生成分享链接。";
    elements.teamFormSubmit.textContent = isJoin ? "加入并开始打卡" : "创建并邀请同事";
    openSheet(elements.teamFormSheet);
  }

  function inviteURL() {
    if (!state.team) return window.location.href;
    const url = new URL(".", window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("team", state.team.code);
    return url.toString();
  }

  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const input = document.createElement("textarea");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      toast(successMessage);
      vibrate(9);
    } catch {
      toast("复制失败，请长按邀请码手动复制");
    }
  }

  async function shareTeam() {
    if (!state.team) {
      toast("请先创建或加入一个打卡小组");
      return;
    }
    const url = inviteURL();
    const shareData = {
      title: `加入「${state.team.name}」一起打卡`,
      text: `我在小迹打卡小组等你，一起把每天的小目标坚持下来。邀请码：${state.team.code}`,
      url
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    await copyText(url, "邀请链接已复制，发给同事即可");
  }

  async function submitTeamForm(event) {
    event.preventDefault();
    const mode = elements.teamFormMode.value;
    const memberName = elements.teamMemberNameInput.value.trim();
    const teamName = elements.teamNameInput.value.trim();
    const code = elements.teamCodeInput.value.trim().toUpperCase();
    if (!memberName || (mode === "create" ? !teamName : code.length !== 6)) {
      toast(mode === "create" ? "请填写完整的小组信息" : "请输入 6 位邀请码");
      return;
    }

    const originalText = elements.teamFormSubmit.textContent;
    elements.teamFormSubmit.disabled = true;
    elements.teamFormSubmit.textContent = mode === "create" ? "正在创建..." : "正在加入...";
    try {
      const payload = await apiRequest(mode === "create" ? "./api/teams" : "./api/teams/join", {
        method: "POST",
        body: JSON.stringify(
          mode === "create"
            ? { teamName, memberName }
            : { code, memberName }
        )
      });
      applyTeamSession(payload);
      closeSheets();
      autoJoinCode = "";
      const cleanURL = new URL(window.location.href);
      cleanURL.searchParams.delete("team");
      window.history.replaceState({}, "", cleanURL);
      switchPage("team");
      toast(mode === "create" ? "打卡小组创建成功" : `已加入「${payload.team.name}」`);
      void updateTeamPresence(true);
      void syncTodayToTeam();
    } catch (error) {
      toast(error.message || "操作失败，请稍后重试");
    } finally {
      elements.teamFormSubmit.disabled = false;
      elements.teamFormSubmit.textContent = originalText;
    }
  }

  async function leaveTeam() {
    if (!state.team) return;
    const leavingTeam = state.team;
    requestConfirm({
      title: `退出「${leavingTeam.name}」？`,
      description: "你的个人打卡记录不会删除，但同事将不再看到你的小组进度。以后仍可用邀请码重新加入。",
      actionText: "退出小组",
      onConfirm: async () => {
        await updateTeamPresence(false);
        try {
          await apiRequest(
            `./api/teams/${encodeURIComponent(leavingTeam.id)}/members/me`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${leavingTeam.memberToken}` }
            }
          );
        } catch {
          // 本地仍允许退出，避免用户被失去网络连接的小组困住。
        }
        state.team = null;
        state.teamSnapshot = null;
        teamSyncStatus = "idle";
        saveState();
        closeSheets();
        renderAll();
        toast("已退出打卡小组");
      }
    });
  }

  function exportData() {
    const backup = {
      ...state,
      exportedAt: new Date().toISOString(),
      app: "小迹打卡"
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `小迹打卡备份-${dateKey(new Date())}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 500);
    toast("备份文件已生成");
    vibrate(10);
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = normalizeState(JSON.parse(String(reader.result)));
        state = imported;
        saveState();
        renderAll();
        toast("备份已恢复");
        vibrate(15);
      } catch (error) {
        toast(error.message || "备份文件无法读取");
      } finally {
        elements.importFile.value = "";
      }
    };
    reader.onerror = () => toast("读取备份失败");
    reader.readAsText(file);
  }

  function handleQuickCheck(id) {
    const habit = getHabit(id);
    if (!habit) return;
    const current = getValue(dateKey(new Date()), id);
    if (current >= habit.target) {
      openHabitDetail(id);
      toast("这项已完成，可在详情中调整");
      return;
    }
    updateRecord(id, Math.min(current + habit.step, habit.target));
  }

  function attachEvents() {
    document.querySelectorAll(".nav-item").forEach((button) => {
      button.addEventListener("click", () => switchPage(button.dataset.nav));
    });
    elements.avatarButton.addEventListener("click", openAvatarSheet);
    elements.profileAvatar.addEventListener("click", openAvatarSheet);
    elements.selectAvatarButton.addEventListener("click", () => elements.avatarFile.click());
    elements.avatarFile.addEventListener("change", (event) => uploadProfileImage(event.target.files?.[0]));
    elements.defaultAvatarButton.addEventListener("click", clearProfileImage);
    elements.openNamecardButton.addEventListener("click", () => {
      closeSheets();
      switchPage("profile");
    });
    elements.addHabitButton.addEventListener("click", () => openHabitForm());
    elements.profileAddHabit.addEventListener("click", () => openHabitForm());
    elements.manageHabitsButton.addEventListener("click", () => {
      elements.manageHabitList.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    elements.profileSettingsButton.addEventListener("click", openProfileForm);
    elements.statusSuggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-profile-status]");
      if (!button) return;
      elements.profileStatusInput.value = button.dataset.profileStatus;
      vibrate(5);
    });
    elements.customizeButton.addEventListener("click", openCustomizeSheet);
    elements.wallpaperPresets.addEventListener("click", (event) => {
      const button = event.target.closest("[data-wallpaper]");
      if (button) selectWallpaper(button.dataset.wallpaper);
    });
    elements.motionWallpapers.addEventListener("click", (event) => {
      const button = event.target.closest("[data-motion-wallpaper]");
      if (button) selectMotionWallpaper(button.dataset.motionWallpaper);
    });
    elements.avatarEffectOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-avatar-effect]");
      if (button) selectAvatarEffect(button.dataset.avatarEffect);
    });
    elements.uploadWallpaperButton.addEventListener("click", () => elements.wallpaperFile.click());
    elements.wallpaperFile.addEventListener("change", (event) => uploadWallpaper(event.target.files?.[0]));
    elements.uploadHeroImageButton.addEventListener("click", () => {
      if (!heroCoverIsUnlocked()) {
        const stats = growthStats();
        toast(
          `主背景封面还差 ${Math.max(0, 3 - stats.activeDays)} 天` +
            `或 ${Math.max(0, 90 - stats.exerciseMinutes)} 分钟解锁`
        );
        return;
      }
      elements.heroImageFile.click();
    });
    elements.heroImageFile.addEventListener("change", (event) => uploadHeroImage(event.target.files?.[0]));
    elements.clearHeroImageButton.addEventListener("click", clearHeroImage);
    elements.uploadTeamImageButton.addEventListener("click", () => elements.teamImageFile.click());
    elements.teamImageFile.addEventListener("change", (event) => uploadTeamImage(event.target.files?.[0]));
    elements.clearTeamImageButton.addEventListener("click", clearTeamImage);
    elements.uploadStatsImageButton.addEventListener("click", () => elements.statsImageFile.click());
    elements.statsImageFile.addEventListener("change", (event) => uploadStatsImage(event.target.files?.[0]));
    elements.clearStatsImageButton.addEventListener("click", clearStatsImage);
    elements.uploadProfileImageButton.addEventListener("click", () => elements.profileImageFile.click());
    elements.profileImageFile.addEventListener("change", (event) => uploadProfileImage(event.target.files?.[0]));
    elements.clearProfileImageButton.addEventListener("click", clearProfileImage);
    elements.uploadCardImageButton.addEventListener("click", () => elements.cardImageFile.click());
    elements.cardImageFile.addEventListener("change", (event) => uploadCardImage(event.target.files?.[0]));
    elements.clearCardImageButton.addEventListener("click", clearCardImage);
    elements.uploadProfileVideoButton.addEventListener("click", () => elements.profileVideoFile.click());
    elements.profileVideoFile.addEventListener("change", (event) =>
      uploadProfileVideo(event.target.files?.[0])
    );
    elements.clearProfileVideoButton.addEventListener("click", () => void clearProfileVideo());
    elements.profileVideoSoundButton.addEventListener("click", async () => {
      if (!elements.profileCardVideo.src) return;
      const shouldUnmute = elements.profileCardVideo.muted;
      elements.profileCardVideo.muted = !shouldUnmute;
      elements.profileVideoSoundButton.textContent = shouldUnmute ? "关闭声音" : "开启声音";
      if (shouldUnmute) await elements.profileCardVideo.play().catch(() => {});
    });
    elements.uploadRewardCoverButton.addEventListener("click", () => elements.rewardCardImageFile.click());
    elements.rewardCardImageFile.addEventListener("change", (event) =>
      uploadRewardCover(event.target.files?.[0])
    );
    elements.rewardRequirementSelect.addEventListener("change", (event) =>
      updateRewardRequirement(event.target.value)
    );
    elements.applyRewardCoverButton.addEventListener("click", applyRewardCover);
    elements.clearRewardCoverButton.addEventListener("click", clearRewardCover);
    elements.imageZoomRange.addEventListener("input", (event) => updateImageEditorZoom(event.target.value));
    elements.stickerTextInput.addEventListener("input", renderImageEditor);
    elements.stickerTextSize.addEventListener("input", renderImageEditor);
    elements.stickerTextColors.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sticker-color]");
      if (!button) return;
      setPickerSelection(elements.stickerTextColors, "stickerColor", button.dataset.stickerColor);
      renderImageEditor();
    });
    elements.resetImageEditorButton.addEventListener("click", () => {
      if (!imageEditorState) return;
      imageEditorState.zoom = 1;
      elements.imageZoomRange.value = "100";
      centerImageEditor();
      renderImageEditor();
    });
    elements.saveImageEditorButton.addEventListener("click", saveImageEditor);
    elements.imageEditorCanvas.addEventListener("pointerdown", (event) => {
      if (!imageEditorState) return;
      event.preventDefault();
      imageEditorState.dragging = true;
      imageEditorState.lastPointerX = event.clientX;
      imageEditorState.lastPointerY = event.clientY;
      elements.imageEditorCanvas.setPointerCapture(event.pointerId);
    });
    elements.imageEditorCanvas.addEventListener("pointermove", (event) => {
      if (!imageEditorState?.dragging) return;
      const canvas = elements.imageEditorCanvas;
      const deltaX = (event.clientX - imageEditorState.lastPointerX) * (canvas.width / canvas.clientWidth);
      const deltaY = (event.clientY - imageEditorState.lastPointerY) * (canvas.height / canvas.clientHeight);
      imageEditorState.offsetX += deltaX;
      imageEditorState.offsetY += deltaY;
      imageEditorState.lastPointerX = event.clientX;
      imageEditorState.lastPointerY = event.clientY;
      renderImageEditor();
    });
    const stopImageDrag = (event) => {
      if (!imageEditorState) return;
      imageEditorState.dragging = false;
      if (elements.imageEditorCanvas.hasPointerCapture(event.pointerId)) {
        elements.imageEditorCanvas.releasePointerCapture(event.pointerId);
      }
    };
    elements.imageEditorCanvas.addEventListener("pointerup", stopImageDrag);
    elements.imageEditorCanvas.addEventListener("pointercancel", stopImageDrag);
    elements.imageEditorCanvas.addEventListener(
      "wheel",
      (event) => {
        if (!imageEditorState) return;
        event.preventDefault();
        const next = clamp(Number(elements.imageZoomRange.value) - event.deltaY * 0.25, 100, 300);
        elements.imageZoomRange.value = String(next);
        updateImageEditorZoom(next);
      },
      { passive: false }
    );
    elements.focusButton.addEventListener("click", toggleFocus);
    elements.focusResetButton.addEventListener("click", resetFocus);
    elements.editIntentionButton.addEventListener("click", openIntentionForm);
    elements.intentionCheckButton.addEventListener("click", toggleIntentionDone);
    elements.intentionSuggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-intention]");
      if (button) elements.intentionInput.value = button.dataset.intention;
    });
    elements.intentionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = elements.intentionInput.value.trim().slice(0, 40);
      if (!text) return;
      state.intentions ||= {};
      state.intentions[dateKey(new Date())] = { text, done: false };
      saveState({ quiet: true });
      closeSheets();
      renderIntention();
      toast("今日自律目标已设定");
      vibrate(10);
    });
    elements.studyPresets.addEventListener("click", (event) => {
      const button = event.target.closest("[data-study-template]");
      if (button) addStudyTemplate(button.dataset.studyTemplate);
    });
    elements.installAppButton.addEventListener("click", openInstallSheet);
    elements.createTeamButton.addEventListener("click", () => openTeamForm("create"));
    elements.joinTeamButton.addEventListener("click", () => openTeamForm("join"));
    elements.teamAvatarStack.addEventListener("click", () => openTeamForm("create"));
    elements.teamHeaderButton.addEventListener("click", () => {
      if (state.team) {
        void shareTeam();
      } else {
        openTeamForm("create");
      }
    });
    elements.copyTeamCodeButton.addEventListener("click", () => {
      if (state.team) void copyText(state.team.code, "邀请码已复制");
    });
    elements.shareTeamButton.addEventListener("click", () => void shareTeam());
    elements.refreshTeamButton.addEventListener("click", () => loadTeamData());
    elements.teamPresenceButton.addEventListener("click", () => {
      if (!state.team) return;
      state.team.showPresence = state.team.showPresence === false;
      saveState({ quiet: true });
      renderTeam();
      void updateTeamPresence(state.team.showPresence);
      toast(state.team.showPresence ? "同事现在可以看到你在线" : "已隐藏你的在线状态");
    });
    elements.teamChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      void sendTeamMessage(elements.teamChatInput.value);
    });
    elements.chatQuickActions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-quick-chat]");
      if (button) void sendTeamMessage(button.dataset.quickChat);
    });
    elements.groupEmojiButton.addEventListener("click", () => {
      elements.groupEmojiPanel.hidden = !elements.groupEmojiPanel.hidden;
      if (!elements.groupEmojiPanel.hidden) renderGroupEmojiPicker();
    });
    elements.groupImageButton.addEventListener("click", () => openChatAttachmentMenu("group"));
    elements.groupImageFile.addEventListener("change", (event) => sendGroupPhoto(event.target.files?.[0]));
    elements.groupEmojiTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-group-emoji-tab]");
      if (!button) return;
      currentGroupEmojiTab = button.dataset.groupEmojiTab;
      renderGroupEmojiPicker();
    });
    elements.groupEmojiGrid.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-group-remove-sticker]");
      if (removeButton) {
        customStickers.splice(Number(removeButton.dataset.groupRemoveSticker), 1);
        saveCustomStickers();
        renderGroupEmojiPicker();
        return;
      }
      const sticker = event.target.closest("[data-group-send-sticker]");
      if (sticker) {
        const image = customStickers[Number(sticker.dataset.groupSendSticker)];
        if (image) void sendCustomSticker(image, "");
        return;
      }
      const emoji = event.target.closest("[data-group-emoji]");
      if (emoji) {
        elements.teamChatInput.value += emoji.dataset.groupEmoji;
        elements.teamChatInput.focus();
      }
    });
    elements.groupUploadStickerButton.addEventListener("click", () => {
      stickerUploadContext = "group";
      elements.customStickerFile.click();
    });
    elements.uploadStickerButton.addEventListener("click", () => {
      stickerUploadContext = "direct";
      elements.customStickerFile.click();
    });
    elements.customStickerFile.addEventListener("change", (event) =>
      uploadCustomSticker(event.target.files?.[0], stickerUploadContext)
    );
    elements.directChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      void sendDirectChat(elements.directChatInput.value);
    });
    elements.cancelDirectEditButton.addEventListener("click", cancelDirectEditing);
    elements.emojiButton.addEventListener("click", () => {
      elements.directEmojiPanel.hidden = !elements.directEmojiPanel.hidden;
      if (!elements.directEmojiPanel.hidden) renderEmojiPicker();
    });
    elements.stickerButton.addEventListener("click", () => {
      currentEmojiTab = "custom";
      elements.directEmojiPanel.hidden = false;
      renderEmojiPicker();
    });
    elements.directPhotoButton.addEventListener("click", () => openChatAttachmentMenu("direct"));
    elements.directPhotoFile.addEventListener("change", (event) => sendDirectPhoto(event.target.files?.[0]));
    elements.chatTakePhotoButton.addEventListener("click", () => {
      closeSheets();
      elements.chatCameraFile.click();
    });
    elements.chatRecordVideoButton.addEventListener("click", () => {
      closeSheets();
      elements.chatRecordVideoFile.click();
    });
    elements.chatChoosePhotoButton.addEventListener("click", () => {
      closeSheets();
      elements.chatGalleryPhotoFile.click();
    });
    elements.chatChooseVideoButton.addEventListener("click", () => {
      closeSheets();
      elements.chatGalleryVideoFile.click();
    });
    [
      elements.chatCameraFile,
      elements.chatGalleryPhotoFile
    ].forEach((input) =>
      input.addEventListener("change", (event) =>
        handleChatMediaFile(event.target.files?.[0], chatMediaContext)
      )
    );
    [
      elements.chatRecordVideoFile,
      elements.chatGalleryVideoFile
    ].forEach((input) =>
      input.addEventListener("change", (event) =>
        handleChatMediaFile(event.target.files?.[0], chatMediaContext)
      )
    );
    elements.emojiTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-emoji-tab]");
      if (!button) return;
      currentEmojiTab = button.dataset.emojiTab;
      renderEmojiPicker();
    });
    elements.emojiGrid.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-sticker]");
      if (removeButton) {
        customStickers.splice(Number(removeButton.dataset.removeSticker), 1);
        saveCustomStickers();
        renderEmojiPicker();
        return;
      }
      const stickerButton = event.target.closest("[data-send-sticker]");
      if (stickerButton) {
        const sticker = customStickers[Number(stickerButton.dataset.sendSticker)];
        if (sticker) void sendCustomSticker(sticker);
        return;
      }
      const emojiButton = event.target.closest("[data-emoji]");
      if (!emojiButton) return;
      const emoji = emojiButton.dataset.emoji;
      if (editingDirectMessageId || elements.directChatInput.value.trim()) {
        elements.directChatInput.value += emoji;
        elements.directChatInput.focus();
      } else {
        void sendDirectChat(emoji);
      }
    });
    elements.memberCardChatButton.addEventListener("click", () => {
      if (!activeMemberCardId || activeMemberCardId === state.team?.memberId) {
        toast("这是你自己的名片");
        return;
      }
      openDirectChat(activeMemberCardId);
    });
    elements.leaveTeamButton.addEventListener("click", () => void leaveTeam());
    elements.teamForm.addEventListener("submit", submitTeamForm);
    elements.teamCodeInput.addEventListener("input", () => {
      elements.teamCodeInput.value = elements.teamCodeInput.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    });
    elements.exportButton.addEventListener("click", exportData);
    elements.importButton.addEventListener("click", () => elements.importFile.click());
    elements.importFile.addEventListener("change", (event) => importData(event.target.files?.[0]));
    elements.hapticToggle.addEventListener("change", () => {
      state.preferences.haptics = elements.hapticToggle.checked;
      saveState({ quiet: true });
      if (state.preferences.haptics) vibrate(12);
    });
    elements.clearButton.addEventListener("click", () => {
      requestConfirm({
        title: "清空所有打卡记录？",
        description: "累计天数、连续记录和图表都会被清空，此操作不能撤销。习惯设置会保留。",
        actionText: "确认清空",
        onConfirm: () => {
          state.records = {};
          if (state.team) void syncTodayToTeam();
          saveState();
          closeSheets();
          renderAll();
          toast("打卡记录已清空");
        }
      });
    });

    elements.statsMenuButton.addEventListener("click", () => {
      toast("深色柱代表当天完成项目更多");
    });

    elements.prevMonth.addEventListener("click", () => {
      currentMonth = addMonths(currentMonth, -1);
      renderCalendar();
    });
    elements.nextMonth.addEventListener("click", () => {
      const next = addMonths(currentMonth, 1);
      const thisMonth = startOfMonth(new Date());
      if (next > thisMonth) {
        toast("未来的日子，留给未来去完成");
        return;
      }
      currentMonth = next;
      renderCalendar();
    });

    elements.sheetBackdrop.addEventListener("click", () => closeSheets());
    document.querySelectorAll("[data-close-sheet]").forEach((button) => {
      button.addEventListener("click", () => closeSheets());
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSheets();
    });

    elements.detailMinus.addEventListener("click", () => {
      const habit = getHabit(activeHabitId);
      if (!habit) return;
      updateRecord(habit.id, getValue(dateKey(new Date()), habit.id) - habit.step, { celebrate: false });
    });
    elements.detailPlus.addEventListener("click", () => {
      const habit = getHabit(activeHabitId);
      if (!habit) return;
      updateRecord(habit.id, getValue(dateKey(new Date()), habit.id) + habit.step);
    });
    elements.detailCheckButton.addEventListener("click", () => {
      const habit = getHabit(activeHabitId);
      if (!habit) return;
      saveHabitNote(habit.id, { quiet: true });
      updateRecord(habit.id, habit.target);
    });
    elements.detailNote.addEventListener("change", () => {
      if (activeHabitId) saveHabitNote(activeHabitId);
    });
    elements.detailNote.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        elements.detailNote.blur();
      }
    });
    elements.detailResetButton.addEventListener("click", () => {
      const habit = getHabit(activeHabitId);
      if (!habit) return;
      updateRecord(habit.id, 0, { celebrate: false });
      elements.detailNote.value = "";
      saveHabitNote(habit.id, { quiet: true });
      toast("今天的记录已重置");
    });

    elements.iconPicker.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-icon]");
      if (button) setPickerSelection(elements.iconPicker, "icon", button.dataset.icon);
    });
    elements.colorPicker.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-color]");
      if (button) setPickerSelection(elements.colorPicker, "color", button.dataset.color);
    });
    document.querySelectorAll('input[name="habitMode"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        elements.countFields.hidden = radio.value === "boolean";
      });
    });
    elements.habitForm.addEventListener("submit", saveHabitFromForm);

    elements.profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = elements.profileNameInput.value.trim();
      if (!name) return;
      state.profile.name = name.slice(0, 12);
      state.profile.status = elements.profileStatusInput.value.trim().slice(0, 24) || "专注中";
      state.profile.motto =
        elements.profileMottoInput.value.trim().slice(0, 36) || "把普通的日子，过成自己的作品。";
      saveState();
      closeSheets();
      renderAll();
      if (state.team) void updateTeamPresence(state.team.showPresence !== false);
      toast("状态和签名已更新");
    });
    elements.confirmCancel.addEventListener("click", () => closeSheets());
    elements.confirmAction.addEventListener("click", () => {
      const handler = confirmHandler;
      if (handler) handler();
    });

    elements.nativeInstallButton.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === "accepted") {
        toast("正在添加到手机桌面");
      }
      deferredInstallPrompt = null;
      closeSheets();
      renderProfile();
    });

    document.addEventListener("click", (event) => {
      const dayButton = event.target.closest("[data-date]");
      if (dayButton) {
        const key = dayButton.dataset.date;
        if (key !== dateKey(new Date())) {
          openDayDetail(key);
        } else {
          switchPage("today");
          openDayDetail(key);
        }
        return;
      }

      const calendarButton = event.target.closest("[data-calendar-date]");
      if (calendarButton) {
        selectedCalendarDate = calendarButton.dataset.calendarDate;
        renderCalendar();
        openDayDetail(selectedCalendarDate);
        return;
      }

      const directChatButton = event.target.closest("[data-direct-chat]");
      if (directChatButton) {
        openDirectChat(directChatButton.dataset.directChat);
        return;
      }

      const memberCardButton = event.target.closest("[data-member-card]");
      if (memberCardButton) {
        openMemberCard(memberCardButton.dataset.memberCard);
        return;
      }

      const editMessageButton = event.target.closest("[data-edit-message]");
      if (editMessageButton) {
        beginEditDirectMessage(editMessageButton.dataset.editMessage);
        return;
      }

      const quickCheck = event.target.closest("[data-quick-check]");
      if (quickCheck) {
        event.preventDefault();
        handleQuickCheck(quickCheck.dataset.quickCheck);
        return;
      }

      const openHabit = event.target.closest("[data-open-habit]");
      if (openHabit) {
        openHabitDetail(openHabit.dataset.openHabit);
        return;
      }

      const editHabit = event.target.closest("[data-edit-habit]");
      if (editHabit) {
        openHabitForm(getHabit(editHabit.dataset.editHabit));
        return;
      }

      const deleteButton = event.target.closest("[data-delete-habit]");
      if (deleteButton) {
        deleteHabit(deleteButton.dataset.deleteHabit);
      }
    });

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      renderProfile();
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      toast("小迹已安装到手机");
      renderProfile();
    });
    window.addEventListener("online", () => {
      if (state.team) {
        void updateTeamPresence(true);
        void syncTodayToTeam();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshDateIfNeeded();
      if (!document.hidden && activePage === "team" && state.team) loadTeamData({ quiet: true });
      if (state.team) void updateTeamPresence(!document.hidden);
    });
    window.addEventListener("pagehide", () => {
      if (state.team) void updateTeamPresence(false, { keepalive: true });
    });
    window.setInterval(refreshDateIfNeeded, 60_000);
    window.setInterval(() => {
      if (document.visibilityState === "visible" && activePage === "team" && state.team) {
        loadTeamData({ quiet: true });
        if (!elements.directChatSheet.hidden && directChatTargetId) void refreshDirectChat();
      }
    }, 12_000);
    window.setInterval(() => {
      if (document.visibilityState === "visible" && state.team?.showPresence !== false) {
        void updateTeamPresence(true);
      }
    }, 25_000);
  }

  function refreshDateIfNeeded() {
    const currentDay = dateKey(new Date());
    if (currentDay !== lastKnownDay) {
      lastKnownDay = currentDay;
      selectedCalendarDate = currentDay;
      currentMonth = startOfMonth(new Date());
      renderAll();
    } else {
      renderHeader();
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !["http:", "https:"].includes(window.location.protocol)) return;
    const hadController = Boolean(navigator.serviceWorker.controller);
    let refreshingForUpdate = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || refreshingForUpdate) return;
      refreshingForUpdate = true;
      window.location.reload();
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          void registration.update();
          window.setInterval(() => {
            if (navigator.onLine) void registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.warn("离线功能注册失败", error);
        });
    });
  }

  function init() {
    saveState({ quiet: true });
    attachEvents();
    renderAll();
    restoreFocusTimer();
    void restoreProfileVideo();
    loadCustomStickers();
    registerServiceWorker();
    if (state.team) window.setTimeout(() => void updateTeamPresence(true), 300);
    if (state.team?.pendingSync) window.setTimeout(() => void syncTodayToTeam(), 500);
    if (autoJoinCode && state.team?.code !== autoJoinCode) {
      switchPage("team");
      window.setTimeout(() => openTeamForm("join", autoJoinCode), 250);
    } else if (autoJoinCode && state.team?.code === autoJoinCode) {
      switchPage("team");
    }
  }

  init();
})();
