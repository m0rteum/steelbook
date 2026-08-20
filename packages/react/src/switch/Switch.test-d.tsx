/**
 * Compile-time conformance test: a Switch always carries an accessible name,
 * and `Interaction` is a skin rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening SwitchProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Switch } from './Switch'

// Accepted — labelled, uncontrolled.
export const basic = <Switch defaultChecked>Dark mode</Switch>

// Accepted — controlled, with the label taken off screen but not removed.
export const controlled = (
  <Switch hideLabel checked={false} onCheckedChange={({ checked }) => void checked}>
    Mute notifications
  </Switch>
)

// Accepted — Interaction=Disabled is reached through the native prop.
export const disabled = <Switch disabled>Dark mode</Switch>

// @ts-expect-error — a switch must carry a label.
export const unlabelled = <Switch />

// @ts-expect-error — Hover/Focus are driven by the user, never by a prop.
export const interactionAsProp = <Switch interaction="Hover">Dark mode</Switch>
