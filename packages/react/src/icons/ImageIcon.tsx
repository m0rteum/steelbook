import type { SVGProps } from 'react'

/**
 * Steelbook icon · image — Figma node `5:229`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ImageIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M 14.5 2.1667 L 14.5 13.8333 L 1.5 13.8333 L 1.5 2.1667 L 14.5 2.1667 Z M 3.1667 12.1667 L 12.8333 12.1667 L 12.8333 3.8333 L 3.1667 3.8333 L 3.1667 12.1667 Z"
        fill="currentColor"
      />
      <path
        d="M 6.3333 6.3333 C 6.3333 6.1492 6.1841 6 6 6 C 5.8159 6 5.6667 6.1492 5.6667 6.3333 C 5.6667 6.5174 5.8159 6.6667 6 6.6667 C 6.1841 6.6667 6.3333 6.5174 6.3333 6.3333 Z M 8 6.3333 C 8 7.4379 7.1046 8.3333 6 8.3333 C 4.8954 8.3333 4 7.4379 4 6.3333 C 4 5.2288 4.8954 4.3333 6 4.3333 C 7.1046 4.3333 8 5.2288 8 6.3333 Z"
        fill="currentColor"
      />
      <path
        d="M 14.8451 10 L 13.6667 11.1784 L 10.3333 7.8451 L 3.6667 14.5117 L 2.4883 13.3333 L 10.3333 5.4883 L 14.8451 10 Z"
        fill="currentColor"
      />
    </svg>
  )
}
