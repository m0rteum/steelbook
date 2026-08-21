import type { ReactNode } from 'react'
import { Carousel as ArkCarousel, type CarouselRootProps } from '@ark-ui/react/carousel'
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon'
import { ChevronRightIcon } from '../icons/ChevronRightIcon'
import './Carousel.css'

/**
 * The 20 Figma leaves between one slide and the next, and the 40 it
 * leaves between the viewport edge and the current slide — the gutter
 * the neighbours peek through.
 *
 * Both are handed to Ark as CSS values rather than numbers: it writes
 * the first into `--slide-spacing` and the second straight onto the
 * scroller's `padding-inline`, and never does arithmetic on either in
 * JS. Pointing them at local properties keeps every measurement in the
 * stylesheet, where the tokens are.
 */
const SPACING = 'var(--sb-carousel-spacing)'
const PADDING = 'var(--sb-carousel-padding)'

export type CarouselProps = Omit<
  CarouselRootProps,
  'children' | 'slideCount' | 'orientation'
> & {
  /**
   * What goes in the slides, in order. One entry per slide; Ark counts
   * them and derives the pages, the snap points and the indicators.
   */
  slides: ReactNode[]
  /**
   * What the carousel is showing. Required: Ark makes the root a
   * `region` landmark with a roledescription of "carousel", which tells
   * a screen reader user the shape of the thing but nothing about what
   * is in it. No library can supply this, the same way none can name an
   * icon-only button.
   */
  label: string
  /** Appended after the carousel's own class, on the drawn box. */
  className?: string
}

/**
 * A slide viewport with its neighbours peeking through the gutters, two
 * black nav blocks riding the edges, and a row of square indicators
 * below — the current one stretched and filled orange. Ark drives the
 * scrolling, the snapping, the paging maths, the keyboard and the ARIA;
 * the visual design stays as drawn.
 *
 * **The viewport is the scroller.** Ark puts the overflow, the scroll
 * snapping and the gutters on the item group, so that part carries the
 * drawn `bg/muted` box and its border. The nav blocks cannot live
 * inside it — they would scroll away and be clipped — so they sit in a
 * wrapper alongside it and are positioned against that.
 *
 * **The geometry is three numbers.** `slidesPerPage` 1, spacing 20 and
 * a 40 gutter are all Ark needs to reproduce the frame: it sizes each
 * slide as `100%` of what is left after the gutters, which is the drawn
 * 480 in a 560 viewport, and the 18 of each neighbour that shows on
 * either side falls out of the same arithmetic rather than being placed.
 *
 * Five decisions the design did not make:
 *
 * - **The white slide box is the item's skin, not the demo's.** Each
 *   `slide` frame carries `bg/surface` and a 2px border of its own,
 *   distinct from the `bg/muted` viewport behind it, so callers drop
 *   content into a drawn box rather than styling one themselves. If
 *   that box was only there to make the slides legible on the canvas,
 *   it is one rule to remove. Raised in Figma.
 * - **The carousel fills its container, and its height comes from its
 *   slides.** The drawn 560 x 320 is the size of the frame it was drawn
 *   in, not an intrinsic size — the stories use it so they measure
 *   against this file.
 * - **Nothing is drawn for a nav block that cannot go anywhere.** Ark
 *   disables Previous on the first page and Next on the last, so both
 *   borrow the disabled skin the rest of the system uses. Pass `loop`
 *   and neither ever disables.
 * - **No focus treatment is drawn.** The nav blocks and the indicators
 *   take the house 3px `border/focus` ring — inset on the 40 blocks,
 *   outside the 10 dots, which a 3px inset ring would swallow whole.
 * - **One orientation.** Ark can run this vertically; the file draws
 *   only the horizontal case, and a vertical carousel would need its
 *   own gutters, its own nav placement and its own indicator row. The
 *   prop is closed rather than shipping a skin nobody drew.
 *
 * Slides are keyed by position, which is what Ark does too — it ids
 * every item, snap point and indicator by index, and `data-index` is
 * how the machine addresses them.
 *
 * @example
 * ```tsx
 * <Carousel
 *   label="Product photography"
 *   slides={photos.map((photo) => (
 *     <img key={photo.id} src={photo.src} alt={photo.alt} />
 *   ))}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Carousel (node `46:591`).
 * Built on [Ark UI Carousel](https://ark-ui.com/docs/components/carousel).
 */
export function Carousel({ slides, label, className, ...props }: CarouselProps) {
  return (
    <ArkCarousel.Root
      spacing={SPACING}
      padding={PADDING}
      {...props}
      className={className ? `sb-carousel ${className}` : 'sb-carousel'}
      aria-label={label}
      slideCount={slides.length}
    >
      <div className="sb-carousel__frame">
        <ArkCarousel.ItemGroup className="sb-carousel__viewport">
          {slides.map((slide, index) => (
            <ArkCarousel.Item key={index} index={index} className="sb-carousel__slide">
              {slide}
            </ArkCarousel.Item>
          ))}
        </ArkCarousel.ItemGroup>

        {/* Ark names both from its own translations — "Previous slide"
            and "Next slide" — which is what an icon-only control needs. */}
        <ArkCarousel.PrevTrigger className="sb-carousel__nav sb-carousel__nav--prev">
          <ChevronLeftIcon className="sb-carousel__nav-glyph" />
        </ArkCarousel.PrevTrigger>
        <ArkCarousel.NextTrigger className="sb-carousel__nav sb-carousel__nav--next">
          <ChevronRightIcon className="sb-carousel__nav-glyph" />
        </ArkCarousel.NextTrigger>
      </div>

      {/* One dot per page, not per slide: at `slidesPerPage` 2 a ten
          slide carousel has five of them. Ark publishes the snap points
          it derived, so the row is read off those rather than counted. */}
      <ArkCarousel.IndicatorGroup className="sb-carousel__indicators">
        <ArkCarousel.Context>
          {(api) =>
            api.pageSnapPoints.map((_, index) => (
              <ArkCarousel.Indicator key={index} index={index} className="sb-carousel__dot" />
            ))
          }
        </ArkCarousel.Context>
      </ArkCarousel.IndicatorGroup>
    </ArkCarousel.Root>
  )
}
