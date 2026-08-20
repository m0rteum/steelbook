import { useEffect, useRef, type RefObject } from 'react'
import {
  Editable as ArkEditable,
  useEditableContext,
  type EditableRootProps,
} from '@ark-ui/react/editable'
import { CheckIcon } from '../icons/CheckIcon'
import { PenIcon } from '../icons/PenIcon'
import { XIcon } from '../icons/XIcon'
import './Editable.css'

export type EditableProps = Omit<EditableRootProps, 'children'>

/**
 * Puts the caret in the input when Edit opens.
 *
 * Ark already tries to: it calls `select()` on the input inside a
 * `requestAnimationFrame` when the machine enters Edit. That frame can
 * beat React's commit, and until it lands the input is still
 * unfocusable — `visibility: hidden` under `autoResize`, `hidden`
 * without it — so the focus call is a no-op and the value renders in an
 * input nobody is typing into. Verified by hand: click the value, type,
 * and the keystrokes go nowhere.
 *
 * An effect runs after the commit instead, when the input is focusable.
 * It is a no-op whenever Ark's own attempt did land, so this only fills
 * in the frames where the race is lost.
 */
function FocusOnEdit({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  const { editing } = useEditableContext()

  useEffect(() => {
    if (!editing) return
    const input = inputRef.current
    if (!input || input.ownerDocument.activeElement === input) return
    input.select()
  }, [editing, inputRef])

  return null
}

/**
 * Text that admits it can change. Preview shows the value with a pen
 * hint; Edit swaps to a focus-ringed input with an orange confirm and a
 * muted cancel.
 *
 * The Figma `Mode` axis is Ark's own state, not a prop: clicking the
 * value enters Edit, and confirm / cancel (or Enter / Escape) leave it.
 * Reach for `defaultEdit` to open in Edit mode.
 *
 * Two defaults differ from Ark's, both to match what the design draws:
 * `activationMode` is `click` (the page's own note reads "Click the
 * text, get an input"; Ark defaults to `focus`), and `autoResize` is on,
 * which is what makes the control hug its content in both modes the way
 * the drawn widths do.
 *
 * The pen is decorative — Ark names the preview and both triggers from
 * its `translations` ("edit", "submit", "cancel"), which is also where
 * you translate them.
 *
 * Focus and disabled are not drawn by the design; both take the house
 * treatments so a keyboard user can see where they are and a dead
 * control cannot pass for a live one.
 *
 * @example
 * ```tsx
 * <Editable defaultValue="Project title" onValueCommit={({ value }) => rename(value)} />
 * ```
 *
 * Figma: Steelbook Design System › Editable (node `26:15`).
 * Built on [Ark UI Editable](https://ark-ui.com/docs/components/editable).
 */
export function Editable({
  className,
  activationMode = 'click',
  autoResize = true,
  ...props
}: EditableProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ArkEditable.Root
      {...props}
      activationMode={activationMode}
      autoResize={autoResize}
      className={className ? `sb-editable ${className}` : 'sb-editable'}
    >
      <FocusOnEdit inputRef={inputRef} />
      <ArkEditable.Area className="sb-editable__area">
        <ArkEditable.Preview className="sb-editable__preview">
          <ArkEditable.Context>{(editable) => editable.valueText}</ArkEditable.Context>
          <span className="sb-editable__hint" aria-hidden="true">
            <PenIcon />
          </span>
        </ArkEditable.Preview>
        <ArkEditable.Input ref={inputRef} className="sb-editable__input" />
      </ArkEditable.Area>
      <ArkEditable.SubmitTrigger className="sb-editable__action sb-editable__action--confirm">
        <CheckIcon />
      </ArkEditable.SubmitTrigger>
      <ArkEditable.CancelTrigger className="sb-editable__action sb-editable__action--cancel">
        <XIcon />
      </ArkEditable.CancelTrigger>
    </ArkEditable.Root>
  )
}
