import type { SVGProps } from 'react'

/**
 * Steelbook icon · chevrons-up-down — Figma node `5:25`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function ChevronsUpDownIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12.5117 5.33334L11.3333 6.51173L8 3.1784L4.66667 6.51173L3.48828 5.33334L8 0.821625L12.5117 5.33334Z"
        fill="currentColor"
      />
      <path
        d="M12.5117 10.6667L8 15.1784L3.48828 10.6667L4.66667 9.48829L8 12.8216L11.3333 9.48829L12.5117 10.6667Z"
        fill="currentColor"
      />
    </svg>
  )
}
