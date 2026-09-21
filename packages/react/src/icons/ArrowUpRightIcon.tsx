import type { SVGProps } from 'react'

/**
 * Steelbook icon · arrow-up-right — Figma node `5:121`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12.5117 4.66667L4.66667 12.5117L3.48828 11.3333L11.3333 3.48828L12.5117 4.66667Z"
        fill="currentColor"
      />
      <path
        d="M10.5 5.5H5.16667V3.83333H12.1667V10.8333H10.5V5.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
