/**
 * Compile-time conformance test: the Figma `State` axis is the machine's,
 * derived from the current step and the position, and `Number` is that
 * position rather than something passed in.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening StepsProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Steps } from './Steps'

// Accepted — the drawn rail: four rungs, sitting on the second.
export const basic = <Steps steps={['Cart', 'Shipping', 'Payment', 'Done']} defaultStep={1} />

// Accepted — the step is the caller's to control.
export const controlled = (
  <Steps steps={['Cart', 'Done']} step={1} onStepChange={({ step }) => void step} />
)

// Accepted — forward navigation in order is Ark's, not a redraw.
export const linear = <Steps steps={['Cart', 'Done']} linear />

// @ts-expect-error — State is the machine's, derived from the current step.
export const stateAsProp = <Steps steps={['Cart']} state="Complete" />

// @ts-expect-error — the count comes from the labels; there is nothing to keep in sync.
export const countAsProp = <Steps steps={['Cart', 'Done']} count={2} />

// @ts-expect-error — the rungs come from the labels; children are not composed here.
export const withChildren = <Steps steps={['Cart']}>extra</Steps>

// @ts-expect-error — a rail with no rungs has nothing to draw.
export const stepless = <Steps />
