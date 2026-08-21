/**
 * Compile-time conformance test: the card needs a question, a cost and
 * the verbs; `Tone` is expressed by which Button fills the slot, not by
 * a prop; and nothing about the open/close interaction leaks in either.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening DialogProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Button } from '../button/Button'
import { Dialog } from './Dialog'

const actions = (
  <>
    <Button tone="ghost">Cancel</Button>
    <Button tone="primary">Publish</Button>
  </>
)

// Accepted — Tone=Default, opened from its own trigger.
export const basic = <Dialog trigger={<Button>Publish</Button>} title="PUBLISH THIS VERSION?" body="Everyone with the link sees the new version.">{actions}</Dialog>

// Accepted — Tone=Danger is the danger Button in the slot, plus the matching role.
export const danger = <Dialog role="alertdialog" title="DELETE 214 FILES?" body="There is no undo."><Button tone="ghost">Cancel</Button><Button tone="danger">Delete forever</Button></Dialog>

// Accepted — no trigger; opened from code.
export const controlled = <Dialog open onOpenChange={({ open }) => void open} title="PUBLISH?" body="Body">{actions}</Dialog>

// Accepted — title and body compose, they are not just strings.
export const composed = <Dialog title={<>PUBLISH <em>THIS</em> VERSION?</>} body={<>Everyone sees it <strong>now</strong>.</>}>{actions}</Dialog>

// Accepted — the close glyph's name is overridable.
export const namedClose = <Dialog closeLabel="Dismiss" title="PUBLISH?" body="Body">{actions}</Dialog>

// Accepted — the machine's own switches pass through.
export const machineProps = <Dialog closeOnEscape={false} closeOnInteractOutside={false} modal title="PUBLISH?" body="Body">{actions}</Dialog>

// @ts-expect-error — a decision with no verbs is not a state the design draws.
export const actionless = <Dialog title="PUBLISH?" body="Body" />

// @ts-expect-error — the headline is what the dialog asks; it is required.
export const untitled = <Dialog body="Body">{actions}</Dialog>

// @ts-expect-error — the body says what the decision costs; it is required.
export const bodyless = <Dialog title="PUBLISH?">{actions}</Dialog>

// @ts-expect-error — Tone is which Button fills the slot, not a prop on the card.
export const toneAsProp = <Dialog tone="danger" title="PUBLISH?" body="Body">{actions}</Dialog>

// @ts-expect-error — the confirming button is composed, not configured.
export const confirmAsProp = <Dialog confirmLabel="Publish" title="PUBLISH?" body="Body">{actions}</Dialog>

// @ts-expect-error — the trigger is rendered asChild, so it must be one element.
export const textTrigger = <Dialog trigger="Publish" title="PUBLISH?" body="Body">{actions}</Dialog>
