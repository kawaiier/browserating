export const TRAIT_META = {
  privacy: {
    label: "Privacy",
    description: "How well the browser protects you from tracking and data collection",
    icon: "shield",
    color: {
      light: "#0ea5e9", // sky-500
      dark: "#38bdf8",  // sky-400
      chart: "rgba(14, 165, 233, 0.8)",
      chartFill: "rgba(14, 165, 233, 0.15)",
    },
  },
  openSource: {
    label: "Open Source",
    description: "Whether the browser's code is publicly auditable and community-governed",
    icon: "code-2",
    color: {
      light: "#06b6d4", // cyan-500
      dark: "#22d3ee",  // cyan-400
      chart: "rgba(6, 182, 212, 0.8)",
      chartFill: "rgba(6, 182, 212, 0.15)",
    },
  },
  speed: {
    label: "Speed",
    description: "Raw browsing and JavaScript performance based on Speedometer benchmarks",
    icon: "zap",
    color: {
      light: "#f59e0b", // amber-500
      dark: "#fbbf24",  // amber-400
      chart: "rgba(245, 158, 11, 0.8)",
      chartFill: "rgba(245, 158, 11, 0.15)",
    },
  },
  resourceEfficiency: {
    label: "Resource Efficiency",
    description: "How light the browser is on RAM, CPU, and battery",
    icon: "battery-charging",
    color: {
      light: "#f97316", // orange-500
      dark: "#fb923c",  // orange-400
      chart: "rgba(249, 115, 22, 0.8)",
      chartFill: "rgba(249, 115, 22, 0.15)",
    },
  },
  minimalism: {
    label: "Minimalism",
    description: "How clean and distraction-free the browser's interface is",
    icon: "circle",
    color: {
      light: "#a855f7", // purple-500
      dark: "#c084fc",  // purple-400
      chart: "rgba(168, 85, 247, 0.8)",
      chartFill: "rgba(168, 85, 247, 0.15)",
    },
  },
  easeOfUse: {
    label: "Ease of Use",
    description: "How beginner-friendly and low-friction the browser is out of the box",
    icon: "smile",
    color: {
      light: "#ec4899", // pink-500
      dark: "#f472b6",  // pink-400
      chart: "rgba(236, 72, 153, 0.8)",
      chartFill: "rgba(236, 72, 153, 0.15)",
    },
  },
  customization: {
    label: "Customization",
    description: "How deeply you can configure the UI, shortcuts, and behavior",
    icon: "sliders-horizontal",
    color: {
      light: "#10b981", // emerald-500
      dark: "#34d399",  // emerald-400
      chart: "rgba(16, 185, 129, 0.8)",
      chartFill: "rgba(16, 185, 129, 0.15)",
    },
  },
  features: {
    label: "Built-in Features",
    description: "How much comes included — VPN, ad blocker, sidebar, AI, sync, and more",
    icon: "layout-dashboard",
    color: {
      light: "#22c55e", // green-500
      dark: "#4ade80",  // green-400
      chart: "rgba(34, 197, 94, 0.8)",
      chartFill: "rgba(34, 197, 94, 0.15)",
    },
  },
  innovation: {
    label: "Innovation",
    description: "How much the browser rethinks or reinvents the browsing experience",
    icon: "sparkles",
    color: {
      light: "#14b8a6", // teal-500
      dark: "#2dd4bf",  // teal-400
      chart: "rgba(20, 184, 166, 0.8)",
      chartFill: "rgba(20, 184, 166, 0.15)",
    },
  },
  ecosystem: {
    label: "Ecosystem Integration",
    description: "How well the browser fits into your existing OS and service ecosystem",
    icon: "cloud",
    color: {
      light: "#64748b", // slate-500
      dark: "#94a3b8",  // slate-400
      chart: "rgba(100, 116, 139, 0.8)",
      chartFill: "rgba(100, 116, 139, 0.15)",
    },
  },
};

// Ordered array for consistent rendering in charts and legends
export const TRAIT_ORDER = [
  "privacy",
  "openSource",
  "speed",
  "resourceEfficiency",
  "minimalism",
  "easeOfUse",
  "customization",
  "features",
  "innovation",
  "ecosystem",
];

// Chart.js dataset config for radar chart — user profile
export const USER_DATASET_STYLE = {
  label: "Your Priorities",
  backgroundColor: "rgba(139, 92, 246, 0.15)", // violet-500
  borderColor: "rgba(139, 92, 246, 0.9)",
  pointBackgroundColor: "rgba(139, 92, 246, 1)",
  pointBorderColor: "#fff",
  pointHoverBackgroundColor: "#fff",
  pointHoverBorderColor: "rgba(139, 92, 246, 1)",
  borderWidth: 2,
  pointRadius: 4,
};

// Chart.js dataset config for radar chart — browser profile
export const BROWSER_DATASET_STYLE = {
  label: "Browser Profile",
  backgroundColor: "rgba(14, 165, 233, 0.15)", // sky-500
  borderColor: "rgba(14, 165, 233, 0.9)",
  pointBackgroundColor: "rgba(14, 165, 233, 1)",
  pointBorderColor: "#fff",
  pointHoverBackgroundColor: "#fff",
  pointHoverBorderColor: "rgba(14, 165, 233, 1)",
  borderWidth: 2,
  pointRadius: 4,
};

// Shared radar chart options (pass to Chart.js)
export const RADAR_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 2,
        display: false,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.15)",
      },
      angleLines: {
        color: "rgba(148, 163, 184, 0.15)",
      },
      pointLabels: {
        font: { size: 11, family: "Inter, sans-serif" },
        color: "rgba(148, 163, 184, 0.9)",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: { size: 12, family: "Inter, sans-serif" },
        color: "rgba(148, 163, 184, 0.9)",
        padding: 20,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/10`,
      },
    },
  },
};

// Intro screen copy
export const QUIZ_INTRO_COPY = {
  headline: "Find Your Perfect Browser",
  subheadline: "Answer 7 quick questions and we'll match you with the browser that actually fits the way you browse.",
  bullets: [
    { icon: "list-checks", text: "7 questions, about 2 minutes" },
    { icon: "sliders-horizontal", text: "Covers privacy, speed, features, and your browsing style" },
    { icon: "trophy", text: "Get a ranked match with a hero pick and two runner-ups" },
  ],
  cta: "Start the Quiz",
};

// Social share copy
export const SHARE_COPY = {
  twitter: (browserName) =>
    `My browser match is ${browserName}! 🎯 Find your perfect browser:`,
  copySuccess: "Link copied!",
  copyLabel: "Copy link",
  nativeShareTitle: "My Browser Match",
  nativeShareText: (browserName) =>
    `I matched with ${browserName}! Find your perfect browser at browserating.com/quiz`,
};
