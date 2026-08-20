import type { SVGProps } from 'react'

/**
 * Steelbook icon · trash — Figma node `6:23`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function TrashIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14.1667 3.5V5.16667H1.83333V3.5H14.1667Z" fill="currentColor" />
      <path
        d="M9.16666 3.16667H6.83333V5.16667H5.16666V1.5H10.8333V5.16667H9.16666V3.16667Z"
        fill="currentColor"
      />
      <path
        d="M12.5573 3.5612L11.776 14.5H4.22395L3.4427 3.5612L5.10546 3.44271L5.77604 12.8333H10.224L10.8945 3.44271L12.5573 3.5612Z"
        fill="currentColor"
      />
    </svg>
  )
}
