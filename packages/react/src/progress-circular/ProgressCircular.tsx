import { Progress as ArkProgress, type ProgressRootProps } from '@ark-ui/react/progress'
import './ProgressCircular.css'

export type ProgressCircularProps = Omit<ProgressRootProps, 'children'>

/**
 * Determinate ring with a mono readout. The arc sweeps clockwise from
 * 12 o'clock through a muted ring, both edges outlined; the accent arc
 * paints over that outline as it advances, so a full ring reads as
 * solid orange.
 *
 * The Figma `Value` axis (0|25|50|75|100 as drawn) is the numeric
 * `value` prop — any 0–100 number works and the drawn variants are
 * sample stops. No interaction axes exist.
 *
 * The readout shows the **percent**, rounded, without a unit — the
 * design draws bare numbers that match the percent stops. Ark's own
 * `percentAsString` is a formatted "25%", so the number is rendered
 * from context instead. Reading the percent (rather than the raw
 * value) keeps the readout and the arc from ever disagreeing under a
 * custom `min`/`max`; the design is silent on that case.
 *
 * Ark labels the bar with its formatted value, which says how far
 * along it is but not what it measures — pass `aria-label` naming the
 * task.
 *
 * @example
 * ```tsx
 * <ProgressCircular value={uploaded} aria-label="Upload progress" />
 * ```
 *
 * Figma: Steelbook Design System › Progress / Circular (node `21:31`).
 * Built on [Ark UI Progress (circular)](https://ark-ui.com/docs/components/progress-circular).
 */
export function ProgressCircular({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ProgressCircularProps) {
  // role="progressbar" sits on the circle, not the root, so the accessible
  // name has to travel there — on the root it would name a plain <div> and
  // leave the bar called "0%", Ark's formatted-value default. Only defined
  // keys are forwarded so an absent name leaves that default intact.
  const nameProps: { 'aria-label'?: string; 'aria-labelledby'?: string } = {}
  if (ariaLabel != null) nameProps['aria-label'] = ariaLabel
  if (ariaLabelledBy != null) nameProps['aria-labelledby'] = ariaLabelledBy

  return (
    <ArkProgress.Root
      {...props}
      className={className ? `sb-progress-circular ${className}` : 'sb-progress-circular'}
    >
      <ArkProgress.Circle {...nameProps} className="sb-progress-circular__circle">
        <ArkProgress.CircleTrack className="sb-progress-circular__track" />
        {/*
          The muted band. Painted over the black track at a narrower
          stroke, which leaves the track showing as a 1px-and-a-half
          outline on each edge of the ring — the Figma donut's inside
          stroke. Not an Ark part: purely the drawn fill.
        */}
        <circle className="sb-progress-circular__band" />
        <ArkProgress.CircleRange className="sb-progress-circular__range" />
      </ArkProgress.Circle>
      <ArkProgress.ValueText className="sb-progress-circular__readout">
        <ArkProgress.Context>{(progress) => Math.round(progress.percent)}</ArkProgress.Context>
      </ArkProgress.ValueText>
    </ArkProgress.Root>
  )
}
