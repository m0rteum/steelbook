import type { SVGProps } from 'react'

/**
 * Steelbook icon · info — Figma node `5:131`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function InfoIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12.8333 8C12.8333 5.33062 10.6694 3.16667 8 3.16667C5.33062 3.16667 3.16667 5.33062 3.16667 8C3.16667 10.6694 5.33062 12.8333 8 12.8333C10.6694 12.8333 12.8333 10.6694 12.8333 8ZM14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8Z"
        fill="currentColor"
      />
      <path d="M7.16667 6.5H8.83333V11.5H7.16667V6.5Z" fill="currentColor" />
      <path d="M7.16667 4.16667H8.83333V6.16667H7.16667V4.16667Z" fill="currentColor" />
    </svg>
  )
}
