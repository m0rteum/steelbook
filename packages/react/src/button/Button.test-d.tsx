/**
 * Compile-time conformance test for the Figma Button component's two
 * standing constraints: the label is not optional, and `State` is an
 * interaction skin rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ButtonProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { createRef } from 'react'
import { Button } from './Button'
import { ArrowRightIcon } from '../icons'

// Accepted — label, both optional axes, both icon slots, native props.
export const minimal = <Button>Save</Button>
export const full = (
  <Button size="lg" tone="danger" iconRight={<ArrowRightIcon />} onClick={() => {}}>
    Delete project
  </Button>
)

// Accepted — State=Disabled is reached through the native attribute.
export const disabled = (
  <Button tone="ghost" disabled>
    Save
  </Button>
)

// Accepted — a native button ref passes straight through.
export const withRef = <Button ref={createRef<HTMLButtonElement>()}>Save</Button>

// @ts-expect-error — a button must carry a label.
export const unlabelled = <Button />

// @ts-expect-error — sizes are the three control heights, nothing else.
export const badSize = <Button size="xl">Save</Button>

// @ts-expect-error — tones are the five in the design, nothing else.
export const badTone = <Button tone="warning">Save</Button>

// @ts-expect-error — Hover/Active/Focus are CSS states, never a prop.
export const stateAsProp = <Button state="Hover">Save</Button>
