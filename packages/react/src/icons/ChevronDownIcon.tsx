import type { SVGProps } from 'react'

/**
 * Steelbook icon · chevron-down — Figma node `5:5`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M13.1784 6.00001L8 11.1784L2.82162 6.00001L4 4.82162L8 8.82162L12 4.82162L13.1784 6.00001Z"
        fill="currentColor"
      />
    </svg>
  )
}
