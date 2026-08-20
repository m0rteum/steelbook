import type { SVGProps } from 'react'

/**
 * Steelbook icon · pen — Figma node `6:13`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function PenIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M14.8451 5.00002L5.76628 14.0788L5.55274 14.1374L0.479172 15.5209L1.86264 10.4473L1.92123 10.2337L11 1.15497L14.8451 5.00002ZM3.41211 11.099L2.85417 13.1452L4.9004 12.5873L12.4883 5.00002L11 3.51174L3.41211 11.099Z"
        fill="currentColor"
      />
    </svg>
  )
}
