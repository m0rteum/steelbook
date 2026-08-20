/**
 * Compile-time conformance test: a Clipboard always carries a label,
 * the value is data, and the Figma `Copied` axis is Ark's own state
 * rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ClipboardProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Clipboard } from './Clipboard'

// Accepted — the drawn default.
export const basic = <Clipboard label="API key" value="sb_live_4d00ff2b1d" />

// Accepted — controlled value, copy callback, and a longer reset window.
export const controlled = (
  <Clipboard
    label="API key"
    value="sb_live_4d00ff2b1d"
    timeout={5000}
    onValueChange={({ value }) => void value}
    onStatusChange={({ copied }) => void copied}
  />
)

// @ts-expect-error — the well is named by its label, which is required.
export const unlabelled = <Clipboard value="sb_live_4d00ff2b1d" />

// @ts-expect-error — Copied is Ark's state, never a prop.
export const copiedAsProp = <Clipboard label="API key" value="x" copied />

// @ts-expect-error — the parts are fixed by the design; children are not composed here.
export const withChildren = <Clipboard label="API key" value="x">extra</Clipboard>
