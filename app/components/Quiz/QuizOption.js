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
      className="group relative w-full text-left px-4 py-4 sm:px-5 sm:py-5 rounded-md border-2 transition-all duration-200"
      style={{
        borderColor: isSelected ? 'var(--color-brand)' : 'var(--border-subtle)',
        backgroundColor: isSelected ? 'var(--color-brand-subtle)' : 'var(--surface-raised)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-overlay)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-200"
          style={{
            backgroundColor: isSelected ? 'var(--color-brand)' : 'var(--surface-sunken)',
            color: isSelected ? 'var(--text-inverse)' : 'var(--text-subtle)',
          }}
        >
          <Icon name={option.icon} />
        </span>
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold text-sm sm:text-base leading-snug"
            style={{
              color: isSelected ? 'var(--text-brand)' : 'var(--text-default)',
            }}
          >
            {option.label}
          </div>
          {option.description && (
            <div className="text-xs sm:text-sm mt-0.5 leading-snug" style={{ color: 'var(--text-subtle)' }}>
              {option.description}
            </div>
          )}
        </div>
        {isSelected && (
          <span
            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            <svg
              className="w-3 h-3"
              style={{ color: 'var(--text-inverse)' }}
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
