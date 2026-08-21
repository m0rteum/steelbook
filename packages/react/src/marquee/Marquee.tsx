import type { CSSProperties, ReactNode } from 'react'
import { Marquee as ArkMarquee, type MarqueeRootProps } from '@ark-ui/react/marquee'
import './Marquee.css'

/**
 * The gap Figma draws between every item on the strip — phrase to pip,
 * pip to phrase alike. Ark halves it into each item's inline margin, so
 * the first item's half also supplies the 16 the frame draws as left
 * padding; the strip itself takes none.
 *
 * Passed as a CSS value rather than a number because Ark writes it
 * straight into `--marquee-spacing` and never does arithmetic on it in
 * JS — the duration comes from measuring the DOM.
 */
const MARQUEE_SPACING = 'var(--sb-gap-xl)'

export type MarqueeTone = 'inverse' | 'accent'

export type MarqueeProps = Omit<
  MarqueeRootProps,
  'children' | 'translations'
> & {
  /**
   * The phrase that repeats. Required — a ticker with nothing to say is
   * not a state the design draws.
   */
  children: ReactNode
  /**
   * What the strip is announcing. Required: Ark makes the root a
   * `region` landmark and would otherwise name it "Marquee content",
   * which tells a screen reader user nothing about why they landed
   * there. No library can supply this, the same way none can name an
   * icon-only button.
   */
  label: string
  /** Figma's `Tone` axis. Inverse is the drawn default. */
  tone?: MarqueeTone
  /** Appended after the strip's own classes, on the drawn box. */
  className?: string
}

/**
 * A ticker: repeating mono caps separated by orange pips, clipped at
 * both edges and scrolling horizontally. Ark drives the measuring,
 * cloning, pausing and the ARIA; the visual design stays as drawn.
 *
 * The `Tone` axis is a prop rather than CSS, because it is a choice the
 * caller makes about the strip rather than a state the strip enters:
 *
 * | Figma          | Code               |
 * | -------------- | ------------------ |
 * | Tone=Inverse   | the base skin      |
 * | Tone=Accent    | `.sb-marquee--accent` |
 *
 * Five decisions the design did not make:
 *
 * - **It actually moves.** The description says to "animate the strip
 *   horizontally in production", and a static frame is all Figma can
 *   draw. Ark measures the content and publishes a duration, a
 *   translate distance and a delay; the keyframes here consume them.
 *   Ark ships no keyframes of its own.
 * - **It can be stopped.** Motion that repeats for more than five
 *   seconds needs a way to pause it (WCAG 2.2.2), so
 *   `pauseOnInteraction` defaults to true — hovering or focusing the
 *   strip halts it — and `prefers-reduced-motion: reduce` parks it
 *   outright. Both are overridable; neither is drawn.
 * - **The strip fills the width it is given.** Figma fixes it at 960,
 *   but a ticker is a full-bleed device and 960 is the frame's width,
 *   not the component's. The drawn 48 height is kept, since that is
 *   what sets the type's optical centring.
 * - **The phrase repeats as many times as fit.** `autoFill` defaults to
 *   true so Ark clones the unit until the strip is covered; the drawn
 *   four-phrase run is what 960 happens to hold. Clones are
 *   `aria-hidden`, so the phrase is announced once.
 * - **The first glyph sits 18 from the outer edge, not 16.** Figma
 *   measures its 16 padding from inside a 2px inside stroke while the
 *   spacing that produces it is a margin outside the border box.
 *   Compensating would pull the first item 2px closer than every
 *   following one, which is visible the moment the strip moves and the
 *   2px at the clipped edge is not. Flagged in Figma.
 *
 * The pip is drawn as a 10x10 square, which is off the space scale
 * (space-2 is 8, space-3 is 12); it is carried locally and flagged. So
 * is the type: mono/overline's family, weight, tracking and casing are
 * exactly what the strip draws, but at 16px on auto leading rather than
 * overline's 12/1.2 — an unnamed style that likely wants to become a
 * real one.
 *
 * @example
 * ```tsx
 * <Marquee label="Release announcement" tone="accent">
 *   STEELBOOK V1.0
 * </Marquee>
 * ```
 *
 * Figma: Steelbook Design System › Marquee (node `40:530`).
 * Built on [Ark UI Marquee](https://ark-ui.com/docs/components/marquee).
 */
export function Marquee({
  children,
  label,
  tone = 'inverse',
  className,
  spacing = MARQUEE_SPACING,
  autoFill = true,
  pauseOnInteraction = true,
  ...props
}: MarqueeProps) {
  const classes = ['sb-marquee']
  if (tone === 'accent') classes.push('sb-marquee--accent')
  if (className) classes.push(className)

  return (
    <ArkMarquee.Root
      {...props}
      spacing={spacing}
      autoFill={autoFill}
      pauseOnInteraction={pauseOnInteraction}
      translations={{ root: label }}
      className={classes.join(' ')}
    >
      <ArkMarquee.Viewport className="sb-marquee__viewport">
        <ArkMarquee.Context>
          {(api) => (
            /* Content renders itself once per copy — it reads the count
               off the machine — so this is the repeating unit, not one
               item. The fill count rides along for the stylesheet; see
               the duration note there. */
            <ArkMarquee.Content
              className="sb-marquee__content"
              style={{ '--sb-marquee-cycles': api.multiplier } as CSSProperties}
            >
              <ArkMarquee.Item className="sb-marquee__phrase">{children}</ArkMarquee.Item>
              <ArkMarquee.Item className="sb-marquee__pip" aria-hidden="true" />
            </ArkMarquee.Content>
          )}
        </ArkMarquee.Context>
      </ArkMarquee.Viewport>
    </ArkMarquee.Root>
  )
}
