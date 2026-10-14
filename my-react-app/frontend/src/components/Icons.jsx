function Svg({ size = 24, children, viewBox = '0 0 24 24', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Svg>
)

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Svg>
)

export const ArrowLeftIcon = (p) => (
  <Svg {...p}>
    <path d="M21 12H3M10 5l-7 7 7 7" />
  </Svg>
)

export const ChevronLeftIcon = (p) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
)

export const ChevronDownIcon = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
)

export const PencilIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 013 3L8 18.5 4 20z" />
    <path d="M14.5 6l3 3" />
  </Svg>
)

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" />
  </Svg>
)

export const CameraIcon = (p) => (
  <Svg {...p}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
)

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)

export const WhatsAppIcon = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
    <path d="M16 2.7A13.2 13.2 0 004.6 22.6L2.8 29.2l6.8-1.8A13.3 13.3 0 1016 2.7zm0 24.1a10.9 10.9 0 01-5.6-1.5l-.4-.2-4 1 1.1-3.9-.3-.4A10.9 10.9 0 1116 26.8z" />
    <path d="M22 18.8c-.3-.2-1.9-1-2.2-1s-.5-.2-.8.2-.9 1-1 1.2-.4.3-.7.1a9 9 0 01-4.5-3.9c-.3-.6.3-.5 1-1.8a.6.6 0 000-.6l-1-2.4c-.3-.6-.5-.5-.8-.5h-.6a1.2 1.2 0 00-.9.4 3.6 3.6 0 00-1.1 2.7 6.3 6.3 0 001.3 3.3 14.4 14.4 0 005.5 4.9c2 .9 2.8.9 3.9.8a3.3 3.3 0 002.2-1.5 2.7 2.7 0 00.2-1.5c-.1-.2-.3-.3-.6-.4z" />
  </svg>
)

export const GmailIcon = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
    <path d="M3 7.5A1.5 1.5 0 015.4 6.3L16 14.2l10.6-7.9A1.5 1.5 0 0129 7.5V25a1 1 0 01-1 1h-4.5V13.6L16 19.2l-7.5-5.6V26H4a1 1 0 01-1-1z" />
  </svg>
)

export const FacebookIcon = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
    <path d="M16 2a14 14 0 00-2.2 27.8v-9.8h-3.5V16h3.5v-3c0-3.5 2.1-5.4 5.3-5.4a21 21 0 013.1.3v3.4h-1.8c-1.7 0-2.2 1.1-2.2 2.2V16h3.8l-.6 4h-3.2v9.8A14 14 0 0016 2z" />
  </svg>
)

export const TortoiseIcon = ({ size = 110, ...p }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 120 72" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M18 46c0-20 17-34 39-34s40 13 42 34z" />
    <path d="M12 46h92a3 3 0 010 6H15a3 3 0 01-3-3z" />
    <path d="M98 40c4-9 10-13 16-11 5 2 5 9 1 11-3 2-7 1-9 3l-6 7z" />
    <path d="M24 50h13l-2 15a3 3 0 01-3 3h-6a3 3 0 01-3-3zM74 50h14l-1 15a3 3 0 01-3 3h-7a3 3 0 01-3-3z" />
    <path d="M18 44l-12 4 12 3z" />
  </svg>
)

export const SnakeIcon = ({ size = 70, ...p }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M6 8c6-4 11 2 9 8s3 10 9 7 9-3 11 2-1 10 5 13 10 0 14 4 6 10 14 12" />
    <circle cx="6" cy="8" r="3.2" fill="currentColor" stroke="none" />
  </svg>
)

export const ChameleonIcon = ({ size = 90, ...p }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 100 90" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M30 34c4-18 22-28 40-24 16 4 26 18 24 34-2 13-12 22-24 23-6 0-10-4-10-9 0-6 5-9 10-8 4 1 6 4 5 7" stroke="currentColor" strokeWidth="0" />
    <path d="M28 32c3-15 18-26 36-25 18 1 32 15 32 33 0 16-13 29-28 29-9 0-15-6-15-13s6-12 12-11c6 0 9 5 8 9-1 3-4 4-6 3" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    <path d="M2 30c4-12 16-20 30-18l6 16-14 8-22 2z" />
    <circle cx="20" cy="24" r="3.2" fill="var(--cream, #f1f4d5)" />
    <rect x="0" y="40" width="60" height="5" rx="2.5" />
    <path d="M30 34l-4 9h7zM52 46l-3 -3h8z" />
  </svg>
)
