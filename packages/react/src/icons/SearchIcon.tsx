import type { SVGProps } from 'react'

/**
 * Steelbook icon · search — Figma node `5:57`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function SearchIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M11.1666 7.33334C11.1666 5.21625 9.4504 3.50001 7.33331 3.50001C5.21622 3.50001 3.49998 5.21625 3.49998 7.33334C3.49998 9.45044 5.21622 11.1667 7.33331 11.1667C9.4504 11.1667 11.1666 9.45044 11.1666 7.33334ZM12.8333 7.33334C12.8333 10.3709 10.3709 12.8333 7.33331 12.8333C4.29575 12.8333 1.83331 10.3709 1.83331 7.33334C1.83331 4.29578 4.29575 1.83334 7.33331 1.83334C10.3709 1.83334 12.8333 4.29578 12.8333 7.33334Z"
        fill="currentColor"
      />
      <path
        d="M14.845 13.6667L13.6666 14.8451L9.48826 10.6667L10.6666 9.48829L14.845 13.6667Z"
        fill="currentColor"
      />
    </svg>
  )
}
