import { Slider as ArkSlider, type SliderRootProps } from '@ark-ui/react/slider'
import './Slider.css'

/**
 * Exactly one of `aria-label` / `aria-labelledby`, enforced at compile time.
 *
 * The Figma component draws no label of its own — just the rail — so a
 * Slider has no visible text and nothing can supply its name but the
 * caller. Pass one string per thumb, or a single string for a
 * single-thumb slider.
 */
type AccessibleName =
  | { 'aria-label': string | string[]; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string | string[]; 'aria-label'?: never }

export type SliderProps = Omit<
  SliderRootProps,
  'children' | 'aria-label' | 'aria-labelledby'
> &
  AccessibleName

const toList = (value: string | string[] | undefined) =>
  value == null ? undefined : Array.isArray(value) ? value : [value]

/**
 * Value on a rail. Black square thumbs, an orange filled range, and a
 * muted rail outlined in 2px. The thumb turns orange on hover and takes
 * a 3px accent ring on focus.
 *
 * The Figma `Type` axis is the shape of the value: one number draws
 * Single, two draw Range. It is data, not a prop — pass
 * `defaultValue={[60]}` or `defaultValue={[25, 75]}` and a thumb is
 * rendered per entry. The `State` axis is a skin: Hover and Focus
 * belong to the user, and Disabled is the `disabled` prop.
 *
 * The rail is fluid; the design draws it at 260px but a rail has to
 * resize with its container, so width comes from the parent.
 *
 * Two things the design does not draw, decided here: a thumb keeps the
 * hover skin while it is being dragged (the pointer can outrun it), and
 * the focus ring is keyboard-only — `:focus-visible`, as on every other
 * Steelbook control — so dragging with a mouse does not light it up.
 *
 * @example
 * ```tsx
 * <Slider defaultValue={[60]} aria-label="Volume" />
 *
 * <Slider
 *   defaultValue={[25, 75]}
 *   aria-label={['Minimum price', 'Maximum price']}
 *   onValueChange={({ value }) => setRange(value)}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Slider (node `22:38`).
 * Built on [Ark UI Slider](https://ark-ui.com/docs/components/slider).
 */
export function Slider({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SliderProps) {
  /* When the caller names the slider with `aria-label`, each thumb still
     carries Ark's `aria-labelledby` pointing at a Label part this design
     does not draw, so that reference dangles. Unlike RadioGroup it cannot
     be cleared: zag resolves it as `ariaLabelledBy?.[index] ?? labelId`,
     and `??` treats an explicit null as absent. Rendering the Label part
     instead would break multi-thumb naming — a resolvable `aria-labelledby`
     outranks the per-thumb `aria-label`, so both thumbs of a range would
     take the group's name. The name itself is unaffected: an
     `aria-labelledby` whose every IDREF dangles is skipped by the accessible
     name computation, which falls through to `aria-label`. */
  return (
    <ArkSlider.Root
      {...props}
      aria-label={toList(ariaLabel)}
      aria-labelledby={toList(ariaLabelledBy)}
      className={className ? `sb-slider ${className}` : 'sb-slider'}
    >
      <ArkSlider.Control className="sb-slider__control">
        <ArkSlider.Track className="sb-slider__track">
          <ArkSlider.Range className="sb-slider__range" />
        </ArkSlider.Track>
        <ArkSlider.Context>
          {(slider) =>
            slider.value.map((_, index) => (
              <ArkSlider.Thumb key={index} index={index} className="sb-slider__thumb">
                <ArkSlider.HiddenInput />
              </ArkSlider.Thumb>
            ))
          }
        </ArkSlider.Context>
      </ArkSlider.Control>
    </ArkSlider.Root>
  )
}
