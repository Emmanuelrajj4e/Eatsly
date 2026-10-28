import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Every Annadaan icon: 24px stroke-based inline SVG, colors via currentColor. */
function I({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ClockIcon(p: P) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </I>
  );
}

export function PinIcon(p: P) {
  return (
    <I {...p}>
      <path d="M12 21s-6.5-5.4-6.5-10a6.5 6.5 0 1 1 13 0c0 4.6-6.5 10-6.5 10Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </I>
  );
}

export function BowlIcon(p: P) {
  return (
    <I {...p}>
      <path d="M4 12h16a8 8 0 0 1-16 0Z" />
      <path d="M9 8.5c0-1.4 1.2-1.6 1.2-3S9 3.5 9 3.5" />
      <path d="M13 8.5c0-1.4 1.2-1.6 1.2-3S13 3.5 13 3.5" />
    </I>
  );
}

export function FlameIcon(p: P) {
  return (
    <I {...p}>
      <path d="M12 21c3.6 0 6-2.4 6-6 0-3-2-4.7-3.2-6.6C13.6 6.6 13 4.8 13 3c-2.6 1.7-4 3.9-4 6 0-1.4-.6-2.4-1.6-3.2C6.5 7.2 6 9 6 11c0 5.6 2.4 10 6 10Z" />
      <path d="M12 21c-1.6 0-2.6-1.2-2.6-2.8 0-1.7 1.4-2.6 2.6-4.4 1.2 1.8 2.6 2.7 2.6 4.4 0 1.6-1 2.8-2.6 2.8Z" />
    </I>
  );
}

export function CookieIcon(p: P) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
    </I>
  );
}

export function PackageIcon(p: P) {
  return (
    <I {...p}>
      <rect x="4" y="7.5" width="16" height="12" rx="1.6" />
      <path d="M4 11.5h16M9 7.5V5.5h6v2" />
    </I>
  );
}

export function CarrotIcon(p: P) {
  return (
    <I {...p}>
      <path d="M14.5 9.5 20 4M16 3.5l-.6 2.6M19 5l-2.4 1.4" />
      <path d="M13.8 10.2a4.7 4.7 0 0 0-6.6 6.6c2 2 5.5 3.7 7.5 1.7s0-5.5-.9-8.3Z" />
    </I>
  );
}

export function LeafIcon(p: P) {
  return (
    <I {...p}>
      <path d="M5 19c0-8 5-13 14-14 1 9-4 15-12 15" />
      <path d="M5 19c2-4 5-7 9-9" />
    </I>
  );
}

export function ArrowRightIcon(p: P) {
  return (
    <I {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </I>
  );
}

export function UsersIcon(p: P) {
  return (
    <I {...p}>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.5 20c.7-3.4 3-5.2 5.5-5.2s4.8 1.8 5.5 5.2" />
      <path d="M15.5 5.6a3.4 3.4 0 0 1 0 6.8M17 14.9c2 .6 3.2 2.3 3.6 5.1" />
    </I>
  );
}

export function BuildingIcon(p: P) {
  return (
    <I {...p}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.6" />
      <path d="M9 7.5h2M13 7.5h2M9 11.5h2M13 11.5h2M9 15.5h6" />
    </I>
  );
}

export function SunIcon(p: P) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.8 12H2.4M21.6 12h-2.4M6.3 6.3 4.7 4.7M19.3 19.3l-1.6-1.6M6.3 17.7l-1.6 1.6M19.3 4.7l-1.6 1.6" />
    </I>
  );
}

export function MoonIcon(p: P) {
  return (
    <I {...p}>
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </I>
  );
}

export function MenuIcon(p: P) {
  return (
    <I {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </I>
  );
}

export function CloseIcon(p: P) {
  return (
    <I {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </I>
  );
}

export function CheckIcon(p: P) {
  return (
    <I {...p}>
      <path d="M4.5 12.5 9 17l10.5-10.5" />
    </I>
  );
}

export function AlertIcon(p: P) {
  return (
    <I {...p}>
      <path d="M12 3.5 22 20H2L12 3.5Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none" />
    </I>
  );
}

export function InfoIcon(p: P) {
  return (
    <I {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none" />
    </I>
  );
}

export function BikeIcon(p: P) {
  return (
    <I {...p}>
      <circle cx="6" cy="17" r="3.4" />
      <circle cx="18" cy="17" r="3.4" />
      <path d="M6 17 9.5 10H15M12 17h6l-3.4-7M9.5 10 8 6.5H6" />
    </I>
  );
}

export function PhoneIcon(p: P) {
  return (
    <I {...p}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16.5 13l4 1.5v3a2 2 0 0 1-2.2 2C10.5 18.8 5.2 13.5 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </I>
  );
}

export function MailIcon(p: P) {
  return (
    <I {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </I>
  );
}

export function PlusIcon(p: P) {
  return (
    <I {...p}>
      <path d="M12 5v14M5 12h14" />
    </I>
  );
}

/* --- filled glyphs, used for social links in the footer --- */

function G({ children, ...props }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function XGlyph(p: P) {
  return (
    <G {...p}>
      <path d="M17.7 3H21l-7.1 8.2L22.2 21h-6.6l-5.2-6.6L4.6 21H1.3l7.6-8.8L1.8 3h6.8l4.7 6.1L17.7 3Zm-1.1 16h1.9L6.7 4.8H4.7L16.6 19Z" />
    </G>
  );
}

export function InstagramGlyph(p: P) {
  return (
    <G {...p}>
      <path d="M12 2.2c-2.7 0-3 0-4.1.1-2.5.1-4.5 2-4.6 4.6-.1 1-.1 1.3-.1 4.1s0 3.1.1 4.1c.1 2.6 2.1 4.5 4.6 4.6 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c2.5-.1 4.5-2 4.6-4.6.1-1 .1-1.3.1-4.1s0-3.1-.1-4.1c-.1-2.6-2.1-4.5-4.6-4.6-1.1-.1-1.4-.1-4.1-.1Zm0 1.8c2.7 0 2.9 0 4 .1 1.7.1 2.8 1.1 2.9 2.9 0 1 .1 1.3.1 4s0 3-.1 4c-.1 1.7-1.2 2.8-2.9 2.9-1.1.1-1.3.1-4 .1s-2.9 0-4-.1c-1.7-.1-2.8-1.2-2.9-2.9 0-1-.1-1.3-.1-4s0-3 .1-4c.1-1.8 1.2-2.8 2.9-2.9 1.1-.1 1.3-.1 4-.1Zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 7.4Zm5.2-8.5a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </G>
  );
}

export function LinkedInGlyph(p: P) {
  return (
    <G {...p}>
      <path d="M6.9 8.9H3.6V20h3.3V8.9ZM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13c0-2.8-1.5-4.4-3.9-4.4-1.4 0-2.3.7-2.9 1.6V8.9H10.4V20h3.3v-6c0-1.4.6-2.4 1.9-2.4 1.2 0 1.6.9 1.6 2.4v6h3.2V13Z" />
    </G>
  );
}

export function YouTubeGlyph(p: P) {
  return (
    <G {...p}>
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.9C18.2 5 12 5 12 5s-6.2 0-7.8.3a2.6 2.6 0 0 0-1.8 1.9C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.9c1.6.3 7.8.3 7.8.3s6.2 0 7.8-.3a2.6 2.6 0 0 0 1.8-1.9c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15.2V8.8l5.4 3.2L10 15.2Z" />
    </G>
  );
}
