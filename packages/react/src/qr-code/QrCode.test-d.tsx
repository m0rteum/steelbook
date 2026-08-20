/**
 * Compile-time conformance test: a QR code always has something to
 * encode, and the drawn matrix is generated rather than composed.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening QrCodeProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { QrCode } from './QrCode'

// Accepted — a value, named for anyone who cannot scan it.
export const named = (
  <QrCode value="https://steelbook.design" aria-label="Link to steelbook.design" />
)

// Accepted — unnamed, in which case the graphic is marked decorative.
export const decorative = <QrCode value="https://steelbook.design" />

// Accepted — named by reference, with a larger module size.
export const sized = (
  <QrCode value="sb_live_4d00ff2b1d" pixelSize={12} aria-labelledby="key-heading" />
)

// @ts-expect-error — a QR code with nothing to encode is meaningless.
export const valueless = <QrCode aria-label="Link" />

// @ts-expect-error — the matrix is generated; modules are not composed here.
export const withChildren = <QrCode value="x">modules</QrCode>
