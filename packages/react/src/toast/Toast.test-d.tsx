/**
 * Compile-time conformance test: Figma's `Tone` axis is the toast's own
 * `type`, never a prop on the region, and the slab's contents come from
 * the store rather than from children.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ToasterProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { TOAST_TONES, Toaster, createToaster } from './Toast'

const toaster = createToaster({ placement: 'bottom-end' })

// Accepted — the region, mounted once.
export const basic = <Toaster toaster={toaster} />

// Accepted — Ark labels the region "Notifications"; this overrides it.
export const labelled = <Toaster toaster={toaster} aria-label="Alerts" />

// Accepted — Tone rides on the toast, in the machine's vocabulary.
export const tones = () => {
  toaster.create({
    type: TOAST_TONES.neutral,
    title: 'Draft saved',
    description: 'Your work is safe on this device.',
  })
  toaster.create({ type: TOAST_TONES.success, title: 'Draft saved' })
  toaster.create({ type: TOAST_TONES.danger, title: 'Draft saved' })
  toaster.create({ type: TOAST_TONES.warning, title: 'Draft saved' })
  toaster.create({ type: TOAST_TONES.info, title: 'Draft saved' })
}

// @ts-expect-error — Tone is the toast's type, not a prop on the region.
export const toneAsProp = <Toaster toaster={toaster} tone="success" />

// @ts-expect-error — the slabs come from the store; children are not composed here.
export const withChildren = <Toaster toaster={toaster}>extra</Toaster>

// @ts-expect-error — a region without a store has nothing to render.
export const storeless = <Toaster />
