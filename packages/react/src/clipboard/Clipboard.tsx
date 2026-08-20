import type { ReactNode } from 'react'
import { Clipboard as ArkClipboard, type ClipboardRootProps } from '@ark-ui/react/clipboard'
import { CheckIcon } from '../icons/CheckIcon'
import { CopyIcon } from '../icons/CopyIcon'
import './Clipboard.css'

export type ClipboardProps = Omit<ClipboardRootProps, 'children'> & {
  /**
   * The label above the well. Required — every variant of the Figma
   * component draws it, and it is what names the value for screen
   * readers.
   */
  label: ReactNode
}

/**
 * Copy-to-clipboard group. A mono value in a muted well with an orange
 * trigger fused to its right, sharing one 2px border; the trigger flips
 * green with a check once the value is copied.
 *
 * The Figma `Copied` axis is Ark's own state, not a prop: it turns on
 * when the trigger copies and resets itself after `timeout`.
 *
 * The well is Ark's read-only input rather than static text, so the
 * value can be selected by hand — it selects itself on focus — and the
 * label keeps a real control to point at.
 *
 * The group is fluid: the design draws it hugging its sample key, but a
 * value of any length has to fit its container, so the well takes the
 * space and the trigger stays 40px. Focus is not drawn by the design;
 * both the well and the trigger take the house 3px accent ring, drawn
 * inside so the fused seam does not move.
 *
 * @example
 * ```tsx
 * <Clipboard label="API key" value="sb_live_4d00ff2b1d" />
 * ```
 *
 * Figma: Steelbook Design System › Clipboard (node `26:107`).
 * Built on [Ark UI Clipboard](https://ark-ui.com/docs/components/clipboard).
 */
export function Clipboard({ label, className, ...props }: ClipboardProps) {
  return (
    <ArkClipboard.Root
      {...props}
      className={className ? `sb-clipboard ${className}` : 'sb-clipboard'}
    >
      <ArkClipboard.Label className="sb-clipboard__label">{label}</ArkClipboard.Label>
      <ArkClipboard.Control className="sb-clipboard__group">
        <ArkClipboard.Input className="sb-clipboard__value" />
        <ArkClipboard.Trigger className="sb-clipboard__trigger">
          <ArkClipboard.Indicator className="sb-clipboard__glyph" copied={<CheckIcon />}>
            <CopyIcon />
          </ArkClipboard.Indicator>
        </ArkClipboard.Trigger>
      </ArkClipboard.Control>
    </ArkClipboard.Root>
  )
}
