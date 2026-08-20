import type { SVGProps } from 'react'

/**
 * Steelbook icon · chevron-up — Figma node `5:9`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
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
      <path
        d="M13.1784 10L12 11.1784L7.99999 7.1784L3.99999 11.1784L2.82161 10L7.99999 4.82162L13.1784 10Z"
        fill="currentColor"
      />
    </svg>
  )
}
