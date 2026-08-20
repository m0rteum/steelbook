import type { SVGProps } from 'react'

/**
 * Steelbook icon · upload — Figma node `5:79`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function UploadIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7.16666 1.83332H8.83333V10.8333H7.16666V1.83332Z" fill="currentColor" />
      <path
        d="M12.5117 5.66666L11.3333 6.84504L7.99999 3.51171L4.66666 6.84504L3.48828 5.66666L7.99999 1.15494L12.5117 5.66666Z"
        fill="currentColor"
      />
      <path d="M14.1667 12.5V14.1667H1.83333V12.5H14.1667Z" fill="currentColor" />
    </svg>
  )
}
