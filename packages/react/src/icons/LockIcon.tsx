import type { SVGProps } from 'react'

/**
 * Steelbook icon · lock — Figma node `5:211`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function LockIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M13.5 6.5V14.5H2.5V6.5H13.5ZM4.16667 12.8333H11.8333V8.16667H4.16667V12.8333Z" fill="currentColor" />
      <path d="M9.83333 5C9.83333 4.51377 9.64004 4.04759 9.29622 3.70378C8.95241 3.35996 8.48623 3.16667 8 3.16667C7.51377 3.16667 7.04759 3.35996 6.70378 3.70378C6.35996 4.04759 6.16667 4.51377 6.16667 5V8.16667H4.5V5C4.5 4.07174 4.86901 3.18177 5.52539 2.52539C6.18177 1.86901 7.07174 1.5 8 1.5C8.92826 1.5 9.81823 1.86901 10.4746 2.52539C11.131 3.18177 11.5 4.07174 11.5 5V8.16667H9.83333V5Z" fill="currentColor" />
    </svg>
  )
}
