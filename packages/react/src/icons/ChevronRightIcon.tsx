import type { SVGProps } from 'react'

/**
 * Steelbook icon · chevron-right — Figma node `5:17`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M11.1784 8.00001L6.00001 13.1784L4.82162 12L8.82162 8.00001L4.82162 4.00001L6.00001 2.82162L11.1784 8.00001Z"
        fill="currentColor"
      />
    </svg>
  )
}
