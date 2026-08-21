/**
 * Compile-time conformance test: the sheet needs a title, a slot and a
 * footer row; the edge it is pinned to is Ark's `swipeDirection`, not an
 * invented prop; and nothing about the open/close interaction leaks in.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening DrawerProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Button } from '../button/Button'
import { Drawer } from './Drawer'

const footer = (
  <>
    <Button size="md" tone="ghost">Reset</Button>
    <Button size="md" tone="primary">Apply</Button>
  </>
)

// Accepted — the drawn sheet, opened from its own trigger.
export const basic = <Drawer trigger={<Button>Filters</Button>} title="FILTERS" footer={footer}>Fields go here</Drawer>

// Accepted — no trigger; opened from code.
export const controlled = <Drawer open onOpenChange={({ open }) => void open} title="FILTERS" footer={footer}>Fields</Drawer>

// Accepted — the title composes, it is not just a string.
export const composed = <Drawer title={<>FILTERS <small>(3)</small></>} footer={footer}>Fields</Drawer>

// Accepted — the close glyph's name is overridable.
export const namedClose = <Drawer closeLabel="Dismiss filters" title="FILTERS" footer={footer}>Fields</Drawer>

// Accepted — the edge is Ark's, and it is direction-aware.
export const leftEdge = <Drawer swipeDirection="start" title="FILTERS" footer={footer}>Fields</Drawer>

// Accepted — the machine's own switches pass through.
export const machineProps = <Drawer modal={false} closeOnEscape={false} preventDragOnScroll title="FILTERS" footer={footer}>Fields</Drawer>

// @ts-expect-error — the header always carries a title; it is required.
export const untitled = <Drawer footer={footer}>Fields</Drawer>

// @ts-expect-error — the sheet is a slot; there is nothing to draw without it.
export const slotless = <Drawer title="FILTERS" footer={footer} />

// @ts-expect-error — the footer rule and its verbs are drawn in every frame.
export const footerless = <Drawer title="FILTERS">Fields</Drawer>

// @ts-expect-error — the edge is swipeDirection, not a placement of our own.
export const placementAsProp = <Drawer placement="right" title="FILTERS" footer={footer}>Fields</Drawer>

// @ts-expect-error — the footer's buttons are composed, not configured.
export const applyAsProp = <Drawer applyLabel="Apply" title="FILTERS" footer={footer}>Fields</Drawer>

// @ts-expect-error — the trigger is rendered asChild, so it must be one element.
export const textTrigger = <Drawer trigger="Filters" title="FILTERS" footer={footer}>Fields</Drawer>
