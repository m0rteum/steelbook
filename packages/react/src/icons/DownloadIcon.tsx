import type { SVGProps } from 'react'

/**
 * Steelbook icon · download — Figma node `5:89`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7.16666 1.83334H8.83333V10.8333H7.16666V1.83334Z" fill="currentColor" />
      <path
        d="M12.5117 7.00001L7.99999 11.5117L3.48828 7.00001L4.66666 5.82162L7.99999 9.15496L11.3333 5.82162L12.5117 7.00001Z"
        fill="currentColor"
      />
      <path d="M14.1667 12.5V14.1667H1.83333V12.5H14.1667Z" fill="currentColor" />
    </svg>
  )
}
