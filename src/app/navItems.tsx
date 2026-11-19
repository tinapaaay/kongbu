import type { ReactNode } from 'react'

export interface NavItem {
  to: string
  label: string
  /** Shorter label for the phone tab bar. */
  shortLabel: string
  icon: ReactNode
}

// Simple line icons drawn for this app. aria-hidden because the text label names each link.
const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/** The main navigation. Desktop top bar and phone tab bar both read this list. */
export const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    shortLabel: 'Home',
    icon: (
      <svg {...iconProps}>
        <path d="M4 11l8-7 8 7v9H4z" />
        <path d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    to: '/learn',
    label: 'Learn',
    shortLabel: 'Learn',
    icon: (
      <svg {...iconProps}>
        <path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2z" />
        <path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2z" />
      </svg>
    ),
  },
  {
    to: '/practice',
    label: 'Practice',
    shortLabel: 'Practice',
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    shortLabel: 'Settings',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </svg>
    ),
  },
]
