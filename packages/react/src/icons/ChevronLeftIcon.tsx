import type { SVGProps } from 'react'

/**
 * Steelbook icon · chevron-left — Figma node `5:13`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M11.1784 4.00001L7.17838 8.00001L11.1784 12L10 13.1784L4.82161 8.00001L10 2.82162L11.1784 4.00001Z"
        fill="currentColor"
      />
    </svg>
  )
}
