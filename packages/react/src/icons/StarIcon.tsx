import type { SVGProps } from 'react'

/**
 * Steelbook icon · star — Figma node `5:170`.
 *
 * Drawn on the 16px icon grid; the glyph occupies inset 7.5% 7.5% 11.67% 7.5%
 * of the box, matching the Figma export. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function StarIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M8 1.2L10.06667 5.66667L14.8 6.2L11.26667 9.46667L12.2 14.13333L8 11.8L3.8 14.13333L4.73333 9.46667L1.2 6.2L5.93333 5.66667L8 1.2Z"
        fill="currentColor"
      />
    </svg>
  )
}
