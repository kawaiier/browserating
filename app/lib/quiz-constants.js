export const TRAIT_META = {
  privacy: {
    label: 'Privacy',
    description: 'How well the browser protects you from tracking and data collection',
    icon: 'shield',
  },
  speed: {
    label: 'Speed',
    description: 'Qualitative browsing-speed estimate, not based on Speedometer benchmarks.',
    icon: 'zap',
  },
  customization: {
    label: 'Customization',
    description: 'How deeply you can configure the UI, shortcuts, and behavior',
    icon: 'sliders-horizontal',
  },
  minimalism: {
    label: 'Minimalism',
    description: "How clean and distraction-free the browser's interface is",
    icon: 'circle',
  },
  features: {
    label: 'Built-in Features',
    description: 'How much comes included — VPN, ad blocker, sidebar, AI, sync, and more',
    icon: 'layout-dashboard',
  },
  openSource: {
    label: 'Open Source',
    description: "Whether the browser's code is publicly auditable and community-governed",
    icon: 'code-2',
  },
  resourceEfficiency: {
    label: 'Resource Efficiency',
    description: 'Qualitative estimate, not standardized RAM, CPU, or battery testing.',
    icon: 'battery-charging',
  },
  ecosystem: {
    label: 'Ecosystem Integration',
    description: 'How well the browser fits into your existing OS and service ecosystem',
    icon: 'cloud',
  },
  innovation: {
    label: 'Innovation',
    description: 'How much the browser rethinks or reinvents the browsing experience',
    icon: 'sparkles',
  },
  easeOfUse: {
    label: 'Ease of Use',
    description: 'How beginner-friendly and low-friction the browser is out of the box',
    icon: 'smile',
  },
  ai: {
    label: 'AI Integration',
    description: 'How deeply AI assistants and agents are built into the browser',
    icon: 'bot',
  },
};

export const TRAIT_KEYS = Object.keys(TRAIT_META);

// Intro screen copy
export const QUIZ_INTRO_COPY = {
  headline: 'Find Your Perfect Browser',
  subheadline: (questionCount) =>
    `Answer ${questionCount} quick questions and we'll match you with the browser that actually fits the way you browse.`,
  bullets: (questionCount) => [
    { icon: 'list-checks', text: `${questionCount} questions, about 2 minutes` },
    {
      icon: 'sliders-horizontal',
      text: 'Covers privacy, speed, features, and your browsing style',
    },
    { icon: 'trophy', text: 'See your top browser match and two alternatives' },
  ],
  cta: 'Start the Quiz',
};

// Social share copy
export const SHARE_COPY = {
  twitter: (browserName) => `My browser match is ${browserName}! 🎯 Find your perfect browser:`,
  copySuccess: 'Link copied!',
  copyLabel: 'Copy link',
  copyErrorLabel: 'Copy failed',
  copyFailure: "Couldn't copy the link. Select it below to copy it manually.",
  nativeShareTitle: 'My Browser Match',
  nativeShareText: (browserName) => `I matched with ${browserName}! Find your perfect browser:`,
};
