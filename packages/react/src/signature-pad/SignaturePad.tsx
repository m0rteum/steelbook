import type { ReactNode } from 'react'
import {
  SignaturePad as ArkSignaturePad,
  type SignaturePadRootProps,
} from '@ark-ui/react/signature-pad'
import { PenIcon } from '../icons/PenIcon'
import './SignaturePad.css'

/**
 * "The stroke keeps square caps even in cursive — commitment." The
 * description is binding, and the drawn ink confirms it: the sample
 * vector is a SQUARE-cap stroke. `cap: false` with no taper is what
 * gives perfect-freehand a flat end instead of a rounded one.
 *
 * `fill` is deliberately left unset. Ark writes it inline on the SVG and
 * its own docs note it cannot be a custom property, so leaving it off
 * lets the stylesheet colour the ink from a token instead.
 */
const SQUARE_CAPS = {
  start: { cap: false, taper: 0 },
  end: { cap: false, taper: 0 },
} as const

export type SignaturePadProps = Omit<SignaturePadRootProps, 'children'> & {
  /**
   * The label above the pad. Required — every variant of the Figma
   * component draws it, and it is what names the control.
   */
  label: ReactNode
  /** Centred in the pad while it is empty. */
  placeholder?: ReactNode
  /** The note beside the pen while the pad is empty. */
  hint?: ReactNode
  /**
   * The note beside the pen once something is drawn. The design draws
   * "Signed — 18 AUG 2026", which carries a timestamp the component
   * cannot know, so there is no default: leave it off and `hint` stays.
   */
  signedHint?: ReactNode
  /** The clear button's text. */
  clearLabel?: ReactNode
  /**
   * What the hidden input submits. Ark holds the strokes, not an image,
   * so the value is the caller's: capture it in `onDrawEnd` through
   * `getDataUrl` and hand it back here.
   */
  value?: string
}

/**
 * Ink over a baseline. A 140px surface with an X and a rule to sign
 * above, a centred prompt while it is empty, and a pen-marked note and
 * Clear beneath.
 *
 * The drawing options are overridden in one respect only: the stroke
 * gets flat caps, because the description makes that the point of the
 * component and the drawn ink is a SQUARE-cap vector. Everything else —
 * size, thinning, smoothing, streamline — is Ark's default. Pass
 * `drawing` to change any of it; doing so replaces the caps too, so
 * spread them back in if you want to keep them.
 *
 * Ark's `Guide` is a single element, so it is used as the guide's frame
 * and the X and the rule sit inside it. The prompt and the note are
 * plain elements keyed off `api.empty` — Ark has no part for either.
 *
 * Two departures from the primitive, both flagged in Figma:
 *
 * - **Clear stays visible.** Ark hides it whenever there is nothing to
 *   clear *or* a stroke is in progress, which would make it flicker
 *   mid-signature. Both Figma variants draw it, so `hidden` is
 *   overridden; it is simply inert on an empty pad.
 * - **The ink is coloured from CSS**, not from `drawing.fill`, since
 *   that has to be a literal colour and every value here comes from a
 *   token.
 *
 * The hidden input carries `name` for form submission, but Ark holds
 * strokes rather than an image, so what it submits is the caller's:
 * capture it in `onDrawEnd` through `getDataUrl` and pass it back as
 * `value`.
 *
 * @example
 * ```tsx
 * <SignaturePad
 *   label="Signature"
 *   name="signature"
 *   signedHint={`Signed — ${stamp}`}
 *   onDrawEnd={({ getDataUrl }) => getDataUrl('image/png').then(setUrl)}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Signature Pad (node `44:26`).
 * Built on [Ark UI SignaturePad](https://ark-ui.com/docs/components/signature-pad).
 */
export function SignaturePad({
  label,
  placeholder = 'Sign here',
  hint = 'Draw with mouse, finger, or stylus.',
  signedHint,
  clearLabel = 'Clear',
  drawing = SQUARE_CAPS,
  value = '',
  className,
  ...props
}: SignaturePadProps) {
  return (
    <ArkSignaturePad.Root
      {...props}
      drawing={drawing}
      className={className ? `sb-signature-pad ${className}` : 'sb-signature-pad'}
    >
      <ArkSignaturePad.Label className="sb-signature-pad__label">{label}</ArkSignaturePad.Label>
      <ArkSignaturePad.Control className="sb-signature-pad__pad">
        <ArkSignaturePad.Guide className="sb-signature-pad__guide">
          <span className="sb-signature-pad__mark">X</span>
          <span className="sb-signature-pad__baseline" />
        </ArkSignaturePad.Guide>
        <ArkSignaturePad.Context>
          {(api) =>
            api.empty ? <span className="sb-signature-pad__placeholder">{placeholder}</span> : null
          }
        </ArkSignaturePad.Context>
        <ArkSignaturePad.Segment className="sb-signature-pad__ink" />
      </ArkSignaturePad.Control>
      <div className="sb-signature-pad__actions">
        <span className="sb-signature-pad__pen" aria-hidden="true">
          <PenIcon />
        </span>
        <ArkSignaturePad.Context>
          {(api) => (
            <p className="sb-signature-pad__note">
              {api.empty ? hint : (signedHint ?? hint)}
            </p>
          )}
        </ArkSignaturePad.Context>
        <ArkSignaturePad.ClearTrigger className="sb-signature-pad__clear" hidden={false}>
          {clearLabel}
        </ArkSignaturePad.ClearTrigger>
      </div>
      <ArkSignaturePad.HiddenInput value={value} />
    </ArkSignaturePad.Root>
  )
}
