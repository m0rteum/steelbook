/**
 * Compile-time conformance test: the chip carries exactly one drawn
 * property (`Label`), the trigger is the caller's own element, and
 * nothing the design does not draw — an arrow, a state axis — can be
 * asked for.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening TooltipProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Tooltip } from './Tooltip'

// Accepted — the drawn chip on a focusable control.
export const basic = <Tooltip label="Copy to clipboard"><button type="button">Copy</button></Tooltip>

// Accepted — open is the caller's to control.
export const controlled = <Tooltip label="Copy" open onOpenChange={({ open }) => void open}><button type="button">Copy</button></Tooltip>

// Accepted — the delays are Ark's default, not a design decision.
export const timing = <Tooltip label="Copy" openDelay={0} closeDelay={0}><button type="button">Copy</button></Tooltip>

// Accepted — placement is undrawn too, so it stays Ark's to set.
export const placement = <Tooltip label="Copy" positioning={{ placement: 'top' }}><button type="button">Copy</button></Tooltip>

// @ts-expect-error — Hover / Focus are CSS, never a prop.
export const stateAsProp = <Tooltip label="Copy" state="Hover"><button type="button">Copy</button></Tooltip>

// @ts-expect-error — the chip is nothing without its label.
export const unlabelled = <Tooltip><button type="button">Copy</button></Tooltip>

// @ts-expect-error — no arrow is drawn, so there is nothing to switch on.
export const arrow = <Tooltip label="Copy" arrow><button type="button">Copy</button></Tooltip>

// @ts-expect-error — the trigger replaces Ark's button, so it must be one element.
export const textTrigger = <Tooltip label="Copy">Copy</Tooltip>
