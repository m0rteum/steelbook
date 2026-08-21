import {
  ColorPicker as ArkColorPicker,
  parseColor,
  type ColorPickerRootProps,
} from '@ark-ui/react/color-picker'
import './ColorPicker.css'

/**
 * The seven swatches the frame draws, in order, each bound to a variable
 * in the file: bg/accent, black, white, red/500, green/500, yellow/500,
 * blue/500.
 *
 * They are literals rather than `var(--sb-*)` because these are values,
 * not styling — Ark parses each into a colour object to compare against
 * the selection and to set on click, and a CSS variable is opaque to
 * that. So this list duplicates seven token values and nothing detects
 * it if one of them changes. Flagged in Figma; it belongs with the
 * other known gaps.
 */
const PRESETS = ['#ff4d00', '#000000', '#ffffff', '#f42b1d', '#00c853', '#ffd600', '#0866ff']

/** The colour the frame is drawn holding — bg/accent. */
const DEFAULT_VALUE = parseColor('#ff4d00')

export type ColorPickerProps = Omit<ColorPickerRootProps, 'children' | 'inline'> & {
  /**
   * The swatch row along the bottom, as CSS colour strings. Defaults to
   * the seven the frame draws.
   */
  presets?: string[]
  /** Appended after the panel's own class, on the drawn box. */
  className?: string
}

/**
 * A colour picker: a saturation field over a hue rail, the current
 * colour beside its hex, and a row of preset swatches. Ark drives the
 * colour maths, both gradients, dragging, the keyboard and the ARIA;
 * the visual design stays as drawn.
 *
 * **The gradients are Ark's, not the stylesheet's.** The saturation
 * field and the hue rail are painted from the live value — Ark writes
 * `background-image` inline on the area, its overlay and the rail — so
 * the only gradients in Steelbook never appear in a Steelbook
 * stylesheet, and the token gate stays intact. They are data, exactly
 * as the description says.
 *
 * **It is always inline.** The frame draws the panel and no trigger, so
 * `inline` is forced rather than exposed: Ark's other mode needs a
 * Trigger and a Positioner that nothing here draws, and passing
 * `inline={false}` would leave a picker that can never open. Raised in
 * Figma — a popover form would be a second component, or a trigger this
 * one grows.
 *
 * Four decisions the design did not make:
 *
 * - **The hue thumb keeps its black fill.** Ark paints the thumb with
 *   the channel's own colour, which on a rainbow rail is very nearly
 *   invisible; the frame draws a black bar with a white ring, which is
 *   both the house look and the readable one. The override goes through
 *   the `style` prop rather than `!important`, since Ark merges a
 *   caller's props after its own and the codebase has no `!important`
 *   in it.
 * - **The area cursor takes Ark's fill.** It is drawn as a ring with a
 *   hole, and Ark fills it with the selected colour — which is the
 *   colour of the field directly beneath it, so the two render alike.
 *   Left alone rather than fought.
 * - **The panel is 272 wide and does not stretch.** Figma hugs it
 *   around a 240 field; that is a picker, not a form control, so it
 *   keeps its size instead of filling like Field.
 * - **The value defaults to bg/accent**, which is what the frame holds.
 *
 * Colours in and out are `@zag-js` colour objects — `value`,
 * `defaultValue` and `onValueChange` all deal in them, because that is
 * what Ark's machine works in. `parseColor` is re-exported from
 * `@ark-ui/react/color-picker` for callers who set one.
 *
 * No label is drawn and none is rendered. Every control inside names
 * itself: Ark labels the field "saturation and brightness", the rail
 * "hue", the input "hex" and each preset "select <colour> as the
 * colour".
 *
 * @example
 * ```tsx
 * import { parseColor } from '@ark-ui/react/color-picker'
 *
 * <ColorPicker
 *   defaultValue={parseColor('#0866ff')}
 *   onValueChange={({ valueAsString }) => setBrand(valueAsString)}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Color Picker (node `43:2`).
 * Built on [Ark UI ColorPicker](https://ark-ui.com/docs/components/color-picker).
 */
export function ColorPicker({
  presets = PRESETS,
  className,
  defaultValue = DEFAULT_VALUE,
  ...props
}: ColorPickerProps) {
  return (
    <ArkColorPicker.Root
      {...props}
      inline
      defaultValue={defaultValue}
      className="sb-color-picker-root"
    >
      <ArkColorPicker.Content
        className={className ? `sb-color-picker ${className}` : 'sb-color-picker'}
      >
        <ArkColorPicker.Area className="sb-color-picker__area">
          <ArkColorPicker.AreaBackground className="sb-color-picker__area-background" />
          <ArkColorPicker.AreaThumb className="sb-color-picker__area-thumb" />
        </ArkColorPicker.Area>

        <ArkColorPicker.ChannelSlider channel="hue" className="sb-color-picker__hue">
          <ArkColorPicker.ChannelSliderTrack className="sb-color-picker__hue-track" />
          {/* Ark paints this with the hue under it, which the frame does
              not: it draws a black bar ringed in white. Ark merges these
              props after its own, so the style lands.

              Black the primitive, not bg/inverse — the thumb rides on
              the spectrum rather than on the panel, and the spectrum is
              the same in either theme. Figma leaves this fill unbound
              for the same reason, as it does the two white rings. */}
          <ArkColorPicker.ChannelSliderThumb
            className="sb-color-picker__hue-thumb"
            style={{ background: 'var(--sb-black)' }}
          />
        </ArkColorPicker.ChannelSlider>

        <div className="sb-color-picker__value">
          <ArkColorPicker.ValueSwatch className="sb-color-picker__current" />
          <ArkColorPicker.ChannelInput channel="hex" className="sb-color-picker__hex" />
        </div>

        <ArkColorPicker.SwatchGroup className="sb-color-picker__presets">
          {presets.map((preset) => (
            <ArkColorPicker.SwatchTrigger
              key={preset}
              value={preset}
              className="sb-color-picker__preset"
            >
              <ArkColorPicker.Swatch value={preset} className="sb-color-picker__preset-swatch" />
            </ArkColorPicker.SwatchTrigger>
          ))}
        </ArkColorPicker.SwatchGroup>

        <ArkColorPicker.HiddenInput />
      </ArkColorPicker.Content>
    </ArkColorPicker.Root>
  )
}
