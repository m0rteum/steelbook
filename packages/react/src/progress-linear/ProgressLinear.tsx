import { Progress as ArkProgress, type ProgressRootProps } from '@ark-ui/react/progress'
import './ProgressLinear.css'

export type ProgressLinearProps = Omit<ProgressRootProps, 'children'>

/**
 * Determinate bar. The orange block advances through a muted track
 * behind a shared 2px border — the indicator is clipped inside the
 * border, so the frame reads as one drawn box at any fill.
 *
 * The Figma `Value` axis (0|25|50|75|100 as drawn) is the numeric
 * `value` prop — any 0–100 number works; the drawn variants are sample
 * stops, and the track resizes freely with the indicator scaling in
 * proportion (Ark writes the percentage width on the range).
 *
 * No interaction axes exist — a progress bar has no states to skin.
 * Pass `aria-label` (or wire `aria-labelledby`) when no visible label
 * accompanies the bar.
 *
 * @example
 * ```tsx
 * <ProgressLinear value={uploaded} aria-label="Upload progress" />
 * ```
 *
 * Figma: Steelbook Design System › Progress / Linear (node `21:11`).
 * Built on [Ark UI Progress (linear)](https://ark-ui.com/docs/components/progress-linear).
 */
export function ProgressLinear({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ProgressLinearProps) {
  // role="progressbar" sits on the track, not the root, so the accessible
  // name has to travel there — on the root it would name a plain <div> and
  // leave the bar called "50%", Ark's formatted-value default. Only defined
  // keys are forwarded so an absent name leaves that default intact.
  const nameProps: { 'aria-label'?: string; 'aria-labelledby'?: string } = {}
  if (ariaLabel != null) nameProps['aria-label'] = ariaLabel
  if (ariaLabelledBy != null) nameProps['aria-labelledby'] = ariaLabelledBy

  return (
    <ArkProgress.Root
      {...props}
      className={className ? `sb-progress-linear ${className}` : 'sb-progress-linear'}
    >
      <ArkProgress.Track {...nameProps} className="sb-progress-linear__track">
        <ArkProgress.Range className="sb-progress-linear__range" />
      </ArkProgress.Track>
    </ArkProgress.Root>
  )
}
