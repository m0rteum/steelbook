import type { SVGProps } from 'react'

/**
 * Steelbook icon · check — Figma node `5:29`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M14.5072 3.89323L6.72266 13.2344L1.48828 8L2.66667 6.82161L6.61068 10.7656L13.2266 2.82617L14.5072 3.89323Z"
        fill="currentColor"
      />
    </svg>
  )
}
