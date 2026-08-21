import type { SVGProps } from 'react'

/**
 * Steelbook icon · calendar — Figma node `5:69`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2.83334V14.5H1.5V2.83334H14.5ZM3.16667 12.8333H12.8333V4.50001H3.16667V12.8333Z" fill="currentColor" />
      <path d="M14.5 6.16668V7.83334H1.5V6.16668H14.5Z" fill="currentColor" />
      <path d="M4.5 0.833344H6.16667V5.16668H4.5V0.833344Z" fill="currentColor" />
      <path d="M9.83333 0.833344H11.5V5.16668H9.83333V0.833344Z" fill="currentColor" />
    </svg>
  )
}
