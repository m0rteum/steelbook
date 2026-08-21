import type { SVGProps } from 'react'

/**
 * Steelbook icon · zoom-out — Figma node `6:45`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ZoomOutIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M 11.1667 7.3333 C 11.1667 5.2162 9.4504 3.5 7.3333 3.5 C 5.2162 3.5 3.5 5.2162 3.5 7.3333 C 3.5 9.4504 5.2162 11.1667 7.3333 11.1667 C 9.4504 11.1667 11.1667 9.4504 11.1667 7.3333 Z M 12.8333 7.3333 C 12.8333 10.3709 10.3709 12.8333 7.3333 12.8333 C 4.2958 12.8333 1.8333 10.3709 1.8333 7.3333 C 1.8333 4.2958 4.2958 1.8333 7.3333 1.8333 C 10.3709 1.8333 12.8333 4.2958 12.8333 7.3333 Z"
        fill="currentColor"
      />
      <path
        d="M 14.8451 13.6667 L 13.6667 14.8451 L 9.4883 10.6667 L 10.6667 9.4883 L 14.8451 13.6667 Z"
        fill="currentColor"
      />
      <path
        d="M 9.8333 6.5 L 9.8333 8.1667 L 4.8333 8.1667 L 4.8333 6.5 L 9.8333 6.5 Z"
        fill="currentColor"
      />
    </svg>
  )
}
