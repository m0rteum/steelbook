import type { SVGProps } from 'react'

/**
 * Steelbook icon · refresh — Figma node `5:203`.
 *
 * Drawn on the 16px icon grid, outlined from the 2.5px square-cap stroke;
 * path data exported from Figma verbatim. Filled with `currentColor` so it
 * recolors from whichever `--sb-icon-*` token the parent sets as its `color`.
 */
export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M4.31251 2.65969C5.54711 1.8092 7.03775 1.412 8.53191 1.53469C10.0262 1.65745 11.4324 2.2928 12.5117 3.33352L13.1113 3.91164L11.9551 5.11151L11.3548 4.53339C10.5523 3.75954 9.50696 3.2868 8.39584 3.1955C7.28471 3.10422 6.17592 3.3996 5.25782 4.03209C4.33971 4.6646 3.66867 5.59544 3.35808 6.6662C3.04753 7.73691 3.11629 8.88216 3.5534 9.90774C3.99053 10.9333 4.76903 11.7763 5.75652 12.2938C6.74406 12.8113 7.88056 12.9712 8.97267 12.7469C10.0646 12.5226 11.0458 11.928 11.7494 11.0633C12.4529 10.1986 12.8357 9.11693 12.8333 8.00214L12.8314 7.16881L14.4981 7.1649L14.5 7.99823C14.5033 9.49755 13.9879 10.9518 13.0417 12.1148C12.0954 13.2777 10.7765 14.0781 9.30795 14.3797C7.83926 14.6814 6.31115 14.4656 4.98308 13.7697C3.6551 13.0738 2.60807 11.9406 2.02019 10.5614C1.43233 9.18217 1.33956 7.64194 1.75717 6.20201C2.17486 4.76201 3.07781 3.51031 4.31251 2.65969Z"
        fill="currentColor"
      />
      <path
        d="M12.8333 1.16667H14.5V6.83333H8.83333V5.16667H12.8333V1.16667Z"
        fill="currentColor"
      />
    </svg>
  )
}
