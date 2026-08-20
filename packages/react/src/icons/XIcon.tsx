import type { SVGProps } from 'react'

/**
 * Steelbook icon · x — Figma node `5:41`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function XIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M13.1784 12L12 13.1784L2.82162 4.00001L4.00001 2.82162L13.1784 12Z" fill="currentColor" />
      <path d="M13.1784 4.00001L4.00001 13.1784L2.82162 12L12 2.82162L13.1784 4.00001Z" fill="currentColor" />
    </svg>
  )
}
