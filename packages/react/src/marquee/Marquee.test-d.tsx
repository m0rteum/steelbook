/**
 * Compile-time conformance test: `Tone` is the one axis, the strip
 * cannot be built without an accessible name or something to say, and
 * nothing about its motion or its states leaks in as a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening MarqueeProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Marquee } from './Marquee'

// Accepted — the drawn strip, on the default Inverse tone.
export const basic = <Marquee label="Release announcement">STEELBOOK V1.0</Marquee>

// Accepted — Tone=Accent, the other drawn variant.
export const accent = <Marquee label="Release announcement" tone="accent">STEELBOOK V1.0</Marquee>

// Accepted — the phrase is composed, so it need not be a bare string.
export const composed = <Marquee label="Release announcement"><strong>STEELBOOK</strong> V1.0</Marquee>

// Accepted — pausing is the caller's to control, and the default is Ark's.
export const controlledPause = <Marquee label="Ticker" paused onPauseChange={({ paused }) => void paused}>STEELBOOK V1.0</Marquee>

// Accepted — speed, direction and fill all pass through to the machine.
export const tuned = <Marquee label="Ticker" speed={80} side="end" autoFill={false}>STEELBOOK V1.0</Marquee>

// Accepted — native div attributes reach the drawn box.
export const nativeAttrs = <Marquee label="Ticker" id="ticker" data-testid="ticker">STEELBOOK V1.0</Marquee>

// @ts-expect-error — Ark names the region "Marquee content" otherwise, which names nothing.
export const unnamed = <Marquee>STEELBOOK V1.0</Marquee>

// @ts-expect-error — a ticker with nothing to say is not a state the design draws.
export const silent = <Marquee label="Ticker" />

// @ts-expect-error — Tone is the drawn axis; these two are its only values.
export const unknownTone = <Marquee label="Ticker" tone="muted">STEELBOOK V1.0</Marquee>

// @ts-expect-error — the label is the region's name, not a node to render.
export const richLabel = <Marquee label={<span>Ticker</span>}>STEELBOOK V1.0</Marquee>

// @ts-expect-error — Ark's own translations are replaced by `label`, not composed with it.
export const rawTranslations = <Marquee label="Ticker" translations={{ root: 'Ticker' }}>STEELBOOK V1.0</Marquee>
