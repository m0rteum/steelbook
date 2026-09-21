import type { SVGProps } from 'react'

/**
 * Steelbook icon · flag — Figma node `6:73`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function FlagIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M2.83333 1.5H4.5V15.1667H2.83333V1.5Z"
        fill="currentColor"
      />
      <path
        d="M13.9414 1.83333L11.3529 5.5L13.9414 9.16667H2.83333V7.5H10.7253L9.31315 5.5L10.7253 3.5H2.83333V1.83333H13.9414Z"
        fill="currentColor"
      />
    </svg>
  )
}
