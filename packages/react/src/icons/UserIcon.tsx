import type { SVGProps } from 'react'

/**
 * Steelbook icon · user — Figma node `5:219`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function UserIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M9.83335 5.33331C9.83335 4.32079 9.01254 3.49998 8.00002 3.49998C6.9875 3.49998 6.16669 4.32079 6.16669 5.33331C6.16669 6.34584 6.9875 7.16665 8.00002 7.16665C9.01254 7.16665 9.83335 6.34584 9.83335 5.33331ZM11.5 5.33331C11.5 7.26631 9.93302 8.83331 8.00002 8.83331C6.06702 8.83331 4.50002 7.26631 4.50002 5.33331C4.50002 3.40032 6.06702 1.83331 8.00002 1.83331C9.93302 1.83331 11.5 3.40032 11.5 5.33331Z"
        fill="currentColor"
      />
      <path
        d="M12.1667 13.6666C12.1667 12.6113 11.7202 11.8571 11.0098 11.3405C10.2716 10.8037 9.20774 10.5 8.00002 10.5C6.7923 10.5 5.72841 10.8037 4.99025 11.3405C4.27987 11.8571 3.83335 12.6113 3.83335 13.6666V14.5H2.16669V13.6666C2.16669 12.0554 2.8869 10.8095 4.00979 9.99282C5.10496 9.19633 6.54113 8.83331 8.00002 8.83331C9.45891 8.83331 10.8951 9.19633 11.9903 9.99282C13.1131 10.8095 13.8334 12.0554 13.8334 13.6666V14.5H12.1667V13.6666Z"
        fill="currentColor"
      />
    </svg>
  )
}
