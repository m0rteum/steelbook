import type { SVGProps } from 'react'

/**
 * Steelbook icon · crop — Figma node `6:9`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function CropIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M 3.5 0.5 L 5.1667 0.5 L 5.1667 10.8333 L 15.5 10.8333 L 15.5 12.5 L 3.5 12.5 L 3.5 0.5 Z"
        fill="currentColor"
      />
      <path
        d="M 10.8333 5.1667 L 0.5 5.1667 L 0.5 3.5 L 12.5 3.5 L 12.5 15.5 L 10.8333 15.5 L 10.8333 5.1667 Z"
        fill="currentColor"
      />
    </svg>
  )
}
