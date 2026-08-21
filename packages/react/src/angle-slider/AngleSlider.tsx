import {
  AngleSlider as ArkAngleSlider,
  type AngleSliderRootProps,
} from '@ark-ui/react/angle-slider'
import './AngleSlider.css'

/**
 * Exactly one of `aria-label` / `aria-labelledby`, enforced at compile time.
 *
 * The Figma component draws a dial and a degree readout but no label, so
 * the control has no visible text of its own and nothing can supply its
 * name but the caller.
 */
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never }

export type AngleSliderProps = Omit<
  AngleSliderRootProps,
  'children' | 'aria-label' | 'aria-labelledby'
> &
  AccessibleName

/**
 * Rotational input. An orange needle on a black-ringed dial, with a mono
 * degree readout underneath.
 *
 * The Figma `Angle` axis (0 | 45 | 90 | 180 | 270 as drawn) is the numeric
 * `value` — any 0–359 degree works, and the drawn variants are sample
 * stops. Zero points up and the needle sweeps clockwise, which is what
 * Ark's `--angle` gives; the needle is Ark's thumb, pivoted at the hub
 * rather than riding the rim.
 *
 * The readout is rendered from context because Ark's `valueAsDegree` is
 * a CSS-shaped `"45deg"` and the design draws `45°`.
 *
 * Two states the design does not draw, decided here so the control is not
 * broken: focus puts the house 3px accent ring around the dial (the thumb
 * is a 3px needle — a ring on it would read as a blob), and `disabled`
 * takes the same disabled tokens every other Steelbook control uses.
 *
 * @example
 * ```tsx
 * <AngleSlider defaultValue={45} aria-label="Gradient angle" />
 * ```
 *
 * Figma: Steelbook Design System › Angle Slider (node `22:64`).
 * Built on [Ark UI AngleSlider](https://ark-ui.com/docs/components/angle-slider).
 */
export function AngleSlider({ className, ...props }: AngleSliderProps) {
  /* The thumb carries Ark's `aria-labelledby` pointing at a Label part this
     design does not draw. As in Slider it cannot be cleared — zag resolves
     it as `ariaLabelledBy ?? labelId`, and `??` treats an explicit null as
     absent. The name still resolves: an `aria-labelledby` whose every IDREF
     dangles is skipped, and the computation falls through to `aria-label`,
     which the prop union above makes mandatory. */
  return (
    <ArkAngleSlider.Root
      {...props}
      className={className ? `sb-angle-slider ${className}` : 'sb-angle-slider'}
    >
      <ArkAngleSlider.Control className="sb-angle-slider__dial">
        <ArkAngleSlider.Thumb className="sb-angle-slider__needle" />
      </ArkAngleSlider.Control>
      <ArkAngleSlider.ValueText className="sb-angle-slider__readout">
        <ArkAngleSlider.Context>{(angle) => `${angle.value}°`}</ArkAngleSlider.Context>
      </ArkAngleSlider.ValueText>
      <ArkAngleSlider.HiddenInput />
    </ArkAngleSlider.Root>
  )
}
