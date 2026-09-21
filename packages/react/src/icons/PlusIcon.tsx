import type { SVGProps } from 'react'

/**
 * Steelbook icon · plus — Figma node `5:49`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function PlusIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M7.16667 2.5H8.83333V13.5H7.16667V2.5Z"
        fill="currentColor"
      />
      <path
        d="M13.5 7.16667V8.83333H2.5V7.16667H13.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
