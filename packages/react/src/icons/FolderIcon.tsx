import type { SVGProps } from 'react'

/**
 * Steelbook icon · folder — Figma node `6:57`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function FolderIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M 6.7337 2.5 L 6.9844 2.8125 L 8.0677 4.1667 L 14.8333 4.1667 L 14.8333 14.5 L 1.1667 14.5 L 1.1667 2.5 L 6.7337 2.5 Z M 2.8333 12.8333 L 13.1667 12.8333 L 13.1667 5.8333 L 7.2663 5.8333 L 7.0156 5.5208 L 5.9323 4.1667 L 2.8333 4.1667 L 2.8333 12.8333 Z"
        fill="currentColor"
      />
    </svg>
  )
}
