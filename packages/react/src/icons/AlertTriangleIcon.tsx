import type { SVGProps } from 'react'

/**
 * Steelbook icon · alert-triangle — Figma node `5:141`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 *
 * The triangle is the one glyph in the set that overflows its grid
 * horizontally — it spans 0.23 → 15.78 — so it reads a touch wider than
 * the circles beside it. That is drawn, not a scaling accident.
 */
export function AlertTriangleIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M15.7748 14.1667H0.225281L8.00002 0.663422L15.7748 14.1667ZM3.10809 12.5H12.8919L8.00002 4.00327L3.10809 12.5Z"
        fill="currentColor"
      />
      <path d="M7.16669 5.50001H8.83335V9.83334H7.16669V5.50001Z" fill="currentColor" />
      <path d="M7.16669 10.1667H8.83335V12.1667H7.16669V10.1667Z" fill="currentColor" />
    </svg>
  )
}
