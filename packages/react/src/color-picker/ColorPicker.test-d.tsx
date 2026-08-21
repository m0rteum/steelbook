/**
 * Compile-time conformance test: the panel draws itself, so there is
 * nothing to compose into it; `inline` is forced rather than chosen; and
 * colours travel as Ark's colour objects, not strings.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ColorPickerProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { parseColor } from '@ark-ui/react/color-picker'
import { ColorPicker } from './ColorPicker'

// Accepted — the drawn panel on its drawn colour.
export const basic = <ColorPicker />

// Accepted — a colour of the caller's, as an Ark colour object.
export const withValue = <ColorPicker defaultValue={parseColor('#0866ff')} />

// Accepted — selection is the caller's to control.
export const controlled = <ColorPicker value={parseColor('#00c853')} onValueChange={({ valueAsString }) => void valueAsString} />

// Accepted — the swatch row is replaceable.
export const withPresets = <ColorPicker presets={['#000000', '#ffffff']} />

// Accepted — the machine's own switches pass through.
export const machineProps = <ColorPicker disabled readOnly name="brand" format="hsla" />

// Accepted — native div attributes reach the drawn panel.
export const nativeAttrs = <ColorPicker id="brand-picker" data-testid="picker" />

// @ts-expect-error — the panel is fully drawn; nothing composes into it.
export const withChildren = <ColorPicker>extra</ColorPicker>

// @ts-expect-error — the frame draws no trigger, so the picker is always inline.
export const notInline = <ColorPicker inline={false} />

// @ts-expect-error — colours are Ark colour objects, not strings.
export const stringValue = <ColorPicker defaultValue="#ff4d00" />

// @ts-expect-error — the presets are colour strings, not objects.
export const objectPresets = <ColorPicker presets={[{ value: '#000000' }]} />

// @ts-expect-error — the gradients are Ark's, computed from the value.
export const gradientAsProp = <ColorPicker areaGradient="linear-gradient(red, blue)" />
