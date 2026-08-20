/**
 * Compile-time conformance test for the Figma Toggle Group: every item is
 * an icon-only chip, so [sb-conformance-a11y-name] applies to items exactly
 * as it does to the standalone Toggle, and item identity (`value`) is not
 * optional.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so weakening the props breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

// Accepted — the drawn default: three chips, first pressed.
export const asDrawn = (
  <ToggleGroup defaultValue={['a']}>
    <ToggleGroupItem value="a" aria-label="First" />
    <ToggleGroupItem value="b" aria-label="Second" />
    <ToggleGroupItem value="c" aria-label="Third" />
  </ToggleGroup>
)

// Accepted — controlled group; item named by reference.
export const controlled = (
  <ToggleGroup value={['bold']} onValueChange={({ value }) => void value}>
    <ToggleGroupItem value="bold" aria-labelledby="bold-heading" />
  </ToggleGroup>
)

// Accepted — Interaction=Disabled is reached through the native-style prop,
// on the group or on a single chip.
export const disabledGroup = (
  <ToggleGroup disabled>
    <ToggleGroupItem value="a" aria-label="First" />
  </ToggleGroup>
)
export const disabledItem = <ToggleGroupItem value="a" aria-label="First" disabled />

// @ts-expect-error — an icon-only chip must carry an accessible name.
export const unnamedItem = <ToggleGroupItem value="a" />

// @ts-expect-error — exactly one name source, never both.
export const doubleNamedItem = <ToggleGroupItem value="a" aria-label="First" aria-labelledby="first-heading" />

// @ts-expect-error — a chip without a value has no identity in the group.
export const valuelessItem = <ToggleGroupItem aria-label="First" />

// @ts-expect-error — Hover/Focus are driven by the user, never by a prop.
export const stateAsProp = <ToggleGroup state="Hover" />
