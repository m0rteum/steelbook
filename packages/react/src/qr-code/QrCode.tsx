import { QrCode as ArkQrCode, type QrCodeRootProps } from '@ark-ui/react/qr-code'
import './QrCode.css'

export type QrCodeProps = Omit<QrCodeRootProps, 'children'> & {
  /** The string to encode. */
  value: string
  /**
   * Names the code for anyone who cannot scan it — say what it leads
   * to, not that it is a QR code. Without a name the graphic is marked
   * decorative and skipped by screen readers, which is the honest
   * reading of a matrix nobody can read aloud.
   */
  'aria-label'?: string
  /** As `aria-label`, by reference to visible text. */
  'aria-labelledby'?: string
}

/**
 * Machine-readable ornament: a real QR code generated from `value`,
 * modules in `bg/inverse` on a `bg/surface` quiet zone, so the whole
 * thing inverts in dark mode.
 *
 * The Figma component is 111 hand-placed rectangles — a stand-in whose
 * finder squares and timing strips are real and whose data is
 * placeholder ("regenerate in production"). None of that geometry is
 * reproduced here: Ark encodes the value and emits the matrix as one
 * SVG path, which is what the annotation asks for. What is reproduced
 * is the frame — the 2px border, the quiet zone, and the module
 * colours.
 *
 * Ark's frame carries no quiet zone of its own, so the drawn one comes
 * from the frame's padding; at the drawn 125px that lands the matrix
 * exactly 10px inside the edge, as Figma has it. Size is a custom
 * property, since the design resizes freely and the modules scale with
 * it.
 *
 * @example
 * ```tsx
 * <QrCode value="https://steelbook.design" aria-label="Link to steelbook.design" />
 * ```
 *
 * Figma: Steelbook Design System › QR Code (node `25:114`).
 * Built on [Ark UI QrCode](https://ark-ui.com/docs/components/qr-code).
 */
export function QrCode({
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: QrCodeProps) {
  const named = ariaLabel != null || ariaLabelledBy != null
  const frameProps = named
    ? { role: 'img', 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy }
    : { 'aria-hidden': true }

  return (
    <ArkQrCode.Root
      {...props}
      className={className ? `sb-qr-code ${className}` : 'sb-qr-code'}
    >
      <ArkQrCode.Frame {...frameProps} className="sb-qr-code__frame">
        <ArkQrCode.Pattern className="sb-qr-code__pattern" />
      </ArkQrCode.Frame>
    </ArkQrCode.Root>
  )
}
