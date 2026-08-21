/**
 * Compile-time conformance test: the slides are data, the region has to
 * be named, the count is derived rather than declared, and the drawn
 * orientation is the only one.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening CarouselProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Carousel } from './Carousel'

const slides = [<p key="a">One</p>, <p key="b">Two</p>, <p key="c">Three</p>]

// Accepted — the drawn carousel.
export const Basic = <Carousel label="Product photography" slides={slides} />

// Accepted — a class of the caller's, on the drawn box.
export const Styled = <Carousel label="Gallery" slides={slides} className="my-carousel" />

// Accepted — the machine's own switches pass through.
export const MachineProps = (
  <Carousel
    label="Gallery"
    slides={slides}
    slidesPerPage={2}
    slidesPerMove={1}
    defaultPage={1}
    loop
    allowMouseDrag
    autoplay={{ delay: 3000 }}
    snapType="proximity"
    onPageChange={({ page }) => void page}
  />
)

// Accepted — the drawn measurements can be overridden per instance.
export const Measurements = (
  <Carousel label="Gallery" slides={slides} spacing="0px" padding="0px" />
)

// Accepted — the names Ark supplies can be replaced for another language.
export const Translated = (
  <Carousel
    label="Produktfotos"
    slides={slides}
    translations={{
      nextTrigger: 'Nächstes Bild',
      prevTrigger: 'Vorheriges Bild',
      indicator: (index) => `Zu Bild ${index + 1}`,
      item: (index, count) => `${index + 1} von ${count}`,
      autoplayStart: 'Diashow starten',
      autoplayStop: 'Diashow stoppen',
    }}
  />
)

export const Rejections = (
  <>
    {/* @ts-expect-error — slides are a prop, not children; Ark ids each one by index. */}
    <Carousel label="Gallery" slides={slides}>
      extra
    </Carousel>
    {/* @ts-expect-error — the region has to be named; no library can supply it. */}
    <Carousel slides={slides} />
    {/* @ts-expect-error — there is nothing to show without slides. */}
    <Carousel label="Gallery" />
    {/* @ts-expect-error — the count is derived from slides, never declared. */}
    <Carousel label="Gallery" slides={slides} slideCount={3} />
    {/* @ts-expect-error — the file draws one orientation; a vertical carousel has no skin. */}
    <Carousel label="Gallery" slides={slides} orientation="vertical" />
    {/* @ts-expect-error — which page is showing is the machine's, driven by page / defaultPage. */}
    <Carousel label="Gallery" slides={slides} state="active" />
  </>
)
