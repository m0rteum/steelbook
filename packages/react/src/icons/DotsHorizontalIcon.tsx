import type { SVGProps } from 'react'

/**
 * Steelbook icon · dots-horizontal — Figma node `5:187`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function DotsHorizontalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4.66668 7H2.33334V9.33333H4.66668V7Z" fill="currentColor" />
      <path d="M9.16668 7H6.83334V9.33333H9.16668V7Z" fill="currentColor" />
      <path d="M13.6667 7H11.3333V9.33333H13.6667V7Z" fill="currentColor" />
    </svg>
  )
}
