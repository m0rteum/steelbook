/**
 * Compile-time conformance test: the trigger's title and the revealed
 * content are both required, and Open is Ark's own state — reached
 * through `open` / `defaultOpen`, never a `state` prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening the props type breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Collapsible } from './Collapsible'

// Accepted — the drawn row, closed.
export const basic = (
  <Collapsible title="Show advanced options">Nothing here is drawn yet.</Collapsible>
)

// Accepted — Open is Ark's, reached through its own props.
export const open = (
  <Collapsible title="Show advanced options" defaultOpen onOpenChange={() => {}}>
    Advanced options.
  </Collapsible>
)

// Accepted — the house disabled skin rides Ark's prop.
export const disabled = (
  <Collapsible title="Show advanced options" disabled>
    Advanced options.
  </Collapsible>
)

// @ts-expect-error — the row is a button, and a button with no label has no name.
export const titleless = <Collapsible>Advanced options.</Collapsible>

// @ts-expect-error — a disclosure with nothing behind it has nothing to do.
export const bodyless = <Collapsible title="Show advanced options" />

// @ts-expect-error — Open is Ark's state, never a state prop.
export const stateAsProp = <Collapsible title="A" state="open">B</Collapsible>
