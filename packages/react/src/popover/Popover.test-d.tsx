/**
 * Compile-time conformance test: the two drawn text properties are
 * required, the action slot is the caller's, the trigger is the caller's
 * own element, and nothing the design does not draw — an arrow, a state
 * axis — can be asked for.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening PopoverProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Popover } from './Popover'
import { Button } from '../button/Button'

const trigger = <Button tone="secondary">Share</Button>
const action = <Button size="sm">Copy link</Button>

// Accepted — the drawn surface.
export const basic = <Popover trigger={trigger} title="Share this view" body="Anyone with the link can inspect tokens.">{action}</Popover>

// Accepted — open is the caller's to control.
export const controlled = <Popover trigger={trigger} title="T" body="B" open onOpenChange={({ open }) => void open}>{action}</Popover>

// Accepted — placement is undrawn, so it stays Ark's to set.
export const placement = <Popover trigger={trigger} title="T" body="B" positioning={{ placement: 'top' }}>{action}</Popover>

// Accepted — Ark names the close glyph; the label is translatable.
export const translated = <Popover trigger={trigger} title="T" body="B" translations={{ closeTriggerLabel: 'Fermer' }}>{action}</Popover>

// @ts-expect-error — Hover / Focus are CSS, never a prop.
export const stateAsProp = <Popover trigger={trigger} title="T" body="B" state="Hover">{action}</Popover>

// @ts-expect-error — Title is drawn and names the dialog; it is not optional.
export const titleless = <Popover trigger={trigger} body="B">{action}</Popover>

// @ts-expect-error — Body is drawn and describes the dialog; it is not optional.
export const bodyless = <Popover trigger={trigger} title="T">{action}</Popover>

// @ts-expect-error — the surface exists to hold the task; the slot is not optional.
export const actionless = <Popover trigger={trigger} title="T" body="B" />

// @ts-expect-error — the surface cannot open itself; a trigger is required.
export const triggerless = <Popover title="T" body="B">{action}</Popover>

// @ts-expect-error — the trigger replaces Ark's button, so it must be one element.
export const textTrigger = <Popover trigger="Share" title="T" body="B">{action}</Popover>

// @ts-expect-error — no arrow is drawn, so there is nothing to switch on.
export const arrow = <Popover trigger={trigger} title="T" body="B" arrow>{action}</Popover>
