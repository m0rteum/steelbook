/**
 * Compile-time conformance test: a Signature Pad always carries a
 * label, and the Figma `State` axis is Ark's own emptiness — never a
 * prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening SignaturePadProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { SignaturePad } from './SignaturePad'

// Accepted — the drawn default.
export const basic = <SignaturePad label="Signature" />

// Accepted — the Signed note carries a stamp the component cannot know.
export const signed = (
  <SignaturePad
    label="Signature"
    name="signature"
    signedHint="Signed — 18 AUG 2026"
    onDrawEnd={({ getDataUrl }) => void getDataUrl('image/png')}
  />
)

// Accepted — Ark's own switches pass straight through.
export const constrained = (
  <SignaturePad label="Signature" disabled required readOnly drawing={{ size: 3 }} />
)

// @ts-expect-error — the pad is named by its label, which is required.
export const unlabelled = <SignaturePad />

// @ts-expect-error — Signed is Ark's emptiness, not a state prop.
export const stateAsProp = <SignaturePad label="Signature" state="Signed" />

// @ts-expect-error — the parts are fixed by the design; children are not composed here.
export const withChildren = <SignaturePad label="Signature">extra</SignaturePad>
