import type { SVGProps } from 'react'

/**
 * Steelbook icon · grip-vertical — Figma node `5:180`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function GripVerticalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7.33334 2.66669H5.33334V4.66669H7.33334V2.66669Z" fill="currentColor" />
      <path d="M7.33334 7.00002H5.33334V9.00002H7.33334V7.00002Z" fill="currentColor" />
      <path d="M7.33334 11.3334H5.33334V13.3334H7.33334V11.3334Z" fill="currentColor" />
      <path d="M11 2.66669H9.00001V4.66669H11V2.66669Z" fill="currentColor" />
      <path d="M11 7.00002H9.00001V9.00002H11V7.00002Z" fill="currentColor" />
      <path d="M11 11.3334H9.00001V13.3334H11V11.3334Z" fill="currentColor" />
    </svg>
  )
}
