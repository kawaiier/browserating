'use client';

import {
  AlertTriangle,
  Briefcase,
  Circle,
  Cloud,
  Code2,
  Coffee,
  Eye,
  EyeOff,
  Filter,
  Gamepad2,
  Ghost,
  LayoutDashboard,
  LayoutTemplate,
  MinusCircle,
  Package,
  PanelsTopLeft,
  Shield,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Terminal,
  ThumbsUp,
  UserX,
  Zap,
} from 'lucide-react';

const ICON_MAP = {
  zap: Zap,
  shield: Shield,
  'layout-dashboard': LayoutDashboard,
  'minus-circle': MinusCircle,
  briefcase: Briefcase,
  'gamepad-2': Gamepad2,
  'eye-off': EyeOff,
  coffee: Coffee,
  package: Package,
  'sliders-horizontal': SlidersHorizontal,
  terminal: Terminal,
  cloud: Cloud,
  shuffle: Shuffle,
  'alert-triangle': AlertTriangle,
  'user-x': UserX,
  smile: Smile,
  filter: Filter,
  'shield-check': ShieldCheck,
  ghost: Ghost,
  'thumbs-up': ThumbsUp,
  eye: Eye,
  'code-2': Code2,
  layout: LayoutTemplate,
  circle: Circle,
  'panels-top-left': PanelsTopLeft,
  sparkles: Sparkles,
};

function Icon({ name }) {
  const Component = ICON_MAP[name];
  if (!Component) return null;
  return <Component className="w-5 h-5" aria-hidden="true" />;
}

export default function QuizOption({ option, isSelected, onClick }) {
  return (
    <button
      onClick={() => onClick(option.id)}
      aria-label={`${option.label}: ${option.description}`}
      aria-pressed={isSelected}
      className={`group relative w-full text-left px-4 py-4 sm:px-5 sm:py-5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02] shadow-md shadow-purple-100 dark:shadow-purple-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
            isSelected
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400'
          }`}
        >
          <Icon name={option.icon} />
        </span>
        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-sm sm:text-base leading-snug ${
              isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-white'
            }`}
          >
            {option.label}
          </div>
          {option.description && (
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
              {option.description}
            </div>
          )}
        </div>
        {isSelected && (
          <span className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}
