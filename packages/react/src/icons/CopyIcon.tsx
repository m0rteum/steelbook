import type { SVGProps } from 'react'

/**
 * Steelbook icon · copy — Figma node `5:97`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function CopyIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M14.5 5.50001V14.5H5.5V5.50001H14.5ZM7.16667 12.8333H12.8333V7.16668H7.16667V12.8333Z"
        fill="currentColor"
      />
      <path d="M1.5 2.83334H10.5V4.50001H3.16667V11.8333H1.5V2.83334Z" fill="currentColor" />
    </svg>
  )
}
