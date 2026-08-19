import type { SVGProps } from 'react'

/**
 * Steelbook icon · arrow-left — Figma node `5:112`, the default instance in
 * the Button `icon-left` slot.
 *
 * The exported leaf is 12.0117 × 10.3568 sitting at inset 17.64% 11.46%
 * 17.64% 13.47% of the icon box; the translate places it at that offset on
 * the 16px grid, so the path data is the export verbatim. Filled with
 * `currentColor` so it recolors from the parent's `color`.
 */
export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(2.1552 2.8224)" fill="currentColor">
        <path d="M12.0117 4.34505V6.01172H0.345052V4.34505H12.0117Z" />
        <path d="M6.35677 1.17839L2.35677 5.17839L6.35677 9.17838L5.17839 10.3568L0 5.17839L5.17839 0L6.35677 1.17839Z" />
      </g>
    </svg>
  )
}
