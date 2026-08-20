import type { SVGProps } from 'react'

/**
 * Steelbook icon · file — Figma node `6:65`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function FileIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M10.0117 0.833313L13.1667 3.98826V15.1666H3.16666V0.833313H10.0117ZM4.83332 13.5H11.5V4.67836L9.3216 2.49998H4.83332V13.5Z"
        fill="currentColor"
      />
      <path
        d="M8.49999 0.833313H10.1667V3.83331H13.1667V5.49998H8.49999V0.833313Z"
        fill="currentColor"
      />
    </svg>
  )
}
