import type { ReactElement, ReactNode } from 'react'
import { HoverCard as ArkHoverCard, type HoverCardRootProps } from '@ark-ui/react/hover-card'
import { Avatar } from '../avatar/Avatar'
import './HoverCard.css'

/** One cell of the stats row: a mono figure and the thing it counts. */
export type HoverCardStat = {
  value: ReactNode
  label: ReactNode
}

export type HoverCardProps = Omit<HoverCardRootProps, 'children'> & {
  /** Figma text property `Name` — heading/4 on the top line. */
  name: ReactNode
  /** Figma text property `Handle` — mono/sm under the name. */
  handle: ReactNode
  /** Figma text property `Bio` — body/sm, wrapping across the card. */
  bio: ReactNode
  /**
   * The stats row. Figma bakes in two cells ("214 shipped", "12
   * systems") rather than exposing them as properties, so the shape is
   * inferred from what is drawn: any number of cells, each a figure and
   * a label.
   */
  stats: HoverCardStat[]
  /**
   * Initials for the avatar disc, forwarded to {@link Avatar}. Omit them
   * for its user-glyph fallback.
   */
  initials?: string
  /** Photo for the avatar disc, forwarded to {@link Avatar}. */
  src?: string
  /** Accessible name for the photo. Required whenever `src` is given. */
  alt?: string
  /**
   * The thing being previewed — a name, a handle, an avatar. Rendered
   * *as* Ark's trigger via `asChild`, so it must be a single element
   * that takes a ref, and it should be focusable.
   */
  children: ReactElement
  /** Appended after the card's own class, on the drawn box. */
  className?: string
}

/**
 * A rich preview raised on hover: avatar and identity, a bio, and a row
 * of stats on a raised surface with the md hard shadow. Ark drives the
 * open and close delays, the safe-area pointer tracking and the ARIA;
 * the visual design stays as drawn.
 *
 * Four decisions the design did not make:
 *
 * - **No trigger is drawn.** Only the card is, so the trigger is
 *   whatever the caller passes, spread onto their own element with
 *   `asChild` — a hover card usually hangs off a link, and Ark's default
 *   trigger is a `<button>`.
 * - **The stats are not parameterised.** Figma exposes `Name`, `Handle`
 *   and `Bio` as text properties but leaves the two stat cells as drawn
 *   text. Shipping "214 shipped" baked into the component is not an
 *   option, so the row takes the {@link HoverCardStat} list the drawing
 *   describes.
 * - **The avatar is not parameterised either.** The instance is pinned
 *   to Size=lg, Type=Initials, "SB". The size stays pinned — it is the
 *   drawing — and the content travels through `initials` / `src` /
 *   `alt`, which is {@link Avatar}'s own contract.
 * - **No timing is drawn.** The 600ms open / 300ms close delays and the
 *   bottom placement are Ark's defaults; pass `openDelay`, `closeDelay`
 *   or `positioning` to change them.
 *
 * The card is fixed at the drawn 320px and the name is drawn as one
 * unwrapped line, so a long name runs past the card's edge exactly as it
 * does in the frame.
 *
 * Not portalled: the Positioner is placed where the card is written, so
 * an `overflow: hidden` ancestor will clip it. Wrap it in Ark's
 * `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <HoverCard
 *   name="Sasha Brik"
 *   handle="@sbrik"
 *   initials="SB"
 *   bio="Welds design systems for a living."
 *   stats={[
 *     { value: 214, label: 'shipped' },
 *     { value: 12, label: 'systems' },
 *   ]}
 * >
 *   <a href="/u/sbrik">@sbrik</a>
 * </HoverCard>
 * ```
 *
 * Figma: Steelbook Design System › Hover Card (node `33:4`).
 * Built on [Ark UI HoverCard](https://ark-ui.com/docs/components/hover-card).
 */
export function HoverCard({
  name,
  handle,
  bio,
  stats,
  initials,
  src,
  alt,
  children,
  className,
  ...props
}: HoverCardProps) {
  return (
    <ArkHoverCard.Root {...props}>
      <ArkHoverCard.Trigger asChild>{children}</ArkHoverCard.Trigger>
      <ArkHoverCard.Positioner>
        <ArkHoverCard.Content
          className={className ? `sb-hover-card ${className}` : 'sb-hover-card'}
        >
          <div className="sb-hover-card__identity">
            <Avatar size="lg" initials={initials} src={src} alt={alt} />
            <div className="sb-hover-card__names">
              <span className="sb-hover-card__name">{name}</span>
              <span className="sb-hover-card__handle">{handle}</span>
            </div>
          </div>
          <p className="sb-hover-card__bio">{bio}</p>
          <div className="sb-hover-card__stats">
            {stats.map((stat, index) => (
              // eslint-disable-next-line react/no-array-index-key -- the row is drawn, order is the identity
              <div key={index} className="sb-hover-card__stat">
                <span className="sb-hover-card__stat-value">{stat.value}</span>
                <span className="sb-hover-card__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </ArkHoverCard.Content>
      </ArkHoverCard.Positioner>
    </ArkHoverCard.Root>
  )
}
